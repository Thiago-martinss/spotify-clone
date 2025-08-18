const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const { createSong, getSongs } = require('../controllers/songController');
const upload = require('../middlewares/upload');

const songRouter = express.Router();

const songUpload = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

//Public Routes
songRouter.get("/", getSongs);

//Admin Routes
songRouter.post("/", protect, isAdmin, songUpload, createSong);

module.exports = songRouter;