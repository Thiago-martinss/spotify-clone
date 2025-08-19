const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Artist = require('../models/Artist');
const Song = require('../models/Song');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const Playlist = require('../models/Playlist');

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;
  //Validations
  if (!name || !description) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Name and description are required");
  }
  if (name.length < 3 || name.length > 50) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Name must be between 3 and 50 characters");
  }

  if (description.length < 10 || description.length > 200) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Description must be between 10 and 200 characters");
  }

  //Check if playlist already exists
  const existingPlaylist = await Playlist.findOne({
    name,
    creator: req.user._id,
  });

  if (existingPlaylist) {
    throw new Error("A playlist with this name already exists");
  }
  // Upload playlist cover image if provided
  let coverImageUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "spotify/playlists");
    coverImageUrl = result.secure_url;
  }

  //Create the playlist
  const playlist = await Playlist.create({
    name,
    description,
    creator: req.user._id,
    coverImage: coverImageUrl || undefined,
    isPublic: isPublic === "true",
  });
  res.status(StatusCodes.CREATED).json(playlist);
});

module.exports = {
  createPlaylist,
};