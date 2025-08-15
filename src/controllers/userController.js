const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(StatusCodes.CREATED).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(StatusCodes.OK).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Invalid credentials');
  }
});

//Get current user
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('likedSongs', 'title artist duration')
    .populate('likedAlbums', 'title artist coverImage')
    .populate('followedArtists', 'name image')
    .populate('followedplaylists', 'name coverImage creator');
  if (user) {
    res.status(StatusCodes.OK).json(user);
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, loginUser, getUserProfile };
