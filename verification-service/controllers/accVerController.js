const AWS = require('aws-sdk')
const AccountVerification = require('../models/AccountVerification')

const s3Config = new AWS.S3({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
    Bucket: process.env.USER_DOCUMENTS,
    region: process.env.AWS_REGION,
})

// GET http://localhost:5003/accvers - get all accvers
const getAllAccVers = async (req, res) => {
    try {

        // RETURN ALL, SORT BY STATUS DESCENDING AND CREATEDAT ASCENDING
        const accvers = await AccountVerification.findAll({
            order: [
                ['status', 'ASC'],
                ['createdAt', 'ASC']
            ]
        })

        res.json(accvers)
    } catch (error) {
        res.status(500).json({
            msg: 'Internal server error',
            error
        })
    }
}

// GET http://localhost:5003/accvers/:id - get accver by id
const getAccVerById = async (req, res) => {
    try {
        const accver = await AccountVerification.findOne({
            where: {
                id: req.params.id
            }
        })
        res.json(accver)
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

// GET http://localhost:5003/accvers/user/:userId - get accver by user userId
const getAccVerByUserId = async (req, res) => {

    try {
        const accver = await AccountVerification.findOne({
            where: {
                userId: req.params.userId
            }
        })
        res.json(accver)
    } catch (error) {
        res.status(500).json({ msg: error, error })
    }
}

// PUT http://localhost:5003/accvers/user/:userId - update accver by userId
const updateAccVer = async (req, res) => {

    // DESTRUCTURE THE REQUEST BODY
    const { firstName, lastName, phone, documentType, documentNumber } = req.body
    const img_file = req.file

    // VALIDATE THE REQUEST BODY
    if (!firstName || !lastName || !phone || !documentType || !documentNumber) return res.status(400).json({ msg: 'Please enter all required fields!' })

    // VALIDATE THE PHONE NUMBER - 10 DIGITS, ONLY NUMBERS
    if (phone.length !== 10 || isNaN(phone)) return res.status(400).json({ msg: 'Please enter a valid phone number!' })

    // VALIDATE THE FILE
    if (!img_file) {
        return res.status(400).json({ msg: 'Document image is required!1' })
    }

    try {
        // FIND VERIFICATION BY USER ID
        const verific = await AccountVerification.findOne({
            where: {
                userId: req.params.userId
            }
        })

        if (!verific && !img_file) throw Error('Document image is required!')

        // IF VERIFICATION NOT EXISTS, CREATE VERIFICATION
        else if (!verific && img_file) {

            // CREATE NEW VERIFICATION
            const newVer = await AccountVerification.create({
                userId: req.params.userId,
                firstName,
                lastName,
                phone,
                documentType,
                documentNumber,
                documentImage: img_file.location ? img_file.location : img_file.path,
                status: 'pending',
            })

            if (!newVer) throw Error('Something went wrong while creating the verification!')

            // RETURN NEW VERIFICATION
            res.status(200).json(newVer)
        }

        // IF VERIFICATION EXISTS, UPDATE VERIFICATION
        else {
            // IF CURRENT VERIFICATION PHOTO IS NULL AND NEW VERIFICATION PHOTO IS NOT NULL - UPLOAD NEW VERIFICATION PHOTO
            if (!verific.documentImage && img_file) {
                const updatedVer = await AccountVerification.update({
                    firstName,
                    lastName,
                    phone,
                    documentType,
                    documentNumber,
                    documentImage: img_file.location ? img_file.location : img_file.path,
                    status: 'pending',
                    updatedAt: new Date()
                }, {
                    where: {
                        userId: req.params.userId
                    }
                })

                if (!updatedVer) throw Error('Something went wrong while updating the verification!')

                // RETURN UPDATED VERIFICATION
                res.status(200).json(updatedVer)
            }

            // IF CURRENT VERIFICATION PHOTO IS NOT NULL AND NEW VERIFICATION PHOTO IS NOT NULL - DELETE CURRENT VERIFICATION PHOTO AND UPLOAD NEW VERIFICATION PHOTO
            else if (verific.documentImage && img_file) {
                // DELETE CURRENT VERIFICATION PHOTO
                const params = {
                    Bucket: process.env.USER_DOCUMENTS,
                    Key: verific.documentImage.split('/').pop()
                }

                s3Config.deleteObject(params, (err, data) => {
                    if (err) console.error('Error deleting verification document', err)
                })

                // UPLOAD NEW VERIFICATION PHOTO
                const updatedVer = await AccountVerification.update({
                    firstName,
                    lastName,
                    phone,
                    documentType,
                    documentNumber,
                    documentImage: img_file.location ? img_file.location : img_file.path,
                    status: 'pending',
                    updatedAt: new Date()
                }, {
                    where: {
                        userId: req.params.userId
                    }
                })

                if (!updatedVer) throw Error('Something went wrong while updating the verification!')

                // RETURN UPDATED VERIFICATION
                res.status(200).json(updatedVer)
            }

            else {
                throw Error('Something went wrong, please check your inputs!')
            }

        }
    } catch (err) {
        console.error('Error: ', err)
        res.status(400).json({ msg: err.msg })
    }
}

// Private route - verify accver by id
// PUT http://localhost:5003/accvers/verify/:id
const verifyAccVer = async (req, res) => {
    try {
        const accver = await AccountVerification.update({
            status: req.body.status
        }, {
            where: {
                id: req.params.id
            }
        })
        res.json(accver)
    } catch (error) {
        console.error('Error verifying accver by id', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// DELETE http://localhost:5003/accvers/:id - delete accver by id
const deleteAccVer = async (req, res) => {
    try {
        const accver = await AccountVerification.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json(accver)
    } catch (error) {
        console.error('Error deleting accver by id', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

module.exports = {
    getAllAccVers,
    getAccVerById,
    getAccVerByUserId,
    updateAccVer,
    verifyAccVer,
    deleteAccVer
}
