const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const { parse } = require('dotenv');

//@desc -Create a new Artist
//@route - POST /api/artists
//@Access - Private

const createArtist = asyncHandler(async (req, res) => {
  //Check if req.body is defined
  if (!req.body) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Request body is required');
  }
  const { name, bio, genres } = req.body;
  //Validations
  if (!name || !bio || !genres) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Name, bio, genres are required');
  }
  //check if artist already exists
  const existingArtist = await Artist.findOne({ name });
  if (existingArtist) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Artist already exists');
  }
  //upload artist image if provided
  let imageUrl = '';
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'spotify/artists');
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

const getArtists = asyncHandler(async (req, res) => {
  const { genre, search, page = 1, limit = 10 } = req.query;
  //Build filter object
  const filter = {};
  if (genre) filter.genres = { $in: [genre] };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { bio: { $regex: search, $options: "i" } },
    ];
  }

  //Count total artists with filter
  const count = await Artist.countDocuments(filter);
  //Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  //Get artists
  const artists = await Artist.find(filter)
    .sort({ followers: -1 })
    .limit(parseInt(limit))
    .skip(skip);
  res.status(StatusCodes.OK).json({
    artists,
    page: parseInt(page),
    pages: Math.ceil(count / parseInt(limit)),
    totalArtists: count,
  });
});


const getArtistsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artist = await Artist.findById(id);
  if (!artist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }
  res.status(StatusCodes.OK).json(artist);
});


const updateArtist = asyncHandler(async (req, res) => {
  const { name, bio, genres, isVerified } = req.body;
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }
  //Update artist details
  artist.name = name || artist.name;
  artist.bio = bio || artist.bio;
  artist.genres = genres || artist.genres;
  artist.isVerified =
    isVerified !== undefined ? isVerified === "true" : artist.isVerified;
  //Update image if provided
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "spotify/artists");
    artist.image = result.secure_url;
  }
  //reSave
  const updatedArtist = await artist.save();
  res.status(StatusCodes.OK).json(updatedArtist);
});

  module.exports = { createArtist, getArtists, getArtistsById, updateArtist };
