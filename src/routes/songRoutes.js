const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const { createSong, getSongs, getSongById } = require('../controllers/songController');
const upload = require('../middlewares/upload');

const songRouter = express.Router();

const songUpload = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

//Public Routes
songRouter.get("/", getSongs);
songRouter.get("/:id", getSongById);

//Admin Routes
songRouter.post("/", protect, isAdmin, songUpload, createSong);

module.exports = songRouter;