const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getStudentAnalytics,
  getTeacherAnalytics,
  getRecommendation,
} = require('../controllers/analyticsController');

// Student Analytics
router.get('/student', protect, authorize('student', 'admin'), getStudentAnalytics);

// Recommendation
router.get('/recommendation', protect, authorize('student', 'admin'), getRecommendation);

// Teacher Analytics
router.get('/teacher', protect, authorize('teacher', 'admin'), getTeacherAnalytics);

module.exports = router;
