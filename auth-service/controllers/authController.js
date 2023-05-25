const bcrypt = require("bcryptjs")
const axios = require('axios')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// UTILS
const validateEmail = require('../utils/validateEmail')

// POST http://localhost:5001/auth/login - login user
const loginUser = async (req, res) => {

    // DESTRUCTURE EMAIL AND PASSWORD
    const { email, password } = req.body

    // SIMPLE VALIDATION
    if (!email || !password) {
        return res.json({
            status: 400,
            msg: 'Please fill all fields'
        })
    }

    // CHECK FOR VALIDITY OF EMAIL
    if (!validateEmail(email)) {
        return res.json({
            status: 400,
            msg: 'Please enter a valid email'
        })
    }

    // TRYING TO GET USER
    try {
        // ASK THE USER SERVICE FOR THIS USER
        const userResponse = await axios.get(`${process.env.USER_SERVICE}/users/email/${email}`)

        // IF USER NOT FOUND, RETURN ERROR
        if (userResponse.data.status !== 200) {
            return res.json({
                status: 404,
                msg: 'User not found!'
            })
        }

        // GET USER FROM RESPONSE
        const user = userResponse && userResponse.data.user

        // CHECK IF USER EXISTS
        if (!user) {
            return res.json({
                status: 404,
                msg: 'User does not exist!'
            })
        }

        else {
            // CHECK IF PASSWORD IS CORRECT
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.json({
                    status: 400,
                    msg: 'Invalid credentials!'
                })
            }

            console.log(user)

            // IF ALL IS GOOD, SIGN AND GENERATE TOKEN
            const token = jwt.sign({
                id: user.id,
                email,
                role: user.roleId
            }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

            // IF TOKEN NOT GENERATED, RETURN ERROR
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
        }

    } catch (error) {

        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// VERIFY TOKEN
// POST http://localhost:5001/auth/verify-token - verify token
const verifyToken = async (req, res) => {

    // GET THE TOKEN FROM THE REQUEST BODY IF PRESENT
    const token = req.headers['x-auth-token']

    // IF NO TOKEN FOUND, RETURN ERROR
    if (!token) {
        return res.json({
            status: 401,
            success: false,
            msg: 'No token, authorizaton Denied',
            code: 'NO_TOKEN'
        })
    }

    try {
        // IF TOKEN FOUND, VERIFY IT
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // IF TOKEN IS NOT VERIFIED, RETURN ERROR
        if (!verified) {
            return res.json({
                status: 401,
                success: false,
                msg: 'Token verification failed, authorization denied',
                code: 'TOKEN_VERIFICATION_FAILED'
            })
        }

        else {
            // ADD USER FROM PAYLOAD
            req.user = verified

            // RETURN SUCCESS
            res.json({
                status: 200,
                success: true,
                msg: 'Token verified',
                code: 'TOKEN_VERIFIED',
                user: req.user
            })
        }
    } catch (error) {
        return res.json({
            status: 500,
            success: false,
            msg: 'Invalid token, authorizaton Denied',
            code: 'INVALID_TOKEN',
            error
        })
    }
}
// EXPORTS
module.exports = {
    loginUser,
    verifyToken
}