const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const { createAlbum } = require('../controllers/albumController');
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

module.exports = albumRouter;
