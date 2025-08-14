const express = require('express');
const { registerUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const userRouter = express.Router();

//Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


module.exports = userRouter;