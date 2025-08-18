const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const createSong = asyncHandler(async (req, res) => {
  const {
    title,
    artistId,
    albumId,
    duration,
    genre,
    lyrics,
    isExplicit,
    featuredArtists,
  } = req.body;
  //Check if artist exists
  const artist = await Artist.findById(artistId);
  if (!artist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }
  // Check if album exists if albumId is provided
  if (albumId) {
    const album = await Album.findById(albumId);
    if (!album) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Album not found");
    }
  }
  //Upload audio file
  if (!req.files || !req.files.audio) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Audio file is required");
  }
  const audioResult = await uploadToCloudinary(
    req.files.audio[0].path,
    "spotify/songs"
  );
  // Upload cover image if provided
  let coverImageUrl = "";
  if (req.files && req.files.cover) {
    const imageResult = await uploadToCloudinary(
      req.files.cover[0].path,
      "spotify/covers"
    );
    coverImageUrl = imageResult.secure_url;
  }
  //Crete song
  const song = await Song.create({
    title,
    artist: artistId,
    album: albumId || null,
    duration,
    audioUrl: audioResult.secure_url,
    genre,
    lyrics,
    isExplicit: isExplicit === "true",
    featuredArtists: featuredArtists ? JSON.parse(featuredArtists) : [],
    coverImage: coverImageUrl,
  });

  //Add song to artist's songs
  artist.songs.push(song._id);
  await artist.save();
  //add song to album if album id is provided
  if (albumId) {
    const album = await Album.findById(albumId);
    album.songs.push(song._id);
    await album.save();
  }
  res.status(StatusCodes.CREATED).json(song);
});

module.exports = {
  createSong,
};