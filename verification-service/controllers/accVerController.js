const AWS = require('aws-sdk')
const AccountVerification = require('../models/AccountVerification')

// UTILS
const sendEmailWithNodemailer = require('../utils/sendEmailWithNodemailer')
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

        // IF NO ACCVERS FOUND
        if (!accvers) {
            return res.json({
                status: 404,
                msg: 'No account verifications found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            accvers
        })

    } catch (error) {
        return res.json({
            status: 500,
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

        // IF NO ACCVER FOUND
        if (!accver) {
            return res.json({
                status: 404,
                msg: 'Account verification not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            accver
        })


    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
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

        // IF NO ACCVER FOUND
        if (!accver) {
            return res.json({
                status: 404,
                msg: 'Account verification not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            accver
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// PUT http://localhost:5003/accvers/user/:userId - update accver by userId
const updateAccVer = async (req, res) => {

    // DESTRUCTURE THE REQUEST BODY
    const { firstName, lastName, phone, documentType, documentNumber } = req.body
    const img_file = req.file

    // VALIDATE THE REQUEST BODY
    if (!firstName || !lastName || !phone || !documentType || !documentNumber) {
        return res.json({
            status: 400,
            msg: 'Please enter all required fields!'
        })
    }

    // VALIDATE THE PHONE NUMBER - 10 DIGITS, ONLY NUMBERS
    if (phone.length !== 10 || isNaN(phone)) {

        return res.json({
            status: 400,
            msg: 'Please enter a valid phone number!'
        })
    }

    // VALIDATE THE FILE
    if (!img_file) {
        return res.json({
            status: 400,
            msg: 'Document image is required!1'
        })
    }

    try {
        // FIND VERIFICATION BY USER ID
        const verific = await AccountVerification.findOne({
            where: {
                userId: req.params.userId
            }
        })

        if (!verific && !img_file) {
            return res.json({
                status: 400,
                msg: 'Document image is required!2'
            })
        }

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

            if (!newVer) {
                return res.json({
                    status: 400,
                    msg: 'Something went wrong while creating the verification!'
                })
            }

            // RETURN NEW VERIFICATION
            return res.json({
                status: 200,
                newVer
            })
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

                if (!updatedVer) {
                    return res.json({
                        status: 400,
                        msg: 'Something went wrong while updating the verification!'
                    })
                }

                // RETURN UPDATED VERIFICATION
                return res.json({
                    status: 200,
                    updatedVer
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
                    if (err) {
                        return res.json({
                            status: 500,
                            msg: 'Something went wrong while deleting the verification!',
                            err
                        })
                    }
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

                if (!updatedVer) {
                    return res.json({
                        status: 400,
                        msg: 'Something went wrong while updating the verification!'
                    })
                }

                // RETURN UPDATED VERIFICATION
                return res.json({
                    status: 200,
                    updatedVer
                })
            }

            else {
                return res.json({
                    status: 400,
                    msg: 'Something went wrong while updating the verification'
                })
            }

        }
    } catch (err) {
        return res.json({
            status: 400,
            msg: 'Internal server error',
            err
        })
    }
}

// Private route - verify accver by id
// PUT http://localhost:5003/accvers/verify/:id
const verifyAccVer = async (req, res) => {

    // ATTEMPT TO UPDATE VERIFICATION STATUS
    try {
        const accver = await AccountVerification.update({
            status: req.body.status
        }, {
            where: {
                id: req.params.id
            }
        })

        // IF ACVER NOT UPDATED
        if (!accver) {
            return res.json({
                status: 400,
                msg: 'Something went wrong while updating the verification!'
            })
        }

        // IF ACCOUNT VERIFIED, LET'S SEND UPDATE NOTIFICATION TO THE USER
        else {

            // GET THE USER EMAIL ASSOCIATED WITH THE DOCUMENT - req.body.userId
            const userResponse = await axios.get(`${process.env.USER_SERVICE}/users/${req.body.userId}`, {
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

            // GET USER FROM RESPONSE
            const user = userResponse.data.user

            // EMAIL CONTENT
            const emailContent = req.body.status === 'verified' ? 'Good news!\nYour account has been verified!\n' : 'Bad news.\nYour verification request has been declined:\n'
            const reasonMessage = req.body.reasonMessage || 'Thanks!'

            // EMAIL
            const emailData = {
                from: process.env.SMTP_USER,
                to: user.email,
                subject: 'Account verification update',
                html: `
                <h1>Account Verification</h1>
                <p>${emailContent}</p>
                <a href="${process.env.CLIENT_SERVICE}/verification">Check that</a>
                <p>${reasonMessage}</p>
                \nIf you receive this email by mistake, please ignore it!`
            }

            // SEND NOTIFICATION EMAIL 
            if (req.body.status === 'verified' || req.body.status === 'unverified') {
                const sendMail = await sendEmailWithNodemailer.sendEmailWithNodemailer(req, res, emailData)

                // CHECK IF EMAIL SENT
                if (!sendMail) {
                    return res.json({
                        status: 400,
                        msg: 'Error sending email!'
                    })
                }
                else {
                    // RETURN EMAIL SENT
                    return res.json({
                        status: 200,
                        msg: 'Email sent!'
                    })
                }
            }

            else {
                // SEND SUCCESS RESPONSE
                return res.json({
                    status: 200,
                    accver
                })
            }
        }

    } catch (error) {
        return res.json({
            status: 400,
            msg: 'Internal server error',
            error
        })
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

        // IF NOT DELETE
        if (!accver) {
            return res.json({
                status: 400,
                msg: 'Something went wrong while deleting the verification!'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            accver
        })
    } catch (error) {
        return res.json({
            status: 400,
            msg: 'Internal server error',
            error
        })
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
