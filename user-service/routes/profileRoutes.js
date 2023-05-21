const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const protectionMiddleware = require('../middlewares/protectionMiddleware')
const { profileUpload } = require('../middlewares/profileUpload')

// Private route - get setting by userId
// GET http://localhost:5002/profiles/user/:userId
router.get('/user/:userId', protectionMiddleware, profileController.getProfileByUserId)

// Private route - update setting by userId
// PUT http://localhost:5002/profiles/user/:userId
router.put('/user/:userId', protectionMiddleware, profileController.updateProfile)

// Private route
// PUT http://localhost:5002/profiles/:userId/profilePhoto - update user profile photo
router.put('/:userId/profilePhoto', protectionMiddleware, profileUpload.single('profilePhoto'), profileController.updateUserProfilePhoto)

module.exports = router