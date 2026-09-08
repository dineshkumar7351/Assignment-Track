const analyticsService = require('../services/analyticsService');

/**
 * @desc    Get student analytics, academic health score, deadline risk, and recommendations
 * @route   GET /api/analytics/student
 * @access  Private (Student)
 */
const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user._id;
    const department = req.user.department || 'Computer Science & Engineering';

    const data = await analyticsService.getStudentAnalytics(studentId, department);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error calculating student analytics',
      error: error.message,
    });
  }
};

/**
 * @desc    Get teacher cohort analytics, submission rates, assignment matrix, and similarity stats
 * @route   GET /api/analytics/teacher
 * @access  Private (Teacher, Admin)
 */
const getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const data = await analyticsService.getTeacherAnalytics(teacherId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching teacher analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error calculating teacher analytics',
      error: error.message,
    });
  }
};

/**
 * @desc    Get standalone "What Should I Do Now?" recommendation
 * @route   GET /api/analytics/recommendation
 * @access  Private (Student)
 */
const getRecommendation = async (req, res) => {
  try {
    const studentId = req.user._id;
    const department = req.user.department || 'Computer Science & Engineering';

    const analytics = await analyticsService.getStudentAnalytics(studentId, department);

    return res.status(200).json({
      success: true,
      data: analytics.recommendation,
    });
  } catch (error) {
    console.error('Error fetching smart recommendation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error computing recommendation',
      error: error.message,
    });
  }
};

module.exports = {
  getStudentAnalytics,
  getTeacherAnalytics,
  getRecommendation,
};
