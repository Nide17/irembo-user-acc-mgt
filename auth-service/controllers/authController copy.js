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

        // GET USER FROM RESPONSE
        const user = response.data

        // CHECK IF USER EXISTS
        if (!user) {
            console.log('User does not exist!')
            return res.status(400).json({ msg: 'User does not exist!' })
        }

        // else if (user.data.twoFactorAuth) {
        //     console.log('User has 2FA enabled!')
        //     return res.status(400).json({ msg: 'User has 2FA enabled!' })
        // }

        else {
            // CHECK IF PASSWORD IS CORRECT
            const isMatch = await bcrypt.compare(password, user.data.password)

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials!' })
            }

            // GENERATE AND SEND OTP CODE
            const otpCode = generateOTP()

            // SEND OTP CODE TO USER EMAIL
            const emailData = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'OTP Code',
                text: `Your OTP code is ${otpCode}`
            }

            // SEND EMAIL
            await sendEmailWithNodemailer.sendEmailWithNodemailer(req, res, emailData)

            // SAVE OTP CODE IN DATABASE WITH EXPIRY
            const saveOTPcode = await OTPcode.create({
                otpCode: otpCode,
                createsAt: Date.now(),
                expiresAt: Date.now() + 5 * 60 * 1000,
                userId: user.data.id,
                used: false
            })

            // CHECK IF OTP CODE SAVED
            if (!saveOTPcode) {
                return res.status(400).json({ msg: 'Couldnt save OTP code, try again!' })
            }
            // VALIDATE OTP CODE IF USER HAS BEEN ALLOWED TO 2FA
            if (user && user.data && user.data.twoFactorAuth) { // VALIDATE AGAINST SETTINGS NOT USER
                const validateOTPcode = await checkOTP(saveOTPcode)

                // CHECK IF OTP CODE VALIDATED
                if (!validateOTPcode) {
                    return res.status(400).json({ msg: 'Couldnt validate OTP code, try again!' })
                }
            }

        // else if (user.data.twoFactorAuth) {
        //     console.log('User has 2FA enabled!')
                    // // GENERATE AND SEND OTP CODE
            // const otpCode = generateOTP()

            // // SAVE OTP CODE IN DB
            // const otp = new OTPcode({
            //     email: email,
            //     otpCode: otpCode
            // })

            // // SAVE OTP CODE IN DB
            // await otp.save()

            // // SEND OTP CODE TO USER
            // sendEmailWithNodemailer(email, otpCode)

            // // RETURN SUCCESS
            // return res.status(200).json({
            //     success: true,
            //     message: 'OTP code sent',
            //     code: 'OTP_SENT'
            // })
            
        //     return res.status(400).json({ msg: 'User has 2FA enabled!' })
            // // CREATE PAYLOAD
            // const payload = {
            //     id: user._id,
            //     name: user.firstName + ' ' + user.lastName,
            //     email: user.email,
            //     role: user.role
            // }
        // }
                        // // SIGN TOKEN
            // jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 }, (err, token) => {
            //     if (err) {
            //         throw err
            //     }

            //     // RETURN SUCCESS
            //     return res.status(200).json({
            //         success: true,
            //         message: 'User logged in successfully',
            //         token: token,
            //         code: 'USER_LOGGED_IN'
            //     })
            // }
            // )

            // IF ALL IS GOOD, SIGN AND GENERATE TOKEN
            const token = jwt.sign(
                {
                    id: user.data.id,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            )

            if (!token) {
                return res.status(400).json({ msg: 'Couldnt sign in, try again!' })
            }

            // RETURN TOKEN AND USER
            res.status(200).json({
                token,
                user: user.data
            })
        }
    }
    catch (error) {
        console.log('User not found!')
        return res.status(404).json({ msg: 'User not found' })
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
