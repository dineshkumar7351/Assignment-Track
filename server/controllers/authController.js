const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

/**
 * @desc    Register a new Student or Teacher
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      role = 'student',
      department,
      studentId,
      employeeId,
    } = req.body;

    // 1. Prevent public admin registration
    if (role === 'admin') {
      res.status(403);
      throw new Error('Public registration as Administrator is not permitted. Admin accounts must be created via secure system seed.');
    }

    // 2. Validate allowed roles
    if (!['student', 'teacher'].includes(role)) {
      res.status(400);
      throw new Error("Invalid registration role. Must be 'student' or 'teacher'.");
    }

    // 3. Required common fields validation
    if (!fullName || !fullName.trim()) {
      res.status(400);
      throw new Error('Full Name is required');
    }

    if (!email || !email.trim()) {
      res.status(400);
      throw new Error('Email address is required');
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      res.status(400);
      throw new Error('Please provide a valid academic email address');
    }

    if (!department || !department.trim()) {
      res.status(400);
      throw new Error('Department is required');
    }

    // 4. Password validation
    if (!password) {
      res.status(400);
      throw new Error('Password is required');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    if (!confirmPassword) {
      res.status(400);
      throw new Error('Please confirm your password');
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match');
    }

    // 5. Role-specific ID validation
    if (role === 'student' && (!studentId || !studentId.trim())) {
      res.status(400);
      throw new Error('Student ID is required for student registration');
    }

    if (role === 'teacher' && (!employeeId || !employeeId.trim())) {
      res.status(400);
      throw new Error('Employee ID is required for teacher registration');
    }

    // 6. Check for duplicate email
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400);
      throw new Error('An account with this email address already exists');
    }

    // 7. Check for duplicate Student ID / Employee ID if provided
    if (role === 'student' && studentId) {
      const existingStudent = await User.findOne({ studentId: studentId.trim() });
      if (existingStudent) {
        res.status(400);
        throw new Error('A student with this Student ID is already registered');
      }
    }

    if (role === 'teacher' && employeeId) {
      const existingTeacher = await User.findOne({ employeeId: employeeId.trim() });
      if (existingTeacher) {
        res.status(400);
        throw new Error('A teacher with this Employee ID is already registered');
      }
    }

    // 8. Create user
    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role,
      department: department.trim(),
      ...(role === 'student' && { studentId: studentId.trim() }),
      ...(role === 'teacher' && { employeeId: employeeId.trim() }),
    };

    const user = await User.create(userData);

    if (user) {
      const token = generateToken(user._id, user.role);

      res.status(201).json({
        success: true,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department,
          studentId: user.studentId,
          employeeId: user.employeeId,
          profileImage: user.profileImage,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        token,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user registration data');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    if (!password) {
      res.status(400);
      throw new Error('Please provide your password');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Account has been deactivated. Please contact campus administration.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        employeeId: user.employeeId,
        profileImage: user.profileImage,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update permitted profile information
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { fullName, phone, bio, notificationPreferences } = req.body;

    if (fullName && fullName.trim()) {
      user.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      user.phone = phone;
    }
    if (bio !== undefined) {
      user.bio = bio;
    }
    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        studentId: updatedUser.studentId,
        employeeId: updatedUser.employeeId,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        notificationPreferences: updatedUser.notificationPreferences,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Current password and new password are required');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters long');
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      res.status(400);
      throw new Error('New passwords do not match');
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};

