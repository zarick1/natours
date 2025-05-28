const AppError = require('../utils/appError');

/**
 * Sends detailed error response in development environment
 * @param {Object} res - The Express response object
 * @param {Object} err - The error object containing statusCode, status, message, and stack
 */
const sendErrorDev = function (res, err) {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Sends error response in production environment
 * @param {Object} res - The Express response object
 * @param {Object} err - The error object containing statusCode, status, and message
 */
const sendErrorProd = function (res, err) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR!!!', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

/**
 * Handles Mongoose CastError (invalid ID format)
 * @param {Object} err - The Mongoose CastError object
 * @returns {AppError} A new AppError with a user-friendly message and 400 status
 */
const handleCastError = function (err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handles MongoDB duplicate field errors (code 11000)
 * @param {Object} err - The MongoDB duplicate key error object
 * @returns {AppError} A new AppError with a user-friendly message and 400 status
 */
const handleDuplicateFieldsDB = function (err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value ${value[0]}, please use another value`;

  return new AppError(message, 400);
};

/**
 * Handles Mongoose validation errors
 * @param {Object} err - The Mongoose ValidationError object
 * @returns {AppError} A new AppError with a user-friendly message and 400 status
 */
const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handles invalid JWT errors
 * @returns {AppError} A new AppError with a user-friendly message and 401 status
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);

/**
 * Handles expired JWT errors
 * @returns {AppError} A new AppError with a user-friendly message and 401 status
 */
const handleJWTErrorExpired = () =>
  new AppError('Tour token has expired! PLease log in again', 401);

/**
 * Global error handling middleware
 * @param {Object} err - The error object
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The Express next middleware function
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTErrorExpired();

    sendErrorProd(res, error);
  }
};
