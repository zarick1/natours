/**
 * @type {import('mongoose').Model<any>}
 */
const Tour = require('../models/tourModel');

/**
 * Controller function to get all tours from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * This function uses Mongoose's `find` method to retrieve all documents
 * from the `Tour` collection. It sends a JSON response with the status,
 * the number of results, and the data (list of tours). If an error occurs,
 * it sends a 404 response with the error message.
 */
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not Found',
      message: err.message
    });
  }
};

/**
 * Controller function to get one tour by ID from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * This function uses Mongoose's `findById` method to retrieve one document
 * from the `Tour` collection. It sends a JSON response with status and the
 * data. If an error occurs it sends a 404 response with error message.
 */
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not Found',
      message: err.message
    });
  }
};

/**
 * Controller function to create new tour in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * This function uses Mongoose's `create` method to add a new document to the
 * `Tour` collection. It sends a JSON response with status and created tour
 * data. If an error occurs, it sends a 400 response with error message.
 */
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'faild',
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'faild',
      message: err.message
    });
  }
};
