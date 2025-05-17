const User = require('../models/userModel');
//const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
