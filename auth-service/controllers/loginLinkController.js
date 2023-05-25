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
        return res.json({
            status: 400,
            msg: 'Please enter a valid email'
        })
    }

    try {
        // ASK THE USER SERVICE FOR THIS USER
        const userResponse = await axios.get(`${process.env.USER_SERVICE}/users/email/${email}`, {})

        // CHECK IF USER EXISTS
        if (userResponse.data.status !== 200) {
            return res.json({
                status: 400,
                msg: 'User does not exist!'
            })
        }

        // GET USER FROM RESPONSE
        const user = userResponse && userResponse.data.user

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
            return res.json({
                status: 400,
                msg: 'Error saving login token!'
            })
        }

        // SEND EMAIL
        const emailData = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Login Link',
            html: `
                <h1>Login Link</h1>
                <p>Click on the link below to login</p>
                <a href="${process.env.CLIENT_SERVICE}/auth/link/${loginToken}">Login Link</a>
                \nIf you didn't request a login link, please ignore this email!`
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

        // RETURN EMAIL SENT
        return res.json({
            status: 200,
            msg: 'Email sent!'
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
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
        const updateToken = await LoginLink.update({
            used: true
        }, {
            where: {
                token: tokenDecrypted
            }
        })

        // CHECK IF TOKEN UPDATED
        if (!updateToken) {
            return res.json({
                status: 400,
                msg: 'Error updating token!'
            })
        }

        // ASK THE USER SERVICE FOR THIS USER
        const userResponse = await axios.get(`${process.env.USER_SERVICE}/users/link/${tokenExists.userId}`)

        // CHECK IF USER EXISTS
        if (userResponse.data.status !== 200) {
            return res.json({
                status: 400,
                msg: 'User does not exist!'
            })
        }

        // GET USER FROM RESPONSE
        const user = userResponse.data.user
        console.log(user)

        // GENERATE JWT TOKEN
        const jwtToken = jwt.sign({
            id: user.data.id,
            email: user.data.email,
            role: user.data.roleId
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })

        // RETURN JWT TOKEN
        return res.json({
            status: 200,
            token: jwtToken,
            user: user.data,
            msg: `Login successful!`
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
module.exports = { loginLink, verifyLink }