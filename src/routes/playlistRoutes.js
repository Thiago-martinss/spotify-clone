const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const {
  createPlaylist,
  getPlaylists,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongsToPlaylist,
} = require('../controllers/playlistController');
const upload = require('../middlewares/upload');

const playlistRouter = express.Router();

//Public routes
playlistRouter.get('/', getPlaylists);
playlistRouter.get('/:id', getPlaylistById);

//Private routes
playlistRouter.get('/user/me', protect, getUserPlaylists);

playlistRouter.put(
  "/:id",
  protect,
  upload.single("coverImage"),
  updatePlaylist
);

playlistRouter.delete("/:id", protect, deletePlaylist);

playlistRouter.put("/:id/add-songs", protect, addSongsToPlaylist);

//Admin
playlistRouter.post(
  '/',
  protect,
  isAdmin,
  upload.single('coverImage'),
  createPlaylist
);

module.exports = playlistRouter;
