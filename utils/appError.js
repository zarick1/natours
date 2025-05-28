/**
 * Custom error class for handling API errors
 * @class AppError
 * @extends Error
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError
   * @constructor
   * @param {string} message - The error message
   * @param {number} statusCode - The HTTP status code for the error
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
