const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');

/**
 * @desc    Get dynamic Student Dashboard metrics, upcoming assignments, and activity
 * @route   GET /api/dashboard/student
 * @access  Private (Student only)
 */
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    const studentDept = req.user.department || 'Computer Science & Engineering';
    const now = new Date();

    // Query assignments for student's department
    const deptPrefix = studentDept.split(/[\s,&]+/)[0];
    const deptQuery = {
      status: 'published',
      $or: [
        { department: studentDept },
        { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
        { department: 'General' },
      ],
    };

    // 1. Fetch published assignments for the student's department
    const assignments = await Assignment.find(deptQuery)
      .sort({ deadline: 1 })
      .populate('teacherId', 'fullName email')
      .populate('subjectId', 'name code')
      .lean();

    // 2. Fetch all submissions by this student
    const submissions = await Submission.find({ student: studentId })
      .populate('assignment')
      .populate('gradedBy', 'fullName')
      .lean();

    // Create a fast submission lookup map by assignment ID
    const submissionMap = new Map();
    submissions.forEach((sub) => {
      if (sub.assignment) {
        submissionMap.set(sub.assignment._id.toString(), sub);
      }
    });

    // 3. Compute dynamic live statistics
    let submittedCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let totalObtainedMarks = 0;
    let totalMaxMarks = 0;
    let gradedCount = 0;

    const enrichedAssignments = assignments.map((assignment) => {
      const sub = submissionMap.get(assignment._id.toString());
      const isPastDeadline = new Date(assignment.deadline) < now;
      const marksVal = assignment.maxMarks || assignment.totalMarks || 100;

      let studentStatus = 'Pending';
      if (sub) {
        submittedCount++;
        studentStatus = sub.status === 'graded' ? 'Graded' : 'Submitted';
        if (sub.status === 'graded' && typeof sub.obtainedMarks === 'number') {
          totalObtainedMarks += sub.obtainedMarks;
          totalMaxMarks += marksVal;
          gradedCount++;
        }
      } else if (isPastDeadline) {
        overdueCount++;
        studentStatus = 'Overdue';
      } else {
        pendingCount++;
        studentStatus = 'Pending';
      }

      return {
        _id: assignment._id,
        title: assignment.title,
        subject: assignment.subjectId?.name || assignment.subject || 'Academic Subject',
        deadline: assignment.deadline,
        totalMarks: marksVal,
        priority: assignment.priority,
        status: studentStatus,
        submission: sub
          ? {
              _id: sub._id,
              submittedAt: sub.submittedAt,
              status: sub.status,
              obtainedMarks: sub.obtainedMarks,
              feedback: sub.feedback,
            }
          : null,
      };
    });

    const totalAssignments = assignments.length;
    const completionRate =
      totalAssignments > 0
        ? Math.round((submittedCount / totalAssignments) * 100 * 10) / 10
        : 0;

    const averageScore =
      gradedCount > 0 && totalMaxMarks > 0
        ? Math.round((totalObtainedMarks / totalMaxMarks) * 100 * 10) / 10
        : 0;

    // 4. Upcoming assignments: Next 5 assignments ordered by deadline
    const upcomingAssignments = enrichedAssignments.slice(0, 5);

    // 5. Gather Recent Activity Stream
    const activities = [];

    // Add submissions activity
    submissions.forEach((sub) => {
      if (sub.assignment) {
        activities.push({
          id: `sub-${sub._id}`,
          type: 'submission',
          title: `Coursework Submitted`,
          description: `You submitted "${sub.assignment.title}"`,
          subject: sub.assignment.subject || 'Academic Subject',
          timestamp: sub.submittedAt,
          status: sub.status,
        });

        if (sub.status === 'graded' && sub.gradedAt) {
          activities.push({
            id: `eval-${sub._id}`,
            type: 'evaluation',
            title: `Grading & Feedback Received`,
            description: `Score: ${sub.obtainedMarks}/${sub.assignment.maxMarks || sub.assignment.totalMarks || 100}`,
            feedback: sub.feedback,
            subject: sub.assignment.subject || 'Academic Subject',
            assignmentTitle: sub.assignment.title,
            gradedBy: sub.gradedBy?.fullName || 'Faculty Instructor',
            timestamp: sub.gradedAt,
          });
        }
      }
    });

    // Add new assignments published in the last 14 days
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    assignments.forEach((a) => {
      if (new Date(a.createdAt) >= fourteenDaysAgo) {
        activities.push({
          id: `new-${a._id}`,
          type: 'new_assignment',
          title: `New Assignment Published`,
          description: `"${a.title}" was posted with deadline ${new Date(a.deadline).toLocaleDateString()}`,
          subject: a.subjectId?.name || a.subject || 'Academic Subject',
          priority: a.priority,
          timestamp: a.createdAt,
        });
      }
    });

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentActivity = activities.slice(0, 6);

    res.status(200).json({
      success: true,
      data: {
        student: {
          fullName: req.user.fullName,
          email: req.user.email,
          department: studentDept,
          studentId: req.user.studentId,
        },
        statistics: {
          totalAssignments,
          pendingAssignments: pendingCount,
          submittedAssignments: submittedCount,
          overdueAssignments: overdueCount,
          averageScore,
          completionRate,
        },
        progress: {
          completionRate,
          total: totalAssignments,
          submitted: submittedCount,
          pending: pendingCount,
          overdue: overdueCount,
        },
        upcomingAssignments,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving student dashboard information',
      error: error.message,
    });
  }
};

