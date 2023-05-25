const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const userProtection = require('../middlewares/userProtection')
const { profileUpload } = require('../middlewares/profileUpload')

// Private route - get setting by userId
// GET http://localhost:5002/profiles/user/:userId
router.get('/user/:userId', userProtection([1, 2, 3]), profileController.getProfileByUserId)

// Private route - update setting by userId
// PUT http://localhost:5002/profiles/user/:userId
router.put('/user/:userId', userProtection([1, 2, 3]), profileController.updateProfile)

// Private route
// PUT http://localhost:5002/profiles/:userId/profilePhoto - update user profile photo
router.put('/:userId/profilePhoto', userProtection([1, 2, 3]), profileUpload.single('profilePhoto'), profileController.updateUserProfilePhoto)

module.exports = router