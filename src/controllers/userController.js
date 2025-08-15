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
  //Find the user
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("likedSongs", "title artist duration")
    .populate("likedAlbums", "title artist coverImage")
    .populate("followedArtists", "name image")
    .populate("followedPlaylists", "name creator coverImage");
  if (user) {
    res.status(StatusCodes.OK).json(user);
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not found");
  }
});
// updateUserProfile

//@desc - Login user
//@route - PUT /api/users/profile
//@Access - Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { name, email, password } = req.body;
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    // Check if password is being updated
    if (password) {
      user.password = password;
    }
    // Upload profile picture if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "spotify/users");
      user.profilePicture = result.secure_url;
    }
    const updatedUser = await user.save();
    res.status(StatusCodes.OK).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User Not Found");
  }
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
