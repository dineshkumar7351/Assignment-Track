const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getAssignmentSubmission,
  getTeacherSubmissions,
  getSubmissionById,
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/uploadConfig');

// Teacher route to inspect all submissions for their assignments
router.get('/teacher', protect, authorize('teacher', 'admin'), getTeacherSubmissions);

// Student route to get their own submission + versions for a specific assignment
router.get('/assignment/:assignmentId', protect, getAssignmentSubmission);

// Student submit or resubmit coursework deliverable (Multipart file upload)
router.post(
  '/:assignmentId',
  protect,
  authorize('student'),
  upload.single('file'),
  submitAssignment
);

// Get single submission by ID with versions and ownership checks
router.get('/:id', protect, getSubmissionById);

module.exports = router;
