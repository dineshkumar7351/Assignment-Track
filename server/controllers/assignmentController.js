const Assignment = require('../models/Assignment');
const Subject = require('../models/Subject');
const Submission = require('../models/Submission');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

/**
 * Helper to calculate dynamic status for a student given assignment deadline and submission
 */
const calculateStudentStatus = (deadline, submission) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);

  if (submission) {
    if (submission.status === 'graded') return 'Graded';
    return 'Submitted';
  }

  if (deadlineDate < now) {
    return 'Overdue';
  }

  const hoursToDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursToDeadline <= 48) {
    return 'Due Soon';
  }

  return 'Upcoming';
};

/**
 * @desc    Get all assignments with search, filter, sort, and dynamic statuses
 * @route   GET /api/assignments
 * @access  Private (Authenticated users)
 */
const getAssignments = async (req, res) => {
  try {
    const {
      search,
      subjectId,
      priority,
      difficulty,
      status,
      sortBy = 'deadline_asc',
    } = req.query;

    const user = req.user;
    const isStudent = user.role === 'student';
    const isTeacher = user.role === 'teacher';

    const query = { status: 'published' };

    // Teacher can view their own assignments (or department assignments)
    if (isTeacher && req.query.myAssignments === 'true') {
      query.teacherId = user._id;
    } else if (user.department) {
      const deptPrefix = user.department.split(/[\s,&]+/)[0];
      query.$or = [
        { department: user.department },
        { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
        { department: 'General' },
      ];
    }

    // Search filter (title or description)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ title: searchRegex }, { description: searchRegex }, { subject: searchRegex }],
      });
    }

    // Subject filter
    if (subjectId) {
      query.subjectId = subjectId;
    }

    // Priority filter
    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      query.priority = priority.toLowerCase();
    }

    // Difficulty filter
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      query.difficulty = difficulty.toLowerCase();
    }

    // Sorting
    let sortOptions = { deadline: 1 };
    if (sortBy === 'deadline_desc') {
      sortOptions = { deadline: -1 };
    } else if (sortBy === 'marks_desc') {
      sortOptions = { maxMarks: -1 };
    } else if (sortBy === 'marks_asc') {
      sortOptions = { maxMarks: 1 };
    } else if (sortBy === 'recent') {
      sortOptions = { createdAt: -1 };
    }

    // Fetch assignments
    const assignments = await Assignment.find(query)
      .populate('subjectId', 'name code')
      .populate('teacherId', 'fullName email')
      .sort(sortOptions)
      .lean();

    // If Student: cross-reference submissions for dynamic status calculation
    if (isStudent) {
      const studentSubmissions = await Submission.find({ student: user._id }).lean();
      const submissionMap = new Map(
        studentSubmissions.map((s) => [s.assignment.toString(), s])
      );

      let processed = assignments.map((a) => {
        const sub = submissionMap.get(a._id.toString());
        const dynamicStatus = calculateStudentStatus(a.deadline, sub);

        return {
          ...a,
          totalMarks: a.maxMarks,
          status: dynamicStatus,
          submission: sub
            ? {
                _id: sub._id,
                submittedAt: sub.submittedAt,
                status: sub.status,
                obtainedMarks: sub.obtainedMarks,
                feedback: sub.feedback,
                similarityScore: sub.similarityScore,
              }
            : null,
        };
      });

      // Filter by dynamic status if requested
      if (status && status !== 'all') {
        processed = processed.filter(
          (a) => a.status.toLowerCase() === status.toLowerCase()
        );
      }

      return res.status(200).json({
        success: true,
        count: processed.length,
        data: processed,
      });
    }

    // If Teacher: attach submission counts
    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await Submission.find({ assignment: { $in: assignmentIds } }).lean();

    const subsByAssignment = new Map();
    submissions.forEach((s) => {
      const aId = s.assignment.toString();
      if (!subsByAssignment.has(aId)) subsByAssignment.set(aId, []);
      subsByAssignment.get(aId).push(s);
    });

    const totalStudents = await User.countDocuments({ role: 'student' });

    const processed = assignments.map((a) => {
      const aSubs = subsByAssignment.get(a._id.toString()) || [];
      const submittedCount = aSubs.length;
      const gradedCount = aSubs.filter((s) => s.status === 'graded').length;

      return {
        ...a,
        totalMarks: a.maxMarks,
        totalStudents: Math.max(totalStudents, 3),
        submittedCount,
        gradedCount,
        pendingCount: Math.max(0, Math.max(totalStudents, 3) - submittedCount),
      };
    });

    return res.status(200).json({
      success: true,
      count: processed.length,
      data: processed,
    });
  } catch (error) {
    console.error('Error in getAssignments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving assignments',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single assignment details by ID
 * @route   GET /api/assignments/:id
 * @access  Private (Authenticated users)
 */
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subjectId', 'name code department description')
      .populate('teacherId', 'fullName email department')
      .lean();

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const user = req.user;

    // Student view context
    if (user.role === 'student') {
      const submission = await Submission.findOne({
        assignment: assignment._id,
        student: user._id,
      })
        .populate('gradedBy', 'fullName')
        .lean();

      const dynamicStatus = calculateStudentStatus(assignment.deadline, submission);

      return res.status(200).json({
        success: true,
        data: {
          ...assignment,
          totalMarks: assignment.maxMarks,
          status: dynamicStatus,
          submission: submission || null,
        },
      });
    }

    // Teacher / Admin view context
    const submissions = await Submission.find({ assignment: assignment._id })
      .populate('student', 'fullName email studentId department')
      .sort({ submittedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...assignment,
        totalMarks: assignment.maxMarks,
        submissionsCount: submissions.length,
        submissions,
      },
    });
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving assignment details',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Private (Teacher or Admin only)
 */
const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      subjectId,
      deadline,
      maxMarks,
      difficulty,
      priority,
      attachmentUrl,
      attachmentName,
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Assignment title is required' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Assignment description is required' });
    }

    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'Subject selection is required' });
    }

    if (!deadline) {
      return res.status(400).json({ success: false, message: 'Submission deadline is required' });
    }

    const marks = Number(maxMarks);
    if (!marks || marks <= 0) {
      return res.status(400).json({ success: false, message: 'Max marks must be greater than 0' });
    }

    // Find Subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(400).json({ success: false, message: 'Invalid subject selected' });
    }

    const newAssignment = await Assignment.create({
      title: title.trim(),
      description: description.trim(),
      instructions: instructions ? instructions.trim() : '',
      subjectId: subject._id,
      subject: subject.name,
      department: subject.department || req.user.department || 'Computer Science & Engineering',
      teacherId: req.user._id,
      deadline: new Date(deadline),
      maxMarks: marks,
      difficulty: difficulty || 'medium',
      priority: priority || 'medium',
      attachmentUrl: attachmentUrl || '',
      attachmentName: attachmentName || '',
      status: 'published',
    });

    const populated = await Assignment.findById(newAssignment._id)
      .populate('subjectId', 'name code')
      .populate('teacherId', 'fullName email');

    // Notify enrolled students in the department
    notificationService.notifyNewAssignment(populated).catch((err) => {
      console.error('Background notification error for new assignment:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Error in createAssignment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating assignment',
      error: error.message,
    });
  }
};

