const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settingsController')
const protectionMiddleware = require('../middlewares/protectionMiddleware')

// Private route - get all settings
// GET http://localhost:5002/settings
router.get('/', protectionMiddleware([2]), settingsController.getAllSettings)

// Private route - get setting by id
// GET http://localhost:5002/settings/:id
router.get('/:id', protectionMiddleware([2]), settingsController.getSettingsById)

// Private route - get setting by userId
// GET http://localhost:5002/settings/user/:userId
router.get('/user/:userId', protectionMiddleware([1, 2, 3]), settingsController.getSettingsByUserId)

// Private route - create new setting
// POST http://localhost:5002/settings
router.post('/', protectionMiddleware([1, 2, 3]), settingsController.createSettings)

// Private route - update setting by userId
// PUT http://localhost:5002/settings/user/:userId
router.put('/user/:userId', protectionMiddleware([1, 2, 3]), settingsController.updateSettings)

// Private route - delete setting by id
// DELETE http://localhost:5002/settings/:id
router.delete('/:id', protectionMiddleware([2]), settingsController.deleteSettings)

module.exports = router