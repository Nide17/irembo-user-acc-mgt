const express = require('express')
const userController = require('../controllers/userController')
const profileController = require('../controllers/profileController')
const userMiddleware = require('../middlewares/userMiddleware')
const { profileUpload } = require('../middlewares/profileUpload.js')
const router = express.Router()

// Private route
// GET http://localhost:5001/users/ - get all users
router.get('/', userMiddleware, userController.getAllUsers)

// Private route
// GET http://localhost:5001/users/:id - get user by id
router.get('/:id', userMiddleware, userController.getUserById)

// Private route
// GET http://localhost:5001/users/:email - get user by email
router.get('/email/:email', userController.getUserByEmail)

// Private route
// POST http://localhost:5001/users/ - create new user
router.post('/', userController.createUser)

// Private route
// PUT http://localhost:5001/users/:id - update user by id
router.put('/:id', userMiddleware, userController.updateUser)

// Private route
// DELETE http://localhost:5001/users/:id - delete user by id
router.delete('/:id', userMiddleware, userController.deleteUser)

// Private route
// GET http://localhost:5001/users/:id/profile - get user profile by id
router.get('/:id/profile', userMiddleware, profileController.getUserProfile)

// Private route
// PUT http://localhost:5001/users/:id/profile - update user profile
router.put('/:id/profile', userMiddleware, profileController.updateUserProfile)

// Private route
// PUT http://localhost:5001/users/:id/profilePhoto - update user profile photo
router.put('/:id/profilePhoto', userMiddleware, profileUpload.single('profilePhoto'), profileController.updateUserProfilePhoto)

module.exports = router
