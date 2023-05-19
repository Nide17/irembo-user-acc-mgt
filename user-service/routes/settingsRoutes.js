const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Public route - get all settings
// GET http://localhost:5001/settings
router.get('/', settingsController.getAllSettings);

// Public route - get setting by id
// GET http://localhost:5001/settings/:id
router.get('/:id', settingsController.getSettingsById);

// Public route - get setting by userId
// GET http://localhost:5001/settings/user/:userId
router.get('/user/:userId', settingsController.getSettingsByUserId);

// Public route - create new setting
// POST http://localhost:5001/settings
router.post('/', settingsController.createSettings);

// Public route - update setting by id
// PUT http://localhost:5001/settings/:id
router.put('/:id', settingsController.updateSettings);

// Public route - delete setting by id
// DELETE http://localhost:5001/settings/:id
router.delete('/:id', settingsController.deleteSettings);

module.exports = router;