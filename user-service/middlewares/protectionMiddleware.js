const jwt = require('jsonwebtoken')
require('dotenv').config()

// MIDDLEWARE FOR AUTHORIZATION - CHECKS IF USER IS AUTHENTICATED
const userProtection = (roles) => (req, res, next) => {

    // GET THE TOKEN FROM THE HEADER IF PRESENT
    const token = req.headers['x-auth-token']

    // IF NO TOKEN FOUND, RETURN ERROR
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: 'No token, authorizaton Denied',
            code: 'NO_TOKEN'
        })
    }

    try {
        // IF TOKEN FOUND, VERIFY IT
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // ADD USER FROM PAYLOAD
        req.user = verified

        // CHECK USER ROLE
        let authorized = false

        // CHECK THE LIST OF ALLOWED ROLES
        const allowedUser = roles.find(rol => rol === req.user.role)

        // IF USER ROLE IS ALLOWED, SET AUTHORIZED TO TRUE
        authorized = allowedUser === req.user.role

        // IF USER IS NOT AUTHORIZED, RETURN ERROR
        if (!authorized) {
            return res.status(401).json({
                success: false,
                msg: 'You are not authorized to access this resource',
                code: 'NOT_AUTHORIZED'
            })
        }

        const roleType = req.user.role === 2 ? 'ADMIN' : req.user.role === 3 ? 'AGENT' : 'NORMAL USER'
        console.log(authorized ? `${roleType} is authorized` : `${roleType} is not authorized`)

        if (authorized) {
            return next()
        }
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: 'Session expired',
            code: 'SESSION_EXPIRED'
        })
    }
}

module.exports = userProtection
