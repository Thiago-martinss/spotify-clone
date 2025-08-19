const express = require('express');
const mongoose = require('mongoose');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');
const artistRouter = require('./routes/artistRoutes');
const albumRouter = require('./routes/albumRoutes');
const songRouter = require('./routes/songRoutes');
const playlistRouter = require('./routes/playlistRoutes');

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
app.use("/api/users", userRouter);
app.use("/api/artists", artistRouter);
app.use("/api/albums", albumRouter);
app.use("/api/songs", songRouter);
app.use("/api/playlists", playlistRouter);


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

