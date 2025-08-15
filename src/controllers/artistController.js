const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Artist = require("../models/Artist");
const Album = require("../models/Album");
const Song = require("../models/Song");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

//@desc -Create a new Artist
//@route - POST /api/artists
//@Access - Private

const createArtist = asyncHandler(async (req, res) => {
  //Check if req.body is defined
  if (!req.body) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Request body is required");
  }
  const { name, bio, genres } = req.body;
  //Validations
  if (!name || !bio || !genres) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Name, bio, genres are required");
  }
  //check if artist already exists
  const existingArtist = await Artist.findOne({ name });
  if (existingArtist) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Artist already exists");
  }
  //upload artist image if provided
  let imageUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "spotify/artists");
    imageUrl = result.secure_url;
  }

  //Create the artists
  const artist = await Artist.create({
    name,
    bio,
    genres,
    isVerified: true,
    image: imageUrl,
  });
  res.status(StatusCodes.CREATED).json(artist);
});

module.exports = { createArtist };