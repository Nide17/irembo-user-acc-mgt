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
// POST http://localhost:5001/forgot-password - forgot password
const forgotPassword = async (req, res) => {
    // DESTRUCTURE EMAIL
    const { email } = req.body

    // CHECK FOR VALIDITY OF EMAIL
    if (!validateEmail(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email' })
    }

    try {
        // ASK THE USER SERVICE FOR THIS USER
        const user = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/email/` + email)

        // CHECK IF USER EXISTS
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist!' })
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
            userId: user.data.id
        })

        // CHECK IF RESET TOKEN SAVED
        if (!saveResetToken) {
            console.error('Error saving reset token')
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
        await sendEmailWithNodemailer.sendEmailWithNodemailer(req, res, emailData)

        // RETURN EMAIL SENT SUCCESSFULLY
        res.status(200).json({
            msg: `Email sent successfully!`
        })

    } catch (error) {
        console.error('Error forgot password', error)
        res.status(500).json({ msg: 'Internal server error' })
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
            return res.status(400).json({ msg: 'Invalid reset token!' })
        }

        // CHECK IF RESET TOKEN HAS EXPIRED
        if (resetTokenExists.expiryDate < Date.now()) {
            return res.status(401).json({ msg: 'Reset token has expired!' })
        }

        // CHECK IF NEW PASSWORD IS CORRECT
        if (!validatePassword(password)) {
            return res.status(403).json({ msg: 'Password must be atleast 8 characters long and contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character' })
        }

        // HASH NEW PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // UPDATE PASSWORD
        const updatedUser = await axios.put(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/` + resetTokenExists.userId, {
            password: hashedPassword
        })

        // RETURN UPDATED USER
        res.status(200).json({
            updatedUser: updatedUser.data
        })
    } catch (error) {
        console.error('Error resetting password', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// PASSWORD CHANGE
// PUT http://localhost:5001/auth/change-password - change password
const changePassword = async (req, res) => {

    // DESCTRUCTURE OLD PASSWORD AND NEW PASSWORD AND USER ID
    const { oldPswd, newPswd, userId } = req.body
    consolo.log(req)

    try {
        // ASK THE USER SERVICE FOR THIS USER
        const user = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/` + userId)

        // CHECK IF USER EXISTS
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist!' })
        }

        // CHECK IF OLD PASSWORD IS CORRECT
        const isMatch = await bcrypt.compare(oldPswd, user.data.password)

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid old credentials!' })
        }

        // CHECK IF NEW PASSWORD IS CORRECT
        if (!validatePassword(newPswd)) {
            return res.status(400).json({ msg: 'Password must be atleast 8 characters long and contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character' })
        }

        // HASH NEW PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPswd, salt)

        // CHECK IF NEW PASSWORD IS SAME AS OLD PASSWORD
        if (oldPswd === newPswd) {
            return res.status(400).json({ msg: 'New password cannot be same as old password!' })
        }

        // UPDATE PASSWORD
        const updatedUser = await axios.put(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/` + req.user.id, {
            password: hashedPassword
        })

        // RETURN UPDATED USER
        if (!updatedUser) {
            return res.status(400).json({ msg: 'An error occured!' })
        }

        res.status(200).json({
            updatedUser: updatedUser.data
        })
    } catch (error) {
        console.error('Error changing password', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// EXPORTS
module.exports = {
    forgotPassword,
    resetPassword,
    changePassword
}