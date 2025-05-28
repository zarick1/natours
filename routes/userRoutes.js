const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Define route for user signup
router.post('/signup', authController.signup);

// Define route for user login
router.post('/login', authController.login);

// Define route for initiating password reset (sends email with reset token)
router.post('/forgotPassword', authController.forgotPassword);

// Define route for resetting password using a token
router.patch('/resetPassword/:token', authController.resetPassword);

// Define route for updating the current user's password (protected)
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// Define route for updating the current user's data (protected)
router.patch('/updateMe', authController.protect, userController.updateMe);

// Define route for soft-deleting the current user (protected)
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// Define routes for user management (CRUD operations)
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// Define routes for specific user by ID
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
