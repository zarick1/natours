/**
 * @type {import('mongoose').Model<any>}
 */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

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
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

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
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

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
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

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
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        namOfTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { namOfTours: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan
    }
  });
});
