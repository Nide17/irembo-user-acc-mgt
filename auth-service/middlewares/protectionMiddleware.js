const jwt = require('jsonwebtoken')
require('dotenv').config()

// MIDDLEWARE FOR AUTHORIZATION - CHECKS IF USER IS AUTHENTICATED
const protectionMiddleware = (req, res, next) => {

    // GET THE TOKEN FROM THE HEADER IF PRESENT
    const token = req.headers['x-auth-token']

    // IF NO TOKEN FOUND, RETURN ERROR
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: 'No token, authorizaton Denied',
            code: 'NO_TOKEN',
        })
    }

    try {
        // IF TOKEN FOUND, VERIFY IT
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // IF TOKEN IS NOT VERIFIED, RETURN ERROR
        if (!verified) {
            return res.status(401).json({
                success: false,
                msg: 'Token verification failed, authorization denied',
                code: 'TOKEN_VERIFICATION_FAILED'
            })
        }

        // ADD USER FROM PAYLOAD
        req.user = verified

        // MOVE TO NEXT MIDDLEWARE IF TOKEN IS VALID
        next()
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: 'Session expired',
            code: 'SESSION_EXPIRED',
            error: error
        })
    }
};

module.exports = protectionMiddleware;
