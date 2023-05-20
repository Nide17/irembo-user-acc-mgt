const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settingsController')
const protectionMiddleware = require('../middlewares/protectionMiddleware')

// Private route - get all settings
// GET http://localhost:5001/settings
router.get('/', protectionMiddleware, settingsController.getAllSettings)

// Private route - get setting by id
// GET http://localhost:5001/settings/:id
router.get('/:id', protectionMiddleware, settingsController.getSettingsById)

// Private route - get setting by userId
// GET http://localhost:5001/settings/user/:userId
router.get('/user/:userId', protectionMiddleware, settingsController.getSettingsByUserId)

// Private route - create new setting
// POST http://localhost:5001/settings
router.post('/', protectionMiddleware, settingsController.createSettings)

// Private route - update setting by userId
// PUT http://localhost:5001/settings/user/:userId
router.put('/user/:userId', protectionMiddleware, settingsController.updateSettings)

// Private route - delete setting by id
// DELETE http://localhost:5001/settings/:id
router.delete('/:id', protectionMiddleware, settingsController.deleteSettings)

module.exports = router