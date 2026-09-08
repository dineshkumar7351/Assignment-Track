const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token containing only necessary user details (id and role)
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_smart_tracker_2026',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = generateToken;
