const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  syncClerkUser,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public authentication & Clerk synchronization routes
router.post('/register', register);
router.post('/login', login);
router.post('/clerk-sync', syncClerkUser);

// Private authenticated user profile
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Role-protected test routes for automated & verification testing
router.get('/student-only', protect, authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted: Student portal endpoint',
    user: req.user,
  });
});

router.get('/teacher-only', protect, authorize('teacher'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted: Teacher portal endpoint',
    user: req.user,
  });
});

router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted: Administrator portal endpoint',
    user: req.user,
  });
});

module.exports = router;
