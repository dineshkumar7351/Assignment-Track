const path = require('path');
const Submission = require('../models/Submission');
const SubmissionVersion = require('../models/SubmissionVersion');
const Assignment = require('../models/Assignment');
const { processFileUpload } = require('../config/uploadConfig');
const similarityService = require('../services/similarityService');
const notificationService = require('../services/notificationService');

/**
 * @desc    Submit or update coursework deliverable
 * @route   POST /api/submissions/:assignmentId
 * @access  Private (Student only)
 */
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user._id;

    // 1. Verify Assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // 2. Validate deadline: Resubmissions and uploads are strictly blocked after deadline
    const now = new Date();
    if (new Date(assignment.deadline) < now) {
      return res.status(400).json({
        success: false,
        message: 'Submission deadline has passed. Submissions are closed for this assignment.',
      });
    }

    // 3. Verify file was provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a submission file (PDF, DOCX, PPTX, or TXT)',
      });
    }

    const { comment = '' } = req.body;
    const ext = path.extname(req.file.originalname).slice(1).toLowerCase();
    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    // Extract raw text for similarity analysis
    let extractedContent = '';
    try {
      extractedContent = await similarityService.extractText(req.file.path || req.file.buffer, ext);
    } catch (e) {
      console.warn('Text extraction warning during submission upload:', e.message);
    }

    // 4. Process upload (Cloudinary or local static fallback)
    const { url } = await processFileUpload(req.file);

    // 5. Check if submission already exists for this student & assignment
    let submission = await Submission.findOne({
      $or: [
        { assignment: assignmentId, student: studentId },
        { assignmentId: assignmentId, studentId: studentId },
      ],
    });

    let currentVersionNum = 1;

    if (!submission) {
      // First submission (Version 1)
      submission = await Submission.create({
        assignment: assignment._id,
        assignmentId: assignment._id,
        student: studentId,
        studentId: studentId,
        fileUrl: url,
        fileName,
        fileType: ext,
        version: 1,
        comment: comment.trim(),
        content: extractedContent || comment.trim(),
        status: 'submitted',
        submittedAt: now,
      });

      // Create first SubmissionVersion snapshot
      await SubmissionVersion.create({
        submissionId: submission._id,
        assignmentId: assignment._id,
        studentId: studentId,
        version: 1,
        fileUrl: url,
        fileName,
        fileType: ext,
        fileSize,
        comment: comment.trim(),
        submittedAt: now,
        isCurrent: true,
      });
    } else {
      // Resubmission before deadline: Increment version
      currentVersionNum = (submission.version || 1) + 1;

      // Mark all previous versions as isCurrent: false
      await SubmissionVersion.updateMany(
        { submissionId: submission._id },
        { $set: { isCurrent: false } }
      );

      // Create new Version snapshot
      await SubmissionVersion.create({
        submissionId: submission._id,
        assignmentId: assignment._id,
        studentId: studentId,
        version: currentVersionNum,
        fileUrl: url,
        fileName,
        fileType: ext,
        fileSize,
        comment: comment.trim() || submission.comment,
        submittedAt: now,
        isCurrent: true,
      });

      // Update primary Submission record
      submission.fileUrl = url;
      submission.fileName = fileName;
      submission.fileType = ext;
      submission.version = currentVersionNum;
      submission.comment = comment.trim() || submission.comment;
      submission.content = extractedContent || submission.content || comment.trim();
      submission.submittedAt = now;
      submission.status = 'submitted';
      await submission.save();
    }

    // Trigger similarity calculation for this assignment cohort asynchronously
    similarityService.scanAssignmentSimilarity(assignment._id).catch((err) => {
      console.error('Background similarity scan error on submit:', err);
    });

    // Notify student confirmation and faculty
    notificationService.notifySubmissionSuccess(submission, assignment, req.user).catch((err) => {
      console.error('Background notification error for submission:', err.message);
    });

    // Fetch full version history
    const versions = await SubmissionVersion.find({ submissionId: submission._id })
      .sort({ version: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: `Assignment submitted successfully as Version ${currentVersionNum}`,
      data: {
        ...submission.toObject(),
        versions,
      },
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error processing assignment submission',
    });
  }
};

