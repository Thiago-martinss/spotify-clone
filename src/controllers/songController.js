const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const createSong = asyncHandler(async (req, res) => {
  //Check if req.body is defined
  if (!req.body) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Request body is required');
  }
  const { title, artist, album, duration, audioUrl } = req.body;
  //Validations
  if (!title || !artist || !album || !duration || !audioUrl) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Title, artist, album, duration, audioUrl are required');
  }
  //check if song already exists
  const existingSong = await Song.findOne({ title });
  if (existingSong) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Song already exists');
  }
  const song = await Song.create({ title, artist, album, duration, audioUrl });
  if (song) {
    res.status(StatusCodes.CREATED).json(song);
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Failed to create song');
  }
});

module.exports = {
  createSong,
};