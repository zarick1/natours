const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour)
    return res.status(404).json({ status: 'Failed', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const updateTour = tours.find((tour) => tour.id === +req.params.id);

  if (!updateTour) return res.status(404).send('Not Found');

  const propertiesToUpdate = Object.keys(req.body);
  propertiesToUpdate.forEach((property) => {
    updateTour[property] = req.body[property];
  });

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: updateTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const tourToDelete = tours.findIndex((tour) => tour.id === +req.params.id);
  //console.log(tourToDelete);
  if (tourToDelete === -1)
    return res.status(404).json({ status: 'fail', message: 'Not Founds' });
  tours.splice(tourToDelete, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({ status: 'success', data: null });
    }
  );
};
