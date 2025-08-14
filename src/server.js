const express = require('express');
const mongoose = require('mongoose');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

//Pass incoming data
app.use(express.json());

//Routes
app.use('/api/users', userRouter);

//Error handling middleware
app.use(( req, res, next) => {
  const error = new Error('Not found');
  error.status(StatusCodes.NOT_FOUND);
  next(error);
});

//Global error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: error.message || 'Something went wrong',
      status: error.status,
    },
  });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port 5000');
});

module.exports = app;

