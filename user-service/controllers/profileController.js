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
// GET http://localhost:5001/:id/profile - get user profile
const getUserProfile = async (req, res) => {
    console.log('\nFetching user profile...\n')
    try {
        const profile = await UserProfile.findOne({
            where: {
                userId: req.params.id
            }
        })

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' })
        }

        res.json(profile)
    } catch (error) {
        console.error('Error fetching user profile', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// UPDATE USER PROFILE
// PUT http://localhost:5001/users/:id/profile - update user profile
const updateUserProfile = async (req, res) => {
    console.log('\nUpdating user profile...\n')

    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { firstName, lastName, gender, dateOfBirth, maritalStatus, nationality } = req.body
    
    // CALCULATE USER AGE
    const age = moment().diff(dateOfBirth, 'years')
    console.log(age)

    try {
        const profile = await UserProfile.findOne({
            where: {
                userId: req.params.id
            }
        })

        if (!profile) {

            // CREATE USER PROFILE
            const createdUserProfile = await UserProfile.create({
                userId: req.params.id,
                firstName,
                lastName,
                gender,
                dateOfBirth,
                age,
                maritalStatus,
                nationality
            })

            if (!createdUserProfile) throw Error('Something went wrong while creating the profile!')

            return res.json({ message: 'Profile created successfully!' })
        }

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

        return res.json({ message: 'Profile updated successfully!' })
    } catch (error) {
        console.error('Error updating user profile', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}


// UPDATE USER PROFILE PHOTO
// POST http://localhost:5001/:id/profilePhoto - update user profile photo
const updateUserProfilePhoto = async (req, res) => {
    console.log('\nUpdating user profile photo...\n')

    // CHECK IF FILE IS MISSING
    if (!req.file) {
        throw Error('FILE_MISSING')
    }

    // CHECK IF FILE IS AN IMAGE
    else {
        const img_file = req.file

        try {
            // FIND PROFILE
            const profile = await UserProfile.findOne({
                where: {
                    userId: req.params.id
                }
            })

            console.log('\nProfile: ', profile)

            // IF PROFILE NOT EXISTS, CREATE NEW PROFILE
            if (!profile) {
                const newProfile = await UserProfile.create({
                    userId: req.params.id,
                    profilePhoto: img_file.location ? img_file.location : img_file.path,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                if (!newProfile) throw Error('Something went wrong while creating the profile!')

                // RETURN NEW PROFILE
                res.status(200).json({
                    message: 'Profile created successfully!',
                    profile: newProfile
                })
            }

            // IF PROFILE EXISTS, UPDATE PROFILE PHOTO
            else {
                console.log('\nProfile: ', profile.profilePhoto)
                // REMOVE OLD PROFILE PHOTO FROM S3
                if (profile && profile.profilePhoto) {
                    const params = {
                        Bucket: process.env.USER_PROFILE_PHOTOS,

                        // TAKE FILE NAME FROM DATABASE
                        Key: profile.profilePhoto.split('/').pop() //if any sub folder-> path/of/the/folder.ext
                    }

                    try {
                        // DELETE FILE FROM S3
                        s3Config.deleteObject(params, (err, data) => {
                            if (err) {
                                console.log(err, err.stack) // an error occurred
                            }
                            else {
                                console.log(params.Key + ' deleted!')
                            }
                        })
                    }
                    catch (err) {
                        console.log('ERROR in file Deleting : ' + JSON.stringify(err))
                    }
                }

                console.log('\nUploading new profile photo...\n')
                // UPDATE PROFILE PHOTO
                const updatedUserProfile = await UserProfile.update({
                    profilePhoto: img_file.location ? img_file.location : img_file.path,
                    updatedAt: new Date()
                }, {
                    where: {
                        userId: req.params.id
                    }
                })

                if (!updatedUserProfile) throw Error('Something went wrong while updating the profile photo!')

                console.log(`\nProfile photo ${img_file.originalname} uploaded successfully!\n`)
                console.log(img_file)

                // RETURN UPDATED PROFILE
                res.status(200).json({
                    message: 'Profile photo updated successfully!',
                    profile: updatedUserProfile
                })
            }
        } catch (err) {
            res.status(400).json({ msg: err.message })
        }
    }
}

// EXPORTS
module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserProfilePhoto
}
