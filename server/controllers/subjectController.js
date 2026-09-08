const Subject = require('../models/Subject');

/**
 * @desc    Get all active academic subjects
 * @route   GET /api/subjects
 * @access  Private (Authenticated users)
 */
const getSubjects = async (req, res) => {
  try {
    const userDept = req.user.department;
    let query = { isActive: true };

    if (userDept) {
      const deptPrefix = userDept.split(/[\s,&]+/)[0];
      query = {
        isActive: true,
        $or: [
          { department: userDept },
          { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
          { department: 'General' },
          { teacherId: req.user._id },
        ],
      };
    }

    let subjects = await Subject.find(query)
      .populate('teacherId', 'fullName email')
      .sort({ name: 1 })
      .lean();

    // Fallback if department filter is too restrictive: return all active subjects
    if (subjects.length === 0) {
      subjects = await Subject.find({ isActive: true })
        .populate('teacherId', 'fullName email')
        .sort({ name: 1 })
        .lean();
    }

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving academic subjects',
      error: error.message,
    });
  }
};

module.exports = {
  getSubjects,
};
