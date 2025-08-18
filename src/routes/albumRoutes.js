const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const { createAlbum, getAlbums, getAlbumsById } = require('../controllers/albumController');
const upload = require('../middlewares/upload');

const albumRouter = express.Router();

//Public routes

albumRouter.post(
  '/',
  protect,
  isAdmin,
  upload.single('coverImage'),
  createAlbum
);

albumRouter.get('/', getAlbums);

albumRouter.get('/:id', getAlbumsById);


module.exports = albumRouter;
