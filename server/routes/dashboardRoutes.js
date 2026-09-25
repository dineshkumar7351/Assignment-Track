const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getTeacherDashboard,
} = require('../controllers/dashboardController');
const { getInstitutionalReports } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student Dashboard route - strictly restricted to authenticated students
router.get('/student', protect, authorize('student'), getStudentDashboard);

// Teacher Dashboard route - strictly restricted to authenticated teachers
router.get('/teacher', protect, authorize('teacher'), getTeacherDashboard);

// Admin Dashboard route - strictly restricted to campus administrators
router.get('/admin', protect, authorize('admin'), getInstitutionalReports);

module.exports = router;
