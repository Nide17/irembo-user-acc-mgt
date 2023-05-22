const axios = require('axios')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
require('dotenv').config()

// UTILS
const sendEmailWithNodemailer = require('../utils/sendEmailWithNodemailer')
const validateEmail = require('../utils/validateEmail')

// MODELS
const LoginLink = require('../models/LoginLink')

// LOGIN LINK
// POST http://localhost:5001/auth/login-link - login link
const loginLink = async (req, res) => {

    // DESTRUCTURE EMAIL
    const { email } = req.body

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

        // GENERATE LOGIN TOKEN
        const loginToken = crypto.randomBytes(20).toString('hex')

        // HASH LOGIN TOKEN
        const hashedLoginToken = crypto.createHash('sha256').update(loginToken).digest('hex')

        // SET LOGIN TOKEN EXPIRY TO 5 MINUTES
        const expiryDate = Date.now() + 5 * 60 * 1000

        // SAVE LOGIN TOKEN AND EXPIRY IN DATABASE
        const saveLoginToken = await LoginLink.create({
            token: hashedLoginToken,
            expiration: expiryDate,
            userId: user.data.id,
            used: false
        })

        // CHECK IF LOGIN TOKEN SAVED
        if (!saveLoginToken) {
            console.error('Error saving login token')
        }

        // SEND EMAIL
        const emailData = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Login Link',
            html: `
                <h1>Login Link</h1>
                <p>Click on the link below to login</p>
                <a href="${process.env.APP_HOST}:${process.env.CLIENT_SERVICE_PORT}/auth/link/${loginToken}">Login Link</a>
                \nIf you didn't request a login link, please ignore this email!`
        }

        // SEND EMAIL
        await sendEmailWithNodemailer.sendEmailWithNodemailer(req, res, emailData)

        // RETURN EMAIL SENT SUCCESSFULLY
        res.status(200).json({
            msg: `Email sent successfully!`
        })

    } catch (error) {
        console.error('Error login link', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// VERIFY LINK
// POST http://localhost:5001/auth/verify-link/:token - verify link
const verifyLink = async (req, res) => {
    // DESTRUCTURE TOKEN
    const { token } = req.params

    // DECRYPT TOKEN
    const tokenDecrypted = crypto.createHash('sha256').update(token).digest('hex')

    try {
        // CHECK IF TOKEN EXISTS
        const tokenExists = await LoginLink.findOne({
            where: {
                token: tokenDecrypted
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
        const updateToken = await LoginLink.update({
            used: true
        }, {
            where: {
                token: tokenDecrypted
            }
        })

        // CHECK IF TOKEN UPDATED
        if (!updateToken) {
            console.error('Error updating token')
        }

        // ASK THE USER SERVICE FOR THIS USER
        const user = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/${tokenExists.userId}`, {}, {headers: req.headers})

        // CHECK IF USER EXISTS
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist!' })
        }

        // GENERATE JWT TOKEN
        const jwtToken = jwt.sign({
            id: user.data.id,
            email: user.data.email
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })

        // RETURN JWT TOKEN
        res.status(200).json({
            token: jwtToken,
            user: user.data,
            msg: `Login successful!`
        })

    } catch (error) {
        console.error('Error verifying link', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// EXPORTS
module.exports = { loginLink, verifyLink }