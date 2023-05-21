const AWS = require('aws-sdk')
require('dotenv').config()
const moment = require('moment')

// MODELS
const UserProfile = require('../models/UserProfile')

// UTILS
const s3Config = new AWS.S3({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
    Bucket: process.env.USER_PROFILE_PHOTOS,
    region: process.env.AWS_REGION,
})

// GET USER PROFILE
// GET http://localhost:5002/profiles/user/:userId/ - get user profile
const getProfileByUserId = async (req, res) => {
    console.log('\n\n\n\n Edpoint hit \n', req)
    try {
        const profile = await UserProfile.findOne({
            where: {
                userId: req.params.userId
            }
        })

        if (!profile) {
            res.status(404).json({ error: 'Profile not found' })
        }
        else {
            res.status(200).json(profile)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// UPDATE USER PROFILE
// PUT http://localhost:5002/profiles/user/:userId - update user profile
const updateProfile = async (req, res) => {

    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { firstName, lastName, gender, dateOfBirth, maritalStatus, nationality } = req.body

    console.log(req.body)

    // CALCULATE USER AGE
    const age = moment().diff(dateOfBirth, 'years')

    try {
        const profile = await UserProfile.findOne({
            where: {
                userId: req.params.userId
            }
        })

        if (!profile) {

            // CREATE USER PROFILE
            const createdUserProfile = await UserProfile.create({
                userId: req.params.userId,
                firstName,
                lastName,
                gender,
                dateOfBirth,
                age,
                maritalStatus,
                nationality
            })

            if (!createdUserProfile) throw Error('Something went wrong while creating the profile!')

            res.json({
                message: 'Profile created successfully!',
                profile: createdUserProfile
            })
        }
        else {
            // UPDATE PROFILE
            const updatedUserProfile = await UserProfile.update({
                firstName,
                lastName,
                gender,
                age,
                dateOfBirth,
                maritalStatus,
                nationality,
                updatedAt: new Date()
            }, {
                where: {
                    userId: req.params.id
                }
            })

            if (!updatedUserProfile) throw Error('Something went wrong while updating the profile!')

            res.json({
                message: 'Profile updated successfully!',
                profile: updatedUserProfile
            })
        }
    } catch (error) {
        console.error('Error updating user profile', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}


// UPDATE USER PROFILE PHOTO
// PUT http://localhost:5002/profiles/:userId/profilePhoto - update user profile photo
const updateUserProfilePhoto = async (req, res) => {

    console.log('endpoint hit')

    // CHECK IF FILE IS MISSING
    if (!req.file) {
        throw Error('Image is missing');
    }

    // CHECK IF FILE IS AN IMAGE
    else {
        const img_file = req.file

        try {
            console.log('finding profile ...')
            // FIND PROFILE
            const profile = await UserProfile.findOne({
                where: {
                    userId: req.params.id
                }
            })

            // IF PROFILE NOT EXISTS, CREATE NEW PROFILE
            if (!profile) {
                const newProfile = await UserProfile.create({
                    userId: req.params.id,
                    profilePhoto: img_file.location ? img_file.location : img_file.path,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                console.log('newProfile', newProfile)

                if (!newProfile) throw Error('Something went wrong while creating the profile!')

                // RETURN NEW PROFILE
                res.status(200).json({
                    message: 'Profile created successfully!',
                    profile: newProfile
                })
            }

            // IF PROFILE EXISTS, UPDATE PROFILE PHOTO
            else {
                // IF CURRENT PROFILE PHOTO IS NULL AND NEW PROFILE PHOTO IS NOT NULL - UPLOAD NEW PROFILE PHOTO
                if (!profile.profilePhoto && img_file) {
                    const updatedProfile = await UserProfile.update({
                        profilePhoto: img_file.location ? img_file.location : img_file.path,
                        updatedAt: new Date()
                    }, {
                        where: {
                            userId: req.params.id
                        }
                    })

                    console.log('updatedProfile',
                    )

                    if (!updatedProfile) throw Error('Something went wrong while updating the profile!')

                    // RETURN UPDATED PROFILE
                    res.status(200).json({
                        message: 'Profile updated successfully!',
                        profile: updatedProfile
                    })
                }

                // IF CURRENT PROFILE PHOTO IS NOT NULL AND NEW PROFILE PHOTO IS NOT NULL - DELETE CURRENT PROFILE PHOTO AND UPLOAD NEW PROFILE PHOTO
                else if (profile.profilePhoto && img_file) {
                    // DELETE CURRENT PROFILE PHOTO
                    const params = {
                        Bucket: process.env.USER_PROFILE_PHOTOS,
                        Key: profile.profilePhoto.split('/').pop()
                    }

                    s3Config.deleteObject(params, (err, data) => {
                        if (err) console.error('Error deleting user profile photo', err)
                    })

                    // UPLOAD NEW PROFILE PHOTO
                    const updatedProfile = await UserProfile.update({
                        profilePhoto: img_file.location ? img_file.location : img_file.path,
                        updatedAt: new Date()
                    }, {
                        where: {
                            userId: req.params.id
                        }
                    })

                    console.log('updatedProfile photo', updatedProfile)

                    if (!updatedProfile) throw Error('Something went wrong while updating the profile!')

                    // RETURN UPDATED PROFILE
                    res.status(200).json({
                        message: 'Profile updated successfully!',
                        profile: updatedProfile
                    })
                }
                else
                    throw Error('Something went wrong while updating the profile!')
            }
        } catch (err) {
            console.error('Error updating user profile photo', err)
            res.status(400).json({ msg: err.message })
            throw Error(err)
        }
    }
}

// EXPORTS
module.exports = {
    getProfileByUserId,
    updateProfile,
    updateUserProfilePhoto
}