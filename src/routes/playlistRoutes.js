const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const { createPlaylist } = require('../controllers/playlistController');
const upload = require('../middlewares/upload');

const playlistRouter = express.Router();


//Admin
playlistRouter.post(
  '/',
  protect,
  isAdmin,
  upload.single('coverImage'),
  createPlaylist
);

module.exports = playlistRouter;