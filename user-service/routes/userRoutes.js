const express = require('express');
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const userMiddleware = require('../middlewares/userMiddleware');
const { profileUpload } = require('../middlewares/profileUpload.js');
const router = express.Router();

// Public route
// GET http://localhost:5001/users/ - get all users
router.get('/', userController.getAllUsers);

// Public route
// GET http://localhost:5001/users/:id - get user by id
router.get('/:id', userController.getUserById);

// Public route
// GET http://localhost:5001/users/:email - get user by email
router.get('/email/:email', userController.getUserByEmail);

// Public route
// POST http://localhost:5001/users/ - create new user
router.post('/', userController.createUser);

// Public route
// PUT http://localhost:5001/users/:id - update user by id
router.put('/:id', userController.updateUser);

// Public route
// DELETE http://localhost:5001/users/:id - delete user by id
router.delete('/:id', userController.deleteUser);

// Private route
// GET http://localhost:5001/users/:id/profile - get user profile by id
router.get('/:id/profile', userMiddleware, profileController.getUserProfile);

// Private route
// PUT http://localhost:5001/users/:id/profile - update user profile
router.put('/:id/profile', userMiddleware, profileController.updateUserProfile);

// Private route
// POST http://localhost:5001/users/:id/profilePhoto - update user profile photo
router.post('/:id/profilePhoto', userMiddleware, profileUpload.single('profilePhoto'), profileController.updateUserProfilePhoto);

module.exports = router;
