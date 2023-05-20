const Settings = require('../models/Settings')

// GET http://localhost:5001/settings - get all settings
const getAllSettings = async (req, res) => {
    try {
        const stgs = await Settings.findAll()
        res.json(stgs)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// GET http://localhost:5001/settings/:id - get settings by id
const getSettingsById = async (req, res) => {
    try {
        const settings = await Settings.findOne({
            where: {
                id: req.params.id
            }
        })
        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// GET http://localhost:5001/settings/user/:userId - get settings by userId
const getSettingsByUserId = async (req, res) => {
    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { userId } = req.params

    // IF USER HAS SETTINGS, RETURN SETTINGS
    try {
        const settings = await Settings.findOne({
            where: {
                userId
            }
        })

        if (!settings) {
            // IF USER DOES NOT HAVE SETTINGS, CREATE SETTINGS
            const createdSettings = await Settings.create({
                userId,
                notifications: true,
                mfa: false
            })

            if (!createdSettings) {
                throw Error('Something went wrong while creating the settings!')
            }
            else {
                return res.json({ message: 'Settings created successfully!' })
            }
        }

        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// POST http://localhost:5001/settings - create new settings
const createSettings = async (req, res) => {
    try {
        const settings = await Settings.create({
            name: req.body.name
        })
        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// PUT http://localhost:5001/settings/user/:userId - update settings by id
const updateSettings = async (req, res) => {

    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { notifications, mfa } = req.body
    try {
        // UPDATE SETTINGS
        const settings = await Settings.update({
            notifications,
            mfa
        }, {
            where: {
                userId: req.params.userId
            }
        })

        if (!settings) throw Error('Something went wrong while updating the settings!')

        res.json({
            message: 'Settings updated successfully!',
            settings
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// DELETE http://localhost:5001/settings/:id - delete settings by id
const deleteSettings = async (req, res) => {
    try {
        const settings = await Settings.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
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