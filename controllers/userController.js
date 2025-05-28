/**
 * @type {import('mongoose').Model<any>}
 */
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Filters an object to include only specified fields
 * @param {Object} object - The input object to filter
 * @param {...string} allowedFields - The fields to include in the filtered object
 * @returns {Object} A new object containing only the allowed fields
 */
const filterObj = (object, ...allowedFields) => {
  const newObj = {};
  Object.keys(object).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = object[el];
  });

  return newObj;
};

/**
 * Retrieves all users from the database
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The Express next middleware function
 * @returns {Promise<void>}
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users
    }
  });
});

/**
 * Updates the current user's data (name and email only)
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The Express next middleware function
 * @returns {Promise<void>}
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user post password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password update! Please use /updateMyPassword',
        400
      )
    );

  // 2) Update user document
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser
  });
});

/**
 * Soft-deletes the current user by setting active to false
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The Express next middleware function
 * @returns {Promise<void>}
 */
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: 'success', data: null });
});

//////////////////////
// NOT IMPLEMENTED //
/////////////////////
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!'
  });
};
