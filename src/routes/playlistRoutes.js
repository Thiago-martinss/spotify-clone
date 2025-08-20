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
  removeFromPlaylist,
  addCollaborator,
  removeCollaborator,
} = require('../controllers/playlistController');
const upload = require('../middlewares/upload');

const playlistRouter = express.Router();

//Public routes
playlistRouter.get('/', getPlaylists);
playlistRouter.get('/:id', getPlaylistById);

//Private routes
playlistRouter.get('/user/me', protect, getUserPlaylists);

playlistRouter.put(
  '/:id',
  protect,
  upload.single('coverImage'),
  updatePlaylist
);

playlistRouter.delete('/:id', protect, deletePlaylist);
playlistRouter.put('/:id/add-songs', protect, addSongsToPlaylist);
playlistRouter.put("/:id/remove-song/:songId", protect, removeFromPlaylist);
playlistRouter.put("/:id/add-collaborator", protect, addCollaborator);
playlistRouter.put("/:id/remove-collaborator", protect, removeCollaborator);

//Admin
playlistRouter.post(
  '/',
  protect,
  isAdmin,
  upload.single('coverImage'),
  createPlaylist
);

module.exports = playlistRouter;
