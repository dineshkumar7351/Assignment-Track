const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

/**
 * @desc    Get monthly calendar events with color-coded deadline statuses
 * @route   GET /api/calendar
 * @access  Private (Student, Teacher, Admin)
 */
const getCalendarEvents = async (req, res) => {
  try {
    const user = req.user;
    const now = new Date();

    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1; // 1-indexed

    // Calculate start and end date for the requested month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    let assignmentQuery = {
      status: 'published',
      deadline: { $gte: startDate, $lte: endDate },
    };

    if (user.role === 'teacher') {
      assignmentQuery = {
        teacherId: user._id,
        deadline: { $gte: startDate, $lte: endDate },
      };
    } else if (user.role === 'student') {
      const studentDept = user.department || 'Computer Science & Engineering';
      const deptPrefix = studentDept.split(/[\s,&]+/)[0];

      assignmentQuery = {
        status: 'published',
        deadline: { $gte: startDate, $lte: endDate },
        $or: [
          { department: studentDept },
          { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
          { department: 'General' },
        ],
      };
    }

    // Fetch assignments for the month
    const assignments = await Assignment.find(assignmentQuery)
      .populate('subjectId', 'name code')
      .populate('teacherId', 'fullName email')
      .sort({ deadline: 1 })
      .lean();

    // If student, fetch student's submissions for these assignments
    const submissionMap = new Map();
    if (user.role === 'student') {
      const assignmentIds = assignments.map((a) => a._id);
      const submissions = await Submission.find({
        student: user._id,
        assignment: { $in: assignmentIds },
      }).lean();

      submissions.forEach((sub) => {
        submissionMap.set(sub.assignment.toString(), sub);
      });
    }

    // If teacher, fetch submission counts per assignment
    const submissionCountsMap = new Map();
    if (user.role === 'teacher') {
      const assignmentIds = assignments.map((a) => a._id);
      const submissions = await Submission.find({
        assignment: { $in: assignmentIds },
      }).select('assignment status');

      submissions.forEach((sub) => {
        const aId = sub.assignment.toString();
        submissionCountsMap.set(aId, (submissionCountsMap.get(aId) || 0) + 1);
      });
    }

    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Group events by date (YYYY-MM-DD)
    const eventsByDate = {};
    let upcomingCount = 0;
    let dueSoonCount = 0;
    let overdueCount = 0;
    let submittedCount = 0;

    assignments.forEach((a) => {
      const deadline = new Date(a.deadline);
      const dateKey = deadline.toISOString().split('T')[0];

      let status = 'upcoming'; // default
      const sub = submissionMap.get(a._id.toString());

      if (user.role === 'student') {
        if (sub) {
          status = 'submitted';
          submittedCount++;
        } else if (deadline < now) {
          status = 'overdue';
          overdueCount++;
        } else if (deadline <= in48Hours) {
          status = 'due_soon';
          dueSoonCount++;
        } else {
          status = 'upcoming';
          upcomingCount++;
        }
      } else {
        // Teacher view
        if (deadline < now) {
          status = 'overdue';
          overdueCount++;
        } else if (deadline <= in48Hours) {
          status = 'due_soon';
          dueSoonCount++;
        } else {
          status = 'upcoming';
          upcomingCount++;
        }
      }

      const eventItem = {
        _id: a._id,
        title: a.title,
        subject: a.subjectId?.name || a.subject || 'Academic Subject',
        subjectCode: a.subjectId?.code || '',
        deadline: a.deadline,
        totalMarks: a.maxMarks || a.totalMarks || 100,
        priority: a.priority,
        difficulty: a.difficulty,
        status, // 'upcoming' | 'due_soon' | 'overdue' | 'submitted'
        submission: sub
          ? {
              _id: sub._id,
              submittedAt: sub.submittedAt,
              status: sub.status,
              obtainedMarks: sub.obtainedMarks,
            }
          : null,
        submittedCount: submissionCountsMap.get(a._id.toString()) || 0,
      };

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(eventItem);
    });

    return res.status(200).json({
      success: true,
      data: {
        year,
        month,
        totalAssignments: assignments.length,
        summary: {
          upcoming: upcomingCount,
          dueSoon: dueSoonCount,
          overdue: overdueCount,
          submitted: submittedCount,
        },
        eventsByDate,
        assignments,
      },
    });
  } catch (error) {
    console.error('Error in getCalendarEvents:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving calendar events',
      error: error.message,
    });
  }
};

module.exports = {
  getCalendarEvents,
};
