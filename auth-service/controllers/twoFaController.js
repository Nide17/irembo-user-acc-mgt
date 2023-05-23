const bcrypt = require("bcryptjs")
const axios = require('axios')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// MODELS
const OTPcode = require('../models/OTPcode')

// UTILS
const sendEmailWithNodemailer = require('../utils/sendEmailWithNodemailer')
const validateEmail = require('../utils/validateEmail')
const generateOTP = require('../utils/otpService')
const checkOTP = require('../utils/checkOTP')

// 2FA
// POST http://localhost:5001/2fa - 2fa
const twoFactorAuth = async (req, res) => {

    // DESTRUCTURE EMAIL AND PASSWORD
    const { email, password } = req.body

    // CHECK FOR VALIDITY OF EMAIL
    if (!validateEmail(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email' })
    }

    try {
        // ASK THE USER SERVICE FOR THIS USER
        const user = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/email/${email}`)

        // CHECK IF USER EXISTS
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist!' })
        }

        // CHECK IF PASSWORD IS CORRECT
        const isPasswordCorrect = await bcrypt.compare(password, user.data.password)

        // CHECK IF PASSWORD IS CORRECT
        if (!isPasswordCorrect) {
            return res.status(400).json({ msg: 'Password is incorrect!' })
        }

        // GENERATE 2FA TOKEN
        const twoFactorToken = generateOTP()
        
        // SAVE 2FA TOKEN AND EXPIRY IN DATABASE
        const savedOTPcode = await OTPcode.create({
            otpCode: twoFactorToken,
            expiresAt: Date.now() + 5 * 60 * 1000,
            userId: user.data.id,
            used: false
        })

        // CHECK IF 2FA TOKEN SAVED
        if (!savedOTPcode) {
            return res.status(500).json({ msg: 'Error saving 2fa token' })
        }

        // SEND EMAIL
        const emailData = {
            from: process.env.SMTP_USER,
            to: email,
            subject: '2FA Token',
            html: `
                <h1>2FA Token</h1>
                <p>Enter the token below to login</p>
                <p>${twoFactorToken}</p>
                \nIf you didn't request a 2fa token, please ignore this email!`
        }

        // SEND EMAIL
        await sendEmailWithNodemailer.sendEmailWithNodemailer(req, res, emailData)

        // RETURN EMAIL SENT SUCCESSFULLY
        res.status(200).json({ msg: `OTP sent successfully!` })

    } catch (error) {
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

// VERIFY 2FA
// POST http://localhost:5001/verify-two-fa - verify 2fa
const verifyTwoFactorAuth = async (req, res) => {

    // DESTRUCTURE EMAIL AND PASSWORD
    const { email, password, userId, twoFactorToken } = req.body

    // CHECK FOR VALIDITY OF EMAIL
    if (!validateEmail(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email' })
    }

    try {
        // ASK THE USER SERVICE FOR THIS USER
        const user = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/email/${email}`)

        // CHECK IF USER EXISTS
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist!' })
        }

        // CHECK IF PASSWORD IS CORRECT
        const isPasswordCorrect = await bcrypt.compare(password, user.data.password)

        // CHECK IF PASSWORD IS CORRECT
        if (!isPasswordCorrect) {
            return res.status(400).json({ msg: 'Password is incorrect!' })
        }

        // CHECK IF TOKEN EXISTS
        const tokenExists = await OTPcode.findOne({
            where: {
                otpCode: twoFactorToken,
                userId
            }
        })

        // IF TOKEN DOES NOT EXIST
        if (!tokenExists) {
            return res.status(400).json({ msg: 'Invalid token!' })
        }

        // CHECK IF TOKEN HAS EXPIRED
        if (tokenExists.expiration < Date.now()) {
            return res.status(400).json({ msg: 'Token has expired!' })
        }

        // CHECK IF TOKEN HAS BEEN USED
        if (tokenExists.used) {
            return res.status(400).json({ msg: 'Token has been used!' })
        }

        // UPDATE TOKEN TO USED
        const updateToken = await OTPcode.update({
            used: true
        }, {
            where: {
                otpCode: twoFactorToken
            }
        })

        // CHECK IF TOKEN UPDATED
        if (!updateToken) {
            return res.status(500).json({ msg: 'Error updating token!' })
        }

        // IF ALL IS GOOD, SIGN AND GENERATE TOKEN
        const token = jwt.sign({ id: user.data.id, email: user.data.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

        if (!token) {
            return res.status(400).json({ msg: 'Couldnt sign in, try again!' })
        }

        // RETURN TOKEN AND USER
        return res.status(200).json({ token, user: user.data })

    } catch (error) {
        res.status(500).json({ msg: 'Internal server error', error })
    }
}

// EXPORTS
module.exports = {
    twoFactorAuth,
    verifyTwoFactorAuth
}