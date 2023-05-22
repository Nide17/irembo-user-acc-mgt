const bcrypt = require("bcryptjs")
const axios = require('axios')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
require('dotenv').config()

// UTILS
const sendEmailWithNodemailer = require('../utils/sendEmailWithNodemailer')
const validateEmail = require('../utils/validateEmail')

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
        const user = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/email/${email}`, {}, { headers: req.headers })

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
        const twoFactorToken = crypto.randomBytes(20).toString('hex')

        // HASH 2FA TOKEN
        const hashedTwoFactorToken = crypto.createHash('sha256').update(twoFactorToken).digest('hex')

        // SET 2FA TOKEN EXPIRY TO 5 MINUTES
        const expiryDate = Date.now() + 5 * 60 * 1000

        // SAVE 2FA TOKEN AND EXPIRY IN DATABASE
        const saveTwoFactorToken = await TwoFactor.create({
            token: hashedTwoFactorToken,
            expiration: expiryDate,
            userId: user.data.id,
            used: false
        })

        // CHECK IF 2FA TOKEN SAVED
        if (!saveTwoFactorToken) {
            console.error('Error saving 2fa token')
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
        res.status(200).json({
            msg: `Email sent successfully!`
        })

    } catch (error) {
        console.error('Error 2fa', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// VERIFY 2FA
// POST http://localhost:5001/verify-2fa - verify 2fa
const verifyTwoFactorAuth = async (req, res) => {

    // DESTRUCTURE EMAIL AND PASSWORD
    const { email, password, twoFactorToken } = req.body

    // CHECK FOR VALIDITY OF EMAIL
    if (!validateEmail(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email' })
    }

    try {
        // ASK THE USER SERVICE FOR THIS USER
        const user = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/email/${email}`, {}, { headers: req.headers })

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

        // DECRYPT 2FA TOKEN
        const twoFactorTokenDecrypted = crypto.createHash('sha256').update(twoFactorToken).digest('hex')

        // CHECK IF TOKEN EXISTS
        const tokenExists = await TwoFactor.findOne({
            where: {
                token: twoFactorTokenDecrypted
            }
        })

        // CHECK IF TOKEN EXISTS
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
        const updateToken = await TwoFactor.update({
            used: true
        }, {
            where: {
                token: twoFactorTokenDecrypted
            }
        })

        // CHECK IF TOKEN UPDATED
        if (!updateToken) {
            console.error('Error updating token')
        }

        // GENERATE JWT TOKEN
        const jwtToken = jwt.sign({
            id: user.data.id,
            email: user.data.email
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        // RETURN JWT TOKEN
        res.status(200).json({
            token: jwtToken,
            user: user.data,
            msg: `Login successful!`
        })

    } catch (error) {
        console.error('Error verifying 2fa', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// EXPORTS
module.exports = {
    twoFactorAuth,
    verifyTwoFactorAuth
}