const bcrypt = require("bcryptjs")
const axios = require('axios')
const crypto = require("crypto")
require('dotenv').config()

// UTILS
const sendEmailWithNodemailer = require('../utils/sendEmailWithNodemailer')
const validateEmail = require('../utils/validateEmail')
const validatePassword = require('../utils/validatePassword')

// MODELS
const PswdReset = require('../models/PswdReset')

// FORGOT PASSWORD
// POST http://localhost:5001/auth/forgot-password - forgot password
const forgotPassword = async (req, res) => {

    // DESTRUCTURE EMAIL
    const { email } = req.body

    // CHECK FOR VALIDITY OF EMAIL
    if (!validateEmail(email)) {
        return res.json({
            status: 400,
            msg: 'Please enter a valid email'
        })
    }

    try {

        // ASK THE USER SERVICE FOR THIS USER
        const userResponse = await axios.get(`${process.env.USER_SERVICE}/users/email/${email}`)

        // CHECK IF USER EXISTS
        if (userResponse.data.status !== 200) {
            return res.json({
                status: 400,
                msg: 'User does not exist!'
            })
        }

        // GENERATE RESET TOKEN
        const resetToken = crypto.randomBytes(20).toString('hex')

        // HASH RESET TOKEN
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        // SET RESET TOKEN EXPIRY TO 20 MINUTES
        const expiryDate = Date.now() + 20 * 60 * 1000

        // SAVE RESET TOKEN AND EXPIRY IN DATABASE
        const saveResetToken = await PswdReset.create({
            token: hashedResetToken,
            expiryDate,
            userId: userResponse.data.user.id
        })

        // CHECK IF RESET TOKEN SAVED
        if (!saveResetToken) {
            return res.json({
                status: 400,
                msg: 'Error saving reset token!'
            })
        }

        // SEND EMAIL
        const emailData = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset',
            html: `
                <h1>Reset Password</h1>
                <p>Click on the link below to reset your password</p>
                <a href="${process.env.DOMAIN}/auth/reset/${resetToken}">Reset Password</a>
                \nIf you didn't forget your password, please ignore this email!`
        }

        // SEND EMAIL
        const sendMail = await sendEmailWithNodemailer.sendEmailWithNodemailer(req, res, emailData)

        // CHECK IF EMAIL SENT
        if (!sendMail) {
            return res.json({
                status: 400,
                msg: 'Error sending email!'
            })
        }

        else {
            // RETURN EMAIL SENT SUCCESSFULLY
            return res.json({
                status: 200,
                msg: `Reset email sent to ${email} successfully!`
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

// RESET PASSWORD
// PUT http://localhost:5001/reset-password - reset password
const resetPassword = async (req, res) => {

    // DESTRUCTURE RESET TOKEN AND NEW PASSWORD
    const { resetToken, password } = req.body

    // DECRYPT RESET TOKEN
    const resetTokenDecrypted = crypto.createHash('sha256').update(resetToken).digest('hex')

    try {
        // CHECK IF RESET TOKEN EXISTS
        const resetTokenExists = await PswdReset.findOne({
            where: {
                token: resetTokenDecrypted
            }
        })

        // CHECK IF RESET TOKEN EXISTS
        if (!resetTokenExists) {
            return res.json({
                status: 400,
                msg: 'Invalid reset token!'
            })
        }

        // CHECK IF RESET TOKEN HAS EXPIRED
        if (resetTokenExists.expiryDate < Date.now()) {
            return res.json({
                status: 401,
                msg: 'Reset token has expired!'
            })
        }

        // CHECK IF NEW PASSWORD IS CORRECT
        if (!validatePassword(password)) {
            return res.json({
                status: 400,
                msg: 'Password must be atleast 8 characters long and contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character'
            })
        }

        // HASH NEW PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // UPDATE PASSWORD
        const updatedUser = await axios.put(`${process.env.USER_SERVICE}/users/${resetTokenExists.userId}`, {
            password: hashedPassword
        })

        // CHECK IF USER UPDATED
        if (!updatedUser.data) {
            return res.json({
                status: 400,
                msg: 'Error updating password!'
            })
        }

        // DELETE RESET TOKEN
        await PswdReset.destroy({
            where: {
                token: resetTokenDecrypted
            }
        })

        // RETURN UPDATED USER
        return res.json({
            status: 200,
            updatedUser: updatedUser.data
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// PASSWORD CHANGE
// PUT http://localhost:5001/auth/change-password - change password
const changePassword = async (req, res) => {

    // DESCTRUCTURE OLD PASSWORD AND NEW PASSWORD AND USER ID
    const { oldPswd, newPswd, userId } = req.body

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

        // GET USER FROM RESPONSE
        const user = userResponse.data.user

        // CHECK IF OLD PASSWORD IS CORRECT
        const isMatch = await bcrypt.compare(oldPswd, user.password)

        if (!isMatch) {
            return res.json({
                status: 400,
                msg: 'Invalid old credentials!'
            })
        }

        // CHECK IF NEW PASSWORD IS CORRECT
        if (!validatePassword(newPswd)) {
            return res.json({
                status: 400,
                msg: 'Password must be atleast 8 characters long and contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character'
            })
        }

        // HASH NEW PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPswd, salt)

        // CHECK IF NEW PASSWORD IS SAME AS OLD PASSWORD
        if (oldPswd === newPswd) {
            return res.json({
                status: 400,
                msg: 'New password cannot be same as old password!'
            })
        }

        // UPDATE PASSWORD
        const updatedUserResponse = await axios.put(`${process.env.USER_SERVICE}/users/${req.user.id}`, { password: hashedPassword }, {
            headers: {
                'x-auth-token': req.headers['x-auth-token'],
            }
        })

        // RETURN UPDATED USER
        if (updatedUserResponse.data.status !== 200) {
            return res.json({
                status: 400,
                msg: '\n\n\nPassword can not be updated!'
            })
        }

        // RETURN UPDATED USER
        return res.json({
            status: 200,
            updatedUser: updatedUserResponse.data.user // - Error changing password TypeError: Converting circular structure to JSON
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// EXPORTS
module.exports = {
    forgotPassword,
    resetPassword,
    changePassword
}