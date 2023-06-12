const Settings = require('../models/Settings')
const axios = require('axios')

// GET http://localhost:5002/settings - get all settings
const getAllSettings = async (req, res) => {

    try {

        // FIND ALL SETTINGS
        const stgs = await Settings.findAll()

        // IF NO SETTINGS FOUND
        if (!stgs) {
            return res.json({
                status: 404,
                msg: 'No settings found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            stgs
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// GET http://localhost:5002/settings/:id - get settings by id
const getSettingsById = async (req, res) => {
    try {
        const settings = await Settings.findOne({
            where: {
                id: req.params.id
            }
        })

        // IF NO SETTINGS FOUND
        if (!settings) {
            return res.json({
                status: 404,
                msg: 'Settings not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            settings
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// GET http://localhost:5002/settings/user/:userId - get settings by userId
const getSettingsByUserId = async (req, res) => {
    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { userId } = req.params

    // IF USER HAS SETTINGS, RETURN SETTINGS
    try {

        // ASK THE USER SERVICE FOR THIS USER
        const userResponse = await axios.get(`${process.env.USER_SERVICE}/users/${userId}`, {
            headers: {
                'Content-Type': req.headers['content-type'],
                'x-auth-token': req.headers['x-auth-token']
            }
        })

        // CHECK IF USER EXISTS
        if (userResponse.data.status !== 200) {
            return res.json({
                status: 400,
                msg: 'User does not exist!'
            })
        }

        // CHECK IF USER HAS SETTINGS ALREADY
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

            // IF SETTINGS CANNOT BE CREATED
            if (!createdSettings) {
                return res.json({
                    status: 400,
                    msg: 'Something went wrong while creating the settings!'
                })
            }

            // SEND SUCCESS RESPONSE
            else {
                return res.json({
                    status: 200,
                    createdSettings
                })
            }
        }

        // SEND SUCCESS RESPONSE IF USER HAS SETTINGS
        else {
            return res.json({
                status: 200,
                settings
            })
        }

    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// POST http://localhost:5002/settings - create new settings
const createSettings = async (req, res) => {
    try {
        const settings = await Settings.create({
            name: req.body.name
        })

        // IF NO SETTINGS FOUND
        if (!settings) {
            return res.json({
                status: 400,
                msg: 'Something went wrong while creating the settings!'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            settings
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// PUT http://localhost:5002/settings/user/:userId - update settings by id
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

        // IF NO SETTINGS FOUND
        if (!settings) {
            return res.json({
                status: 404,
                msg: 'Settings not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            settings
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// DELETE http://localhost:5002/settings/:id - delete settings by id
const deleteSettings = async (req, res) => {
    try {
        const settings = await Settings.destroy({
            where: {
                id: req.params.id
            }
        })

        // IF NO SETTINGS FOUND
        if (!settings) {
            return res.json({
                status: 404,
                msg: 'Settings not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            settings
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
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