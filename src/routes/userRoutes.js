const express = require('express');
const { registerUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const userRouter = express.Router();

//Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//Private routes
userRouter.get('/profile', protect, (req, res) => {
  res.status(StatusCodes.OK).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    profilePicture: req.user.profilePicture,
  });
});



module.exports = userRouter;