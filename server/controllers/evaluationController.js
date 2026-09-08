const Evaluation = require('../models/Evaluation');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const notificationService = require('../services/notificationService');

/**
 * @desc    Submit evaluation and feedback for a student submission
 * @route   POST /api/evaluations
 * @access  Private (Teacher or Admin only)
 */
const createEvaluation = async (req, res) => {
  try {
    const { submissionId, marks, feedback = '' } = req.body;
    const targetSubmissionId = submissionId || req.body.submission;

    if (!targetSubmissionId) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID is required for evaluation',
      });
    }

    if (marks === undefined || marks === null || isNaN(Number(marks))) {
      return res.status(400).json({
        success: false,
        message: 'Valid obtained marks are required',
      });
    }

    const numericMarks = Number(marks);
    if (numericMarks < 0) {
      return res.status(400).json({
        success: false,
        message: 'Marks cannot be negative',
      });
    }

    // 1. Fetch submission with assignment and student
    const submission = await Submission.findById(targetSubmissionId)
      .populate('assignment')
      .populate('student', 'fullName email studentId department');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission record not found',
      });
    }

    const assignment = submission.assignment;
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Associated assignment not found',
      });
    }

    const maxMarks = assignment.maxMarks || assignment.totalMarks || 100;
    if (numericMarks > maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks (${numericMarks}) cannot exceed maximum allowed marks (${maxMarks})`,
      });
    }

    // 2. Authorization check: Must be teacher who owns assignment or admin
    const isTeacherOwner =
      assignment.teacherId?.toString() === req.user._id.toString() ||
      assignment.teacher?.toString() === req.user._id.toString();

    if (!isTeacherOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only evaluate submissions for your own assignments',
      });
    }

    // 3. Compute Late vs On-Time status
    const submittedDate = new Date(submission.submittedAt || submission.createdAt);
    const deadlineDate = new Date(assignment.deadline);
    const isLate = submittedDate > deadlineDate;

    // 4. Create or Upsert Evaluation record
    const evalData = {
      submission: submission._id,
      submissionId: submission._id,
      assignment: assignment._id,
      assignmentId: assignment._id,
      student: submission.student?._id || submission.student,
      studentId: submission.student?._id || submission.student,
      evaluator: req.user._id,
      evaluatorId: req.user._id,
      marks: numericMarks,
      maxMarks,
      feedback: feedback.trim(),
      isLate,
      status: 'graded',
      evaluatedAt: new Date(),
    };

    let evaluation = await Evaluation.findOne({
      $or: [
        { submission: submission._id },
        { submissionId: submission._id },
      ],
    });

    if (evaluation) {
      evaluation.marks = numericMarks;
      evaluation.maxMarks = maxMarks;
      evaluation.feedback = feedback.trim();
      evaluation.evaluator = req.user._id;
      evaluation.evaluatorId = req.user._id;
      evaluation.isLate = isLate;
      evaluation.status = 'graded';
      evaluation.evaluatedAt = new Date();
      await evaluation.save();
    } else {
      evaluation = await Evaluation.create(evalData);
    }

    // 5. Synchronize primary Submission record
    submission.status = 'graded';
    submission.obtainedMarks = numericMarks;
    submission.feedback = feedback.trim();
    submission.gradedAt = evaluation.evaluatedAt;
    submission.gradedBy = req.user._id;
    await submission.save();

    // 6. Return populated evaluation
    const populatedEvaluation = await Evaluation.findById(evaluation._id)
      .populate('student', 'fullName email studentId department')
      .populate('evaluator', 'fullName email employeeId')
      .populate('assignment', 'title subject maxMarks totalMarks deadline')
      .lean();

    // Notify student about completed evaluation and feedback
    notificationService.notifyEvaluationCompleted(populatedEvaluation, assignment, submission.student).catch((err) => {
      console.error('Background notification error for evaluation:', err.message);
    });

    return res.status(200).json({
      success: true,
      message: 'Submission evaluated successfully',
      data: populatedEvaluation,
    });
  } catch (error) {
    console.error('Error creating evaluation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing evaluation',
      error: error.message,
    });
  }
};

/**
 * @desc    Update existing evaluation record
 * @route   PUT /api/evaluations/:id
 * @access  Private (Teacher or Admin only)
 */
const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, feedback } = req.body;

    // Find evaluation by its ID or by submissionId
    let evaluation = await Evaluation.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { submission: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { submissionId: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    }).populate('assignment');

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation record not found',
      });
    }

    const assignment = evaluation.assignment;
    const maxMarks = evaluation.maxMarks || assignment?.maxMarks || assignment?.totalMarks || 100;

    // Authorization check
    const isTeacherOwner =
      assignment?.teacherId?.toString() === req.user._id.toString() ||
      evaluation.evaluator?.toString() === req.user._id.toString();

    if (!isTeacherOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot modify this evaluation',
      });
    }

    if (marks !== undefined && marks !== null) {
      const numMarks = Number(marks);
      if (isNaN(numMarks) || numMarks < 0 || numMarks > maxMarks) {
        return res.status(400).json({
          success: false,
          message: `Marks must be between 0 and ${maxMarks}`,
        });
      }
      evaluation.marks = numMarks;
    }

    if (feedback !== undefined) {
      evaluation.feedback = feedback.trim();
    }

    evaluation.evaluator = req.user._id;
    evaluation.evaluatorId = req.user._id;
    evaluation.evaluatedAt = new Date();
    await evaluation.save();

    // Synchronize Submission
    await Submission.findByIdAndUpdate(
      evaluation.submission,
      {
        status: 'graded',
        obtainedMarks: evaluation.marks,
        feedback: evaluation.feedback,
        gradedAt: evaluation.evaluatedAt,
        gradedBy: req.user._id,
      },
      { new: true }
    );

    const populatedEvaluation = await Evaluation.findById(evaluation._id)
      .populate('student', 'fullName email studentId department')
      .populate('evaluator', 'fullName email employeeId')
      .populate('assignment', 'title subject maxMarks totalMarks deadline')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Evaluation updated successfully',
      data: populatedEvaluation,
    });
  } catch (error) {
    console.error('Error updating evaluation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating evaluation',
      error: error.message,
    });
  }
};

/**
 * @desc    Get evaluation for a specific submission ID
 * @route   GET /api/evaluations/:submissionId
 * @access  Private (Student recipient, Teacher owner, or Admin)
 */
const getEvaluationBySubmissionId = async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!submissionId || !submissionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID format',
      });
    }

    const evaluation = await Evaluation.findOne({
      $or: [
        { submission: submissionId },
        { submissionId: submissionId },
      ],
    })
      .populate('student', 'fullName email studentId department')
      .populate('evaluator', 'fullName email employeeId')
      .populate('assignment', 'title subject maxMarks totalMarks deadline')
      .lean();

    if (!evaluation) {
      // Check if submission exists and has inline graded info
      const submission = await Submission.findById(submissionId)
        .populate('student', 'fullName email studentId department')
        .populate('gradedBy', 'fullName email employeeId')
        .populate('assignment', 'title subject maxMarks totalMarks deadline')
        .lean();

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found',
        });
      }

      // Check authorization
      const isStudentOwner =
        submission.student?._id?.toString() === req.user._id.toString() ||
        submission.studentId?.toString() === req.user._id.toString();

      const isTeacherOwner =
        submission.assignment?.teacherId?.toString() === req.user._id.toString() ||
        submission.gradedBy?._id?.toString() === req.user._id.toString();

      if (!isStudentOwner && !isTeacherOwner && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have access to view this evaluation',
        });
      }

      if (submission.status !== 'graded' && submission.obtainedMarks === null) {
        return res.status(200).json({
          success: true,
          data: null,
          message: 'Submission has not been evaluated yet',
        });
      }

      // Synthesize evaluation view from submission
      const deadlineDate = new Date(submission.assignment?.deadline);
      const submittedDate = new Date(submission.submittedAt);
      const isLate = submittedDate > deadlineDate;

      return res.status(200).json({
        success: true,
        data: {
          _id: `synth-${submission._id}`,
          submission: submission._id,
          submissionId: submission._id,
          assignment: submission.assignment,
          student: submission.student,
          evaluator: submission.gradedBy,
          marks: submission.obtainedMarks,
          maxMarks: submission.assignment?.maxMarks || submission.assignment?.totalMarks || 100,
          feedback: submission.feedback || '',
          isLate,
          status: submission.status,
          evaluatedAt: submission.gradedAt || submission.updatedAt,
        },
      });
    }

    // Authorization check for found evaluation
    const isStudentOwner =
      evaluation.student?._id?.toString() === req.user._id.toString() ||
      evaluation.studentId?.toString() === req.user._id.toString();

    const isTeacherOwner =
      evaluation.assignment?.teacherId?.toString() === req.user._id.toString() ||
      evaluation.evaluator?._id?.toString() === req.user._id.toString();

    if (!isStudentOwner && !isTeacherOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this evaluation',
      });
    }

    return res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving evaluation details',
      error: error.message,
    });
  }
};

module.exports = {
  createEvaluation,
  updateEvaluation,
  getEvaluationBySubmissionId,
};
