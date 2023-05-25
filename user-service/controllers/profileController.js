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
    try {
        const profile = await UserProfile.findOne({
            where: {
                userId: req.params.userId
            }
        })

        if (!profile) {
            return res.json({
                status: 404,
                msg: 'Profile not found',
                profile: null
            })
        }
        else {
            return res.json({
                status: 200,
                profile
            })
        }
    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// UPDATE USER PROFILE
// PUT http://localhost:5002/profiles/user/:userId - update user profile
const updateProfile = async (req, res) => {

    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { firstName, lastName, gender, dateOfBirth, maritalStatus, nationality } = req.body

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

            if (!createdUserProfile) {
                return res.json({
                    status: 400,
                    msg: 'Something went wrong while creating the profile!',
                    profile: null
                })
            }

            // RETURN NEW PROFILE
            return res.json({
                status: 200,
                createdUserProfile
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
                    userId: req.params.userId
                }
            })

            if (!updatedUserProfile)
                return res.json({
                    status: 400,
                    msg: 'Something went wrong while updating the profile!',
                    profile: null
                })

            // RETURN UPDATED PROFILE
            return res.json({
                status: 200,
                updatedUserProfile
            })
        }
    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}


// UPDATE USER PROFILE PHOTO
// PUT http://localhost:5002/profiles/:userId/profilePhoto - update user profile photo
const updateUserProfilePhoto = async (req, res) => {

    // CHECK IF FILE IS MISSING
    if (!req.body && !req.file) {
        return res.json({
            status: 404,
            msg: 'File is missing!',
            profile: null
        })
    }
    // CHECK IF FILE IS AN IMAGE
    else {
        const img_file = req.boy || req.file

        try {
            // FIND PROFILE
            const profile = await UserProfile.findOne({
                where: {
                    userId: req.params.userId
                }
            })

            // IF PROFILE NOT EXISTS, CREATE NEW PROFILE
            if (!profile) {
                const newProfile = await UserProfile.create({
                    userId: req.params.userId,
                    profilePhoto: img_file.location ? img_file.location : img_file.path,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                if (!newProfile) {
                    return res.json({
                        status: 400,
                        msg: 'Something went wrong while creating the profile!',
                        profile: null
                    })
                }

                // RETURN NEW PROFILE
                return res.json({
                    status: 200,
                    newProfile
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
                            userId: req.params.userId
                        }
                    })

                    if (!updatedProfile) {
                        return res.json({
                            status: 400,
                            msg: 'Something went wrong while updating the profile!',
                            profile: null
                        })
                    }

                    // RETURN UPDATED PROFILE
                    return res.json({
                        status: 200,
                        updatedProfile
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
                        if (err) {
                            return res.json({
                                status: 400,
                                msg: 'Something went wrong while deleting old profile photo!',
                                profile: null
                            })
                        }
                    })

                    // UPLOAD NEW PROFILE PHOTO
                    const updatedProfile = await UserProfile.update({
                        profilePhoto: img_file.location ? img_file.location : img_file.path,
                        updatedAt: new Date()
                    }, {
                        where: {
                            userId: req.params.userId
                        }
                    })

                    if (!updatedProfile) {
                        return res.json({
                            status: 400,
                            msg: 'Something went wrong while updating the profile!',
                            profile: null
                        })
                    }

                    // RETURN UPDATED PROFILE
                    res.json({
                        status: 200,
                        updatedProfile
                    })
                }
                else {
                    return res.json({
                        status: 400,
                        msg: 'Something went wrong while updating the profile!',
                        profile: null
                    })
                }
            }
        } catch (err) {
            return res.json({
                status: 500,
                msg: 'Internal Server Error',
                err
            })
        }
    }
}

// EXPORTS
module.exports = {
    getProfileByUserId,
    updateProfile,
    updateUserProfilePhoto
}
