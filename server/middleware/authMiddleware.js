const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - verifies JWT from Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_smart_tracker_2026'
      );

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        return next(new Error('User account not found'));
      }

      if (!user.isActive) {
        res.status(403);
        return next(new Error('User account has been deactivated. Please contact an administrator.'));
      }

      req.user = user;
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed verification'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

/**
 * Role authorization middleware
 * @param  {...string} roles Allowed roles (e.g. 'student', 'teacher', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(
          `Forbidden: User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource`
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