/**
 * @desc    Get student's submission and version history for a specific assignment
 * @route   GET /api/submissions/assignment/:assignmentId
 * @access  Private (Student, Assignment's Teacher, or Admin)
 */
const getAssignmentSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const user = req.user;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    let query = {
      $or: [
        { assignment: assignmentId },
        { assignmentId: assignmentId },
      ],
    };

    if (user.role === 'student') {
      query.$and = [
        {
          $or: [{ student: user._id }, { studentId: user._id }],
        },
      ];
    } else if (req.query.studentId) {
      query.$and = [
        {
          $or: [{ student: req.query.studentId }, { studentId: req.query.studentId }],
        },
      ];
    }

    const submission = await Submission.findOne(query)
      .populate('student', 'fullName email studentId department')
      .populate('gradedBy', 'fullName')
      .lean();

    if (!submission) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No submission found for this assignment',
      });
    }

    // Fetch version history sorted newest first
    const versions = await SubmissionVersion.find({ submissionId: submission._id })
      .sort({ version: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...submission,
        versions,
      },
    });
  } catch (error) {
    console.error('Error retrieving assignment submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving submission details',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all submissions for teacher's assignments
 * @route   GET /api/submissions/teacher
 * @access  Private (Teacher or Admin only)
 */
const getTeacherSubmissions = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { assignmentId, status, search } = req.query;

    // Find all assignments owned by this teacher
    const teacherAssignmentQuery = req.user.role === 'admin' ? {} : { teacherId };
    if (assignmentId) {
      teacherAssignmentQuery._id = assignmentId;
    }

    const teacherAssignments = await Assignment.find(teacherAssignmentQuery).select('_id title subject');
    const teacherAssignmentIds = teacherAssignments.map((a) => a._id);

    // Build query for submissions
    const submissionQuery = {
      $or: [
        { assignment: { $in: teacherAssignmentIds } },
        { assignmentId: { $in: teacherAssignmentIds } },
      ],
    };

    if (status && status !== 'all') {
      submissionQuery.status = status.toLowerCase();
    }

    let submissions = await Submission.find(submissionQuery)
      .populate('student', 'fullName email studentId department')
      .populate({
        path: 'assignment',
        populate: { path: 'subjectId', select: 'name code' },
      })
      .sort({ submittedAt: -1 })
      .lean();

    // Filter by student search keyword if provided
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      submissions = submissions.filter(
        (s) =>
          s.student?.fullName?.toLowerCase().includes(term) ||
          s.student?.studentId?.toLowerCase().includes(term) ||
          s.student?.email?.toLowerCase().includes(term) ||
          s.assignment?.title?.toLowerCase().includes(term)
      );
    }

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
      teacherAssignments,
    });
  } catch (error) {
    console.error('Error in getTeacherSubmissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching teacher submissions',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single submission by ID with full version history and authorization checks
 * @route   GET /api/submissions/:id
 * @access  Private (Owner Student, Assignment's Teacher, or Admin)
 */
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'fullName email studentId department')
      .populate({
        path: 'assignment',
        populate: { path: 'teacherId', select: 'fullName email' },
      })
      .lean();

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    const user = req.user;
    const isStudentOwner =
      submission.student?._id?.toString() === user._id.toString() ||
      submission.studentId?.toString() === user._id.toString();

    const isTeacherOwner =
      submission.assignment?.teacherId?._id?.toString() === user._id.toString() ||
      submission.assignment?.teacherId?.toString() === user._id.toString();

    const isAdmin = user.role === 'admin';

    // Security check: Student cannot view another student's submission
    if (!isStudentOwner && !isTeacherOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have authorization to view this submission',
      });
    }

    // Fetch all versions
    const versions = await SubmissionVersion.find({ submissionId: submission._id })
      .sort({ version: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...submission,
        versions,
      },
    });
  } catch (error) {
    console.error('Error fetching submission by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving submission details',
      error: error.message,
    });
  }
};

module.exports = {
  submitAssignment,
  getAssignmentSubmission,
  getTeacherSubmissions,
  getSubmissionById,
};
