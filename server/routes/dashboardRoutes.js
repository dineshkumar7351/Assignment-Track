const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getTeacherDashboard,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student Dashboard route - strictly restricted to authenticated students
router.get('/student', protect, authorize('student'), getStudentDashboard);

// Teacher Dashboard route - strictly restricted to authenticated teachers
router.get('/teacher', protect, authorize('teacher'), getTeacherDashboard);

module.exports = router;
