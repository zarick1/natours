const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('Date Base Successfuly connected'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.messagee);
  console.log('Unhandled rejection. Shutting down....');
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught exception. Shutting down...');
  server.close(() => process.exit(1));
});
