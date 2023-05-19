const settings = require('../models/Settings');

// GET http://localhost:5001/settings - get all settings
const getAllSettings = async (req, res) => {
    console.log('Fetching all settings...');
    try {
        const stgs = await settings.findAll();
        res.json(stgs);
    } catch (error) {
        console.error('Error fetching settings', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET http://localhost:5001/settings/:id - get settings by id
const getSettingsById = async (req, res) => {
    console.log('Fetching settings by id...');
    try {
        const settings = await settings.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET http://localhost:5001/settings/user/:userId - get settings by userId
const getSettingsByUserId = async (req, res) => {
    console.log('Fetching settings by userId...');
    try {
        const settings = await settings.findOne({
            where: {
                userId: req.params.userId
            }
        });
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings by userId', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// POST http://localhost:5001/settings - create new settings
const createSettings = async (req, res) => {
    console.log('Creating new settings...');
    try {
        const settings = await settings.create({
            name: req.body.name
        });
        res.json(settings);
    } catch (error) {
        console.error('Error creating new settings', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// PUT http://localhost:5001/settings/:id - update settings by id
const updateSettings = async (req, res) => {
    console.log('Updating settings by id...');
    try {
        const settings = await settings.update({
            name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        });
        res.json(settings);
    } catch (error) {
        console.error('Error updating settings by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// DELETE http://localhost:5001/settings/:id - delete settings by id
const deleteSettings = async (req, res) => {
    console.log('Deleting settings by id...');
    try {
        const settings = await settings.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json(settings);
    } catch (error) {
        console.error('Error deleting settings by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllSettings,
    getSettingsById,
    createSettings,
    updateSettings,
    deleteSettings,
    getSettingsByUserId
}