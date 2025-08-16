const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const {
  getArtists,
  getArtistsById,
  updateArtist,
  createArtist,
} = require('../controllers/artistController');
const upload = require('../middlewares/upload');

const artistRouter = express.Router();

//Public routes
artistRouter.get('/', getArtists);
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

module.exports = artistRouter;
