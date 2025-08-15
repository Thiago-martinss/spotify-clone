const express = require('express');
const { registerUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const { getUserProfile } = require('../controllers/userController');
const { updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const userRouter = express.Router();

//Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//Private routes
userRouter.get('/profile', protect, getUserProfile);
userRouter.put('/profile', protect, updateUserProfile);

module.exports = userRouter;
