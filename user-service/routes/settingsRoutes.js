const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settingsController')
const userMiddleware = require('../middlewares/userMiddleware')

// Private route - get all settings
// GET http://localhost:5001/settings
router.get('/', userMiddleware, settingsController.getAllSettings)

// Private route - get setting by id
// GET http://localhost:5001/settings/:id
router.get('/:id', userMiddleware, settingsController.getSettingsById)

// Private route - get setting by userId
// GET http://localhost:5001/settings/user/:userId
router.get('/user/:userId', userMiddleware, settingsController.getSettingsByUserId)

// Private route - create new setting
// POST http://localhost:5001/settings
router.post('/', userMiddleware, settingsController.createSettings)

// Private route - update setting by userId
// PUT http://localhost:5001/settings/user/:userId
router.put('/user/:userId', userMiddleware, settingsController.updateSettings)

// Private route - delete setting by id
// DELETE http://localhost:5001/settings/:id
router.delete('/:id', userMiddleware, settingsController.deleteSettings)

module.exports = router