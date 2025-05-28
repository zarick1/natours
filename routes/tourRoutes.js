const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// Define route for getting top 5 cheapest tours (alias route)
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// Define route for getting tour statistics
router.route('/tour-stats').get(tourController.getTourStats);

// Define route for getting monthly tour plan for a specific year
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// Define routes for the base tour endpoint
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

// Define routes for specific tour by ID
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
