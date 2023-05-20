const AccountVerification = require('../models/AccountVerification')

// GET http://localhost:5003/accvers - get all accvers
const getAllAccVers = async (req, res) => {
    try {
        const accvers = await AccountVerification.findAll()
        res.json(accvers)
    } catch (error) {
        console.error('Error fetching verifications', error)
        res.status(500).json({ error: 'Internal server error' })
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
        console.error('Error fetching accver by id', error)
        res.status(500).json({ error: 'Internal server error' })
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
        console.error('Error fetching accver by userId', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// PUT http://localhost:5003/accvers/:userId - update accver by userId
const updateAccVer = async (req, res) => {

    // DESTRUCTURE THE REQUEST BODY
    const { documentType, documentNumber, status } = req.body
    const img_file = req.file

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
            const newVer = await AccountVerification.create({
                userId: req.params.userId,
                documentType,
                documentNumber,
                documentImage: img_file.location ? img_file.location : img_file.path,
                status
            })

            if (!newVer) throw Error('Something went wrong while creating the verification!')

            // RETURN NEW VERIFICATION
            res.status(200).json({
                message: 'Created successfully!',
                verification: newVer
            })
        }

        // IF VERIFICATION EXISTS, UPDATE VERIFICATION
        else {
            // IF CURRENT VERIFICATION PHOTO IS NULL AND NEW VERIFICATION PHOTO IS NOT NULL - UPLOAD NEW VERIFICATION PHOTO
            if (!verific.documentImage && img_file) {
                const updatedVer = await AccountVerification.update({
                    documentImage: img_file.location ? img_file.location : img_file.path,
                    updatedAt: new Date()
                }, {
                    where: {
                        userId: req.params.userId
                    }
                })

                if (!updatedVer) throw Error('Something went wrong while updating the verification!')

                // RETURN UPDATED VERIFICATION
                res.status(200).json({
                    message: 'Updated successfully!',
                    verification: updatedVer
                })
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
                    documentImage: img_file.location ? img_file.location : img_file.path,
                    updatedAt: new Date()
                }, {
                    where: {
                        userId: req.params.userId
                    }
                })

                if (!updatedVer) throw Error('Something went wrong while updating the verification!')

                // RETURN UPDATED VERIFICATION
                res.status(200).json({
                    message: 'Verification updated successfully!',
                    verification: updatedVer
                })
            }

            else
                throw Error('Something went wrong, please check your inputs!')
        }
    } catch (err) {
        console.error('Error: ', err)
        res.status(400).json({ msg: err.message })
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
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    getAllAccVers,
    getAccVerById,
    getAccVerByUserId,
    updateAccVer,
    deleteAccVer
}
