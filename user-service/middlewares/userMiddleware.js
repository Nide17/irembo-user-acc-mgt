const jwt = require('jsonwebtoken')
require('dotenv').config()

// MIDDLEWARE FOR AUTHORIZATION - CHECKS IF USER IS AUTHENTICATED
const userMiddleware = (req, res, next) => {

    // GET THE TOKEN FROM THE HEADER IF PRESENT
    const token = req.headers['x-auth-token']
    
    // IF NO TOKEN FOUND, RETURN ERROR
    if (!token) {
        console.log('\nNo token found...\n')
        return res.status(401).json({
            success: false,
            message: 'No token, authorizaton Denied',
            code: 'NO_TOKEN'
        })
    }

    try {
        // IF TOKEN FOUND, VERIFY IT
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log('\nToken verified...\n')
        console.log(verified)

        // ADD USER FROM PAYLOAD
        req.user = verified

        // MOVE TO NEXT MIDDLEWARE IF TOKEN IS VALID
        next()
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Session expired',
            code: 'SESSION_EXPIRED'
        })
    }
};

module.exports = userMiddleware;
