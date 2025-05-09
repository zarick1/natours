/**
 * @type {import('mongoose').Model<any>}
 */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

/**
 * Middleware function to predefine query parameters for retrieving top tours.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * This function modifies the request query parameters to:
 * - Limit the number of results to 5 (`limit=5`).
 * - Sort the results by `ratingsAverage` in descending order and then by `price` (`sort=-ratingsAverage,price`).
 * - Select specific fields to include in the response (`fields=name,price,ratingsAverage,summary,difficulty`).
 *
 * Example usage:
 * - Route: `/api/v1/tours/top-5-cheap`
 * - Result: Returns the top 5 tours sorted by ratings and price, with limited fields.
 */
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/**
 * Controller function to get all tours from the database
 * with advanced filtering, sorting and pagination.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * This function allows users to:
 * - **Filter**: Filter tours based on specific fields.
 * - Example: `/api/v1/tours?duration=5&price[gte]=500`
 * - **Sort**: Sort tours by one or more fields in ascending and descending order.
 * - Example: `/api/v1/tours?sort=price` (ascending) or ...?sort=-price (descending)
 * - **Field limiting**: Get only those fields that are necessary
 * - Example: `/api/v1/tours/?fields=name,duration,difficulty,price,maxGroupSize `
 * - **Pagination**: Retrieve a specific page of results with a defined limit.
 * - Example: `/api/v1/tours?page=2&limit=10`
 *
 * This function uses Mongoose's `find` method to retrieve documents
 * from the `Tour` collection. It sends a JSON response with the status,
 * the number of results, and the data (list of tours). If an error occurs,
 * it sends a 404 response with the error message.
 */
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

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

/**
 * Controller function to update tour in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * This function uses Mongoose's `findByIdAndUpdate` method to update an exsitig document
 * to the `Tour` collection. It sends a JSON response with status and updated tour data.
 * If an error occurs, it sends a 404 response with error message.
 */
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

/**
 * Controller function to delete tour in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * This function uses Mongoose's `findByIdAndDelete` method to delete a document from
 * the `Tour` collection. It sends a JSON response with status and no data.
 * If an error occurs, it sends a 404 response with error message.
 */
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
