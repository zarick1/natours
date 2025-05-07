const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Routing handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const updateTour = tours.find((tour) => tour.id === +req.params.id);

  if (!updateTour) return res.status(404).send('Not Found');

  const propertiesToUpdate = Object.keys(req.body);
  propertiesToUpdate.forEach((property) => {
    updateTour[property] = req.body[property];
  });
  console.log(tours);
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}....`);
});
