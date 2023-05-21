const express = require('express')
const router = express.Router()

// CONTROLLERS
const authController = require('../controllers/authController')
const twoFaController = require('../controllers/twoFaController')
const loginLinkController = require('../controllers/loginLinkController')
const passwordController = require('../controllers/passwordController')

// MIDDLEWARES
const protectionMiddleware = require('../middlewares/protectionMiddleware')

// ROUTES
// Public route
// POST http://localhost:5001/auth/login - login user
router.post('/login', authController.loginUser)

// Private route
// POST http://localhost:5001/auth/change-password - change password
router.post('/change-password', protectionMiddleware, passwordController.changePassword)

// Public route
// POST http://localhost:5001/auth/forgot-password - forgot password
router.post('/forgot-password', passwordController.forgotPassword)

// Public route
// POST http://localhost:5001/auth/reset-password - reset password
router.post('/reset-password', passwordController.resetPassword)

// Public route
// POST http://localhost:5001/auth/login-link - login link
router.post('/login-link', loginLinkController.loginLink)

// Public route
// POST http://localhost:5001/auth/verify-link/:token - verify link
router.post('/verify-link/:token', loginLinkController.verifyLink)

// Private route
// POST http://localhost:5001/auth/two-fa - 2fa
router.post('/two-fa', twoFaController.twoFactorAuth)

// Private route
// POST http://localhost:5001/auth/verify-two-fa - verify 2fa
router.post('/verify-two-fa', protectionMiddleware, twoFaController.verifyTwoFactorAuth)

// Private route
// POST http://localhost:5001/auth/verify-token
router.post('/verify-token', protectionMiddleware, authController.verifyToken)

module.exports = router
