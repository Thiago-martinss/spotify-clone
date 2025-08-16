const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const {
  getArtists,
  getArtistsById,
  updateArtist,
  createArtist,
  deleteArtist,
  getTopArtists,
  getArtistTopSongs,
} = require('../controllers/artistController');
const upload = require('../middlewares/upload');

const artistRouter = express.Router();

//Public routes
artistRouter.get('/', getArtists);
artistRouter.get('/top', getTopArtists);
artistRouter.get('/:id/top-songs', getArtistTopSongs);
artistRouter.get('/:id', getArtistsById);

//Private routes

//Admin
artistRouter.post('/', protect, isAdmin, upload.single('image'), createArtist);
artistRouter.put(
  '/:id',
  protect,
  isAdmin,
  upload.single('image'),
  updateArtist
);

artistRouter.delete('/:id', protect, isAdmin, deleteArtist);

module.exports = artistRouter;
