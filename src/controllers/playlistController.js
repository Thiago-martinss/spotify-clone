const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Artist = require('../models/Artist');
const User = require("../models/User");
const Song = require('../models/Song');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const Playlist = require('../models/Playlist');

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;
  //Validations
  if (!name || !description) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Name and description are required');
  }
  if (name.length < 3 || name.length > 50) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Name must be between 3 and 50 characters');
  }

  if (description.length < 10 || description.length > 200) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Description must be between 10 and 200 characters');
  }

  //Check if playlist already exists
  const existingPlaylist = await Playlist.findOne({
    name,
    creator: req.user._id,
  });

  if (existingPlaylist) {
    throw new Error('A playlist with this name already exists');
  }
  // Upload playlist cover image if provided
  let coverImageUrl = '';
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'spotify/playlists');
    coverImageUrl = result.secure_url;
  }

  //Create the playlist
  const playlist = await Playlist.create({
    name,
    description,
    creator: req.user._id,
    coverImage: coverImageUrl || undefined,
    isPublic: isPublic === 'true',
  });
  res.status(StatusCodes.CREATED).json(playlist);
});

const getPlaylists = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  //Build filter object
  const filter = { isPublic: true }; //only public playlists
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  //Count total playlists with filter
  const count = await Playlist.countDocuments(filter);
  //Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  //Get playlists
  const playlists = await Playlist.find(filter)
    .sort({ followers: -1 })
    .limit(parseInt(limit))
    .skip(skip)
    .populate('creator', 'name profilePicture')
    .populate('collaborators', 'name profilePicture');
  res.status(StatusCodes.OK).json({
    playlists,
    page: parseInt(page),
    pages: Math.ceil(count / parseInt(limit)),
    totalPlaylists: count,
  });
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({
    $or: [{ creator: req.user._id }, { collaborators: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .populate('creator', 'name profilePicture');
  res.status(StatusCodes.OK).json(playlists);
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate('creator', 'name profilePicture')
    .populate('collaborators', ' name profilePicture');

  if (!playlist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Playlist not found');
  }
  // Check if playlist is private and current user is not the creator or collaborator
  if (
    !playlist.isPublic &&
    !playlist.creator.equals(req.user._id) &&
    !playlist.collaborators.some((collab) => collab.equals(req.user._id))
  ) {
    res.status(StatusCodes.FORBIDDEN);
    throw new Error('This playlist is private');
  }
  res.status(StatusCodes.OK).json(playlist);
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Playlist not found');
  }

  // Check if current user is creator or collaborator
  if (
    !playlist.creator.equals(req.user._id) &&
    !playlist.collaborators.some((collab) => collab.equals(req.user._id))
  ) {
    res.status(StatusCodes.FORBIDDEN);
    throw new Error('Not authorized to update this playlist');
  }
  //Update the playlists fields
  playlist.name = name || playlist.name;
  playlist.description = description || playlist.description;
  //Only creator can change privacy settings
  if (playlist.creator.equals(req.user._id)) {
    playlist.isPublic =
      isPublic !== undefined ? isPublic === 'true' : playlist.isPublic;
  }
  await playlist.save();
  res.status(StatusCodes.OK).json(playlist);
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Playlist not found');
  }
  //Only creator can delete it's own playlist
  if (!playlist.creator.equals(req.user._id)) {
    res.status(StatusCodes.FORBIDDEN);
    throw new Error('Not Authorized to delete this playlist');
  }
  await playlist.deleteOne();
  res.status(StatusCodes.OK).json({
    message: 'Playlist removed',
  });
});

const addSongsToPlaylist = asyncHandler(async (req, res) => {
  const { songIds } = req.body;
  if (!songIds || !Array.isArray(songIds)) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Song IDS are required');
  }
  //find the playlist
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('playlist not found');
  }
  // Check if current user is creator or collaborator
  if (
    !playlist.creator.equals(req.user._id) &&
    !playlist.collaborators.some((collab) => collab.equals(req.user._id))
  ) {
    res.status(StatusCodes.FORBIDDEN);
    throw new Error('Not authorized to modify this playlist');
  }
  //Add songs to playlist
  for (const songId of songIds) {
    //check if song exist
    const song = await Song.findById(songId);

    if (!song) {
      continue; //Skip if song doesn't exists
    }

    //Check if song already in a playlist
    if (playlist.songs.includes(songId)) {
      continue; //Skip if song is already in the playlist
    }
    //Add song to playlist
    playlist.songs.push(songId);
    console.log(playlist);
  }
  await playlist.save();

  res.status(StatusCodes.OK).json(playlist);
});

const removeFromPlaylist = asyncHandler(async (req, res) => {
  //find the playlist
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("playlist not found");
  }

  // Check if current user is creator or collaborator
  if (
    !playlist.creator.equals(req.user._id) &&
    !playlist.collaborators.some((collab) => collab.equals(req.user._id))
  ) {
    res.status(StatusCodes.FORBIDDEN);
    throw new Error("Not authorized to modify this playlist");
  }
  const songId = req.params.songId;
  //Check if song is in the playlist
  if (!playlist.songs.includes(songId)) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Song is not in the playlist");
  }
  //Remove song from playlist
  playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
  await playlist.save();
  res.status(StatusCodes.OK).json({ message: "Song removed from playlist" });
});

const addCollaborator = asyncHandler(async (req, res) => {
  const userId = req?.body?.userId;
  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("User ID is required");
  }
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not found");
  }
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Playlist not found");
  }
  // Only creator can add collaborators
  if (!playlist.creator.equals(req.user._id)) {
    res.status(StatusCodes.FORBIDDEN);
    throw new Error("Only the playlist creator can add collaborators");
  }
  // Check if user is already a collaborator
  if (playlist.collaborators.includes(userId)) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("User is already a collaborator");
  }
  // Add user to collaborators
  playlist.collaborators.push(userId);
  await playlist.save();

  res.status(StatusCodes.OK).json(playlist);
});

module.exports = {
  createPlaylist,
  getPlaylists,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongsToPlaylist,
  removeFromPlaylist,
  addCollaborator,

};
