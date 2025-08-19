const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  getTopSongs,
  getNewReleases
} = require('../controllers/songController');
const upload = require('../middlewares/upload');

const songRouter = express.Router();

const songUpload = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

//Public Routes
songRouter.get('/', getSongs);
songRouter.get('/:id', getSongById);
songRouter.get('/top', getTopSongs);
songRouter.get("/new-releases", getNewReleases);

//Admin Routes
songRouter.post('/', protect, isAdmin, songUpload, createSong);
songRouter.put('/:id', protect, isAdmin, songUpload, updateSong);
songRouter.delete('/:id', protect, isAdmin, deleteSong);

module.exports = songRouter;
