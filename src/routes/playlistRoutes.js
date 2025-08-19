const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const { createPlaylist, getPlaylists } = require('../controllers/playlistController');
const upload = require('../middlewares/upload');

const playlistRouter = express.Router();

//Public routes
playlistRouter.get('/', getPlaylists);

//Admin
playlistRouter.post(
  '/',
  protect,
  isAdmin,
  upload.single('coverImage'),
  createPlaylist
);

module.exports = playlistRouter;