/**
 * @desc    Get dynamic Teacher Dashboard metrics, recent assignments, and submissions
 * @route   GET /api/dashboard/teacher
 * @access  Private (Teacher only)
 */
const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacherDept = req.user.department || 'Computer Science & Engineering';

    // 1. Fetch total enrolled students in teacher's department
    const deptPrefix = teacherDept.split(/[\s,&]+/)[0];
    const totalStudentsCount = await User.countDocuments({
      role: 'student',
      $or: [
        { department: teacherDept },
        { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
      ],
    });

    const effectiveTotalStudents = Math.max(totalStudentsCount, 3);

    // 2. Fetch all assignments created strictly by this teacher
    const teacherAssignments = await Assignment.find({ teacherId })
      .populate('subjectId', 'name code')
      .sort({ createdAt: -1 })
      .lean();

    const assignmentIds = teacherAssignments.map((a) => a._id);

    // 3. Fetch all submissions for this teacher's assignments
    const teacherSubmissions = await Submission.find({
      assignment: { $in: assignmentIds },
    })
      .populate('student', 'fullName email studentId department')
      .populate({
        path: 'assignment',
        populate: { path: 'subjectId', select: 'name code' },
      })
      .sort({ submittedAt: -1 })
      .lean();

    // 4. Compute live teacher metrics
    let pendingEvaluations = 0;
    let evaluatedSubmissions = 0;
    let totalObtainedMarks = 0;
    let totalMaxMarks = 0;
    let highSimilarityCount = 0;

    const submissionsByAssignment = new Map();

    teacherSubmissions.forEach((sub) => {
      const aId = sub.assignment?._id?.toString();
      if (aId) {
        if (!submissionsByAssignment.has(aId)) {
          submissionsByAssignment.set(aId, []);
        }
        submissionsByAssignment.get(aId).push(sub);
      }

      const marksPossible = sub.assignment?.maxMarks || sub.assignment?.totalMarks || 100;

      if (sub.status === 'graded' && typeof sub.obtainedMarks === 'number') {
        evaluatedSubmissions++;
        totalObtainedMarks += sub.obtainedMarks;
        totalMaxMarks += marksPossible;
      } else {
        pendingEvaluations++;
      }

      if (typeof sub.similarityScore === 'number' && sub.similarityScore >= 25) {
        highSimilarityCount++;
      }
    });

    const totalAssignments = teacherAssignments.length;
    const totalSubmissions = teacherSubmissions.length;
    const averageMarks =
      evaluatedSubmissions > 0 && totalMaxMarks > 0
        ? Math.round((totalObtainedMarks / totalMaxMarks) * 100 * 10) / 10
        : 0;

    // 5. Recent Assignments created by this teacher
    const recentAssignments = teacherAssignments.slice(0, 5).map((assignment) => {
      const subs = submissionsByAssignment.get(assignment._id.toString()) || [];
      const submittedCount = subs.length;
      const pendingCount = Math.max(0, effectiveTotalStudents - submittedCount);

      return {
        _id: assignment._id,
        title: assignment.title,
        subject: assignment.subjectId?.name || assignment.subject || 'Academic Subject',
        deadline: assignment.deadline,
        totalMarks: assignment.maxMarks || assignment.totalMarks || 100,
        priority: assignment.priority,
        totalStudents: effectiveTotalStudents,
        submittedCount,
        pendingCount,
        createdAt: assignment.createdAt,
      };
    });

    // 6. Recent Submissions across this teacher's assignments
    const recentSubmissions = teacherSubmissions.slice(0, 6).map((sub) => ({
      _id: sub._id,
      student: {
        _id: sub.student?._id,
        fullName: sub.student?.fullName || 'Anonymous Student',
        email: sub.student?.email,
        studentId: sub.student?.studentId || 'N/A',
      },
      assignment: {
        _id: sub.assignment?._id,
        title: sub.assignment?.title || 'Coursework Assignment',
        subject: sub.assignment?.subjectId?.name || sub.assignment?.subject || 'Academic Subject',
        totalMarks: sub.assignment?.maxMarks || sub.assignment?.totalMarks || 100,
      },
      submittedAt: sub.submittedAt,
      status: sub.status,
      obtainedMarks: sub.obtainedMarks,
      feedback: sub.feedback,
      similarityScore: sub.similarityScore,
      similarityStatus: sub.similarityStatus || 'clean',
    }));

    res.status(200).json({
      success: true,
      data: {
        teacher: {
          fullName: req.user.fullName,
          email: req.user.email,
          department: teacherDept,
          employeeId: req.user.employeeId,
        },
        statistics: {
          totalAssignments,
          totalSubmissions,
          pendingEvaluations,
          evaluatedSubmissions,
          averageMarks,
          highSimilaritySubmissions: highSimilarityCount,
        },
        recentAssignments,
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving teacher dashboard information',
      error: error.message,
    });
  }
};

module.exports = {
  getStudentDashboard,
  getTeacherDashboard,
};
