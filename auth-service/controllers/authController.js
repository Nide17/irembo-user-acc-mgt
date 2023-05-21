const bcrypt = require("bcryptjs")
const axios = require('axios')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// UTILS
const validateEmail = require('../utils/validateEmail')
const generateOTP = require('../utils/otpService')
const sendEmailWithNodemailer = require('../utils/sendEmailWithNodemailer')
const checkOTP = require('../utils/checkOTP')

// MODELS
const OTPcode = require('../models/OTPcode')

// POST http://localhost:5001/auth/login - login user
const loginUser = async (req, res) => {

    // DESTRUCTURE EMAIL AND PASSWORD
    const { email, password } = req.body

    // SIMPLE VALIDATION
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please fill all fields' })
    }

    // CHECK FOR VALIDITY OF EMAIL
    if (!validateEmail(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email' })
    }

    // TRYING TO GET USER
    try {
        // ASK THE USER SERVICE FOR THIS USER
        const response = await axios.get(`${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/email/` + email)

        // IF USER NOT FOUND, RETURN ERROR
        if (!response.data) {
            res.status(404).json({ msg: 'User not found!' })
        }

        // GET USER FROM RESPONSE
        const user = response.data

        // CHECK IF USER EXISTS
        if (!user) {
            res.status(400).json({ msg: 'User does not exist!' })
        }

        else {
            // CHECK IF PASSWORD IS CORRECT
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                res.status(400).json({ msg: 'Invalid credentials!' })
            }

            // IF ALL IS GOOD, SIGN AND GENERATE TOKEN
            const token = jwt.sign(
                {
                    id: user.id,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            )

            if (!token) {
                res.status(400).json({ msg: 'Couldnt sign in, try again!' })
            }

            // RETURN TOKEN AND USER
            res.status(200).json({
                token,
                user: user
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// VERIFY TOKEN
// POST http://localhost:5001/auth/verify-token - verify token
const verifyToken = async (req, res) => {

    // GET THE TOKEN FROM THE REQUEST BODY IF PRESENT
    const token = req.headers['x-auth-token']

    // IF NO TOKEN FOUND, RETURN ERROR
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token, authorizaton Denied',
            code: 'NO_TOKEN'
        })
    }

    try {
        // IF TOKEN FOUND, VERIFY IT
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // ADD USER FROM PAYLOAD
        req.user = verified

        // RETURN SUCCESS
        return res.status(200).json({
            success: true,
            message: 'Token verified',
            code: 'TOKEN_VERIFIED'
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token, authorizaton Denied',
            code: 'INVALID_TOKEN'
        })
    }
}

// LOGOUT - logout user
const logoutUser = async (req, res) => {

    // IMPLEMENT LOGOUT
    res.status(200).json({ msg: 'Logged out successfully!' })
}


// EXPORTS
module.exports = {
    loginUser,
    logoutUser,
    verifyToken
}
