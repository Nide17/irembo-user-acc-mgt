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

// 2FA
// POST http://localhost:5001/2fa - 2fa
const twoFactorAuth = async (req, res) => {

    // DESTRUCTURE EMAIL AND PASSWORD
    const { email, password } = req.body

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
                msg: userResponse.data.msg
            })
        }

        const user = userResponse.data.user

        // CHECK IF PASSWORD IS CORRECT
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        // CHECK IF PASSWORD IS CORRECT
        if (!isPasswordCorrect) {
            return res.json({
                status: 400,
                msg: 'Password is incorrect!'
            })
        }

        // GENERATE 2FA TOKEN
        const twoFactorToken = generateOTP()

        // SAVE 2FA TOKEN AND EXPIRY IN DATABASE
        const savedOTPcode = await OTPcode.create({
            otpCode: twoFactorToken,
            expiresAt: Date.now() + 5 * 60 * 1000,
            userId: user.id,
            used: false
        })

        // CHECK IF 2FA TOKEN SAVED
        if (!savedOTPcode) {
            return res.json({
                status: 500,
                msg: 'Error saving 2fa token'
            })
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
        const sendMail = await sendEmailWithNodemailer.sendEmailWithNodemailer(req, res, emailData)

        // CHECK IF EMAIL SENT
        if (!sendMail) {
            return res.json({
                status: 500,
                msg: 'Error sending email'
            })
        }

        // RETURN EMAIL SENT SUCCESSFULLY
        return res.json({
            status: 200,
            msg: `OTP sent to ${email}`
        })

    } catch (error) {
        return res.json({

            status: 500,
            msg: 'Internal server error while sending 2FA email',
            error
        })
    }
}

// VERIFY 2FA
// POST http://localhost:5001/verify-two-fa - verify 2fa
const verifyTwoFactorAuth = async (req, res) => {

    // DESTRUCTURE EMAIL AND PASSWORD
    const { email, password, userId, twoFactorToken } = req.body

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

        // GET USER FROM RESPONSE
        const user = userResponse.data.user

        // CHECK IF PASSWORD IS CORRECT
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        // CHECK IF PASSWORD IS CORRECT
        if (!isPasswordCorrect) {
            return res.json({
                status: 400,
                msg: 'Password is incorrect!'
            })
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
            return res.json({
                status: 400,
                msg: 'Invalid token!'
            })
        }

        // CHECK IF TOKEN HAS EXPIRED
        if (tokenExists.expiration < Date.now()) {
            return res.json({
                status: 400,
                msg: 'Token has expired!'
            })
        }

        // CHECK IF TOKEN HAS BEEN USED
        if (tokenExists.used) {
            return res.json({
                status: 400,
                msg: 'Token has been used!'
            })
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
            return res.json({
                status: 500,
                msg: 'Error updating token!'
            })
        }

        console.log(user)

        // IF ALL IS GOOD, SIGN AND GENERATE TOKEN
        const token = jwt.sign({ 
            id: user.id, 
            email: user.email,
            role: user.roleId            
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

        if (!token) {
            return res.json({
                status: 400,
                msg: 'Couldnt sign in, try again!'
            })
        }

        // RETURN TOKEN AND USER
        return res.json({
            status: 200,
            token,
            user
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
    twoFactorAuth,
    verifyTwoFactorAuth
}