/**
 * @desc    Update an existing assignment
 * @route   PUT /api/assignments/:id
 * @access  Private (Teacher who created it or Admin only)
 */
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Check ownership: Teacher can only update their own assignment
    if (req.user.role !== 'admin' && !assignment.teacherId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to edit this assignment',
      });
    }

    const {
      title,
      description,
      instructions,
      subjectId,
      deadline,
      maxMarks,
      difficulty,
      priority,
      attachmentUrl,
      attachmentName,
    } = req.body;

    const oldDeadline = assignment.deadline ? new Date(assignment.deadline).getTime() : null;
    let deadlineChanged = false;

    if (deadline && new Date(deadline).getTime() !== oldDeadline) {
      assignment.deadline = new Date(deadline);
      deadlineChanged = true;
    }

    if (title && title.trim()) assignment.title = title.trim();
    if (description && description.trim()) assignment.description = description.trim();
    if (instructions !== undefined) assignment.instructions = instructions.trim();
    if (maxMarks && Number(maxMarks) > 0) assignment.maxMarks = Number(maxMarks);
    if (difficulty) assignment.difficulty = difficulty;
    if (priority) assignment.priority = priority;
    if (attachmentUrl !== undefined) assignment.attachmentUrl = attachmentUrl;
    if (attachmentName !== undefined) assignment.attachmentName = attachmentName;

    if (subjectId && subjectId !== assignment.subjectId?.toString()) {
      const subject = await Subject.findById(subjectId);
      if (subject) {
        assignment.subjectId = subject._id;
        assignment.subject = subject.name;
        assignment.department = subject.department;
      }
    }

    await assignment.save();

    const updated = await Assignment.findById(assignment._id)
      .populate('subjectId', 'name code')
      .populate('teacherId', 'fullName email');

    if (deadlineChanged) {
      notificationService.notifyDeadlineChanged(updated, oldDeadline).catch((err) => {
        console.error('Background notification error for deadline change:', err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error in updateAssignment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating assignment',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete an assignment and associated submissions
 * @route   DELETE /api/assignments/:id
 * @access  Private (Teacher who created it or Admin only)
 */
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && !assignment.teacherId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this assignment',
      });
    }

    // Delete associated submissions
    await Submission.deleteMany({ assignment: assignment._id });

    // Delete assignment
    await Assignment.findByIdAndDelete(assignment._id);

    res.status(200).json({
      success: true,
      message: 'Assignment and associated submissions deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteAssignment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting assignment',
      error: error.message,
    });
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
