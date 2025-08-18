const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth');
const { createSong } = require('../controllers/songController');
const upload = require('../middlewares/upload');

const songRouter = express.Router();

const songUpload = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

songRouter.post('/', protect, isAdmin, upload.single('audio'), createSong);

module.exports = songRouter;