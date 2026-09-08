/**
 * Middleware to handle 404 Not Found for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Reusable Global Error Handling Middleware
 * Captures thrown errors and sends consistent JSON response with proper HTTP status codes.
 */
const errorHandler = (err, req, res, next) => {
  // If response status code was left as 200, default to 500 Internal Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
