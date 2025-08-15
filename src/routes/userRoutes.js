const express = require('express');
const { registerUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const { getUserProfile } = require('../controllers/userController');
const { updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const userRouter = express.Router();

//Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//Private routes
userRouter.get('/profile', protect, getUserProfile);
userRouter.put(
  '/profile',
  protect,
  upload.single('profilePicture'),
  updateUserProfile
);

module.exports = userRouter;
