const express = require('express')
const userController = require('../controllers/userController')
const profileController = require('../controllers/profileController')
const protectionMiddleware = require('../middlewares/protectionMiddleware')
const { profileUpload } = require('../middlewares/profileUpload.js')
const router = express.Router()

// Private route
// GET http://localhost:5001/users/ - get all users
router.get('/', protectionMiddleware, userController.getAllUsers)

// Private route
// GET http://localhost:5001/users/:id - get user by id
router.get('/:id', protectionMiddleware, userController.getUserById)

// Private route
// GET http://localhost:5001/users/:email - get user by email
router.get('/email/:email', userController.getUserByEmail)

// Private route
// POST http://localhost:5001/users/ - create new user
router.post('/', userController.createUser)

// Private route
// PUT http://localhost:5001/users/:id - update user by id
router.put('/:id', protectionMiddleware, userController.updateUser)

// Private route
// DELETE http://localhost:5001/users/:id - delete user by id
router.delete('/:id', protectionMiddleware, userController.deleteUser)

// Private route
// GET http://localhost:5001/users/:id/profile - get user profile by id
router.get('/:id/profile', protectionMiddleware, profileController.getUserProfile)

// Private route
// PUT http://localhost:5001/users/:id/profile - update user profile
router.put('/:id/profile', protectionMiddleware, profileController.updateUserProfile)

// Private route
// PUT http://localhost:5001/users/:id/profilePhoto - update user profile photo
router.put('/:id/profilePhoto', protectionMiddleware, profileUpload.single('profilePhoto'), profileController.updateUserProfilePhoto)

module.exports = router
