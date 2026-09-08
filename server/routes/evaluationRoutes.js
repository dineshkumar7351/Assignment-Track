const express = require('express');
const router = express.Router();
const {
  createEvaluation,
  updateEvaluation,
  getEvaluationBySubmissionId,
} = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/evaluations - Teacher/Admin grades a submission
router.post('/', protect, authorize('teacher', 'admin'), createEvaluation);

// PUT /api/evaluations/:id - Teacher/Admin updates an evaluation
router.put('/:id', protect, authorize('teacher', 'admin'), updateEvaluation);

// GET /api/evaluations/:submissionId - Retrieve evaluation details (Student, Teacher, or Admin)
router.get('/:submissionId', protect, authorize('student', 'teacher', 'admin'), getEvaluationBySubmissionId);

module.exports = router;
