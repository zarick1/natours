const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTING HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
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

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};

// 3) ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}....`);
});
