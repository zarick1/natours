const Tour = require('./../models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!(req.body.price && req.body.name))
    return res.status(400).json({
      status: 'faild',
      message: 'Bad request, must contain price and name propery'
    });
  console.log(req.body);
  next();
};

exports.getAllTours = (req, res) => {};

exports.getTour = (req, res) => {};

exports.createTour = (req, res) => {};

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};
