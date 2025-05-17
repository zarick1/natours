/**
 * @type {import('mongoose').Model<any>}
 */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signJWToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signJWToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if password and email exist
  if (!email || !password)
    return next(new AppError('Please provide email and password'), 400);

  // 2) Check if user exists and password is okey
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  // 3) if everithing is ok, send token to client
  const token = signJWToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new AppError('Please log in to get access', 401));
  //console.log(token);

  // 2) Token verification
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decode);

  // 3) Check if user still exists
  const freshUser = await User.findById(decode.id);
  if (!freshUser) return next(new AppError('User does not exist', 401));

  // 4) Check if user changed password
  if (freshUser.changePasswordAfter(decode.iat))
    return next(new AppError('Password has been changed, log in again!', 401));

  next();
});
