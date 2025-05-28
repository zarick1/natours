/**
 * Wraps an async function to catch errors and pass them to Express error handling
 * @param {Function} fn - The async function to wrap
 * @returns {Function} A middleware function that handles errors
 */
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
