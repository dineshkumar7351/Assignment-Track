const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getAssignments)
  .post(protect, authorize('teacher', 'admin'), createAssignment);

router
  .route('/:id')
  .get(protect, getAssignmentById)
  .put(protect, authorize('teacher', 'admin'), updateAssignment)
  .delete(protect, authorize('teacher', 'admin'), deleteAssignment);

module.exports = router;
