const express = require('express')
const router = express.Router()

// CONTROLLERS
const authController = require('../controllers/authController')
const twoFaController = require('../controllers/twoFaController')
const loginLinkController = require('../controllers/loginLinkController')
const passwordController = require('../controllers/passwordController')

// MIDDLEWARES
const authMiddleware = require('../middlewares/authMiddleware')

// ROUTES
// Public route
// POST http://localhost:5002/auth/login - login user
router.post('/login', authController.loginUser)

// Public route
// POST http://localhost:5002/auth/logout - logout user
router.post('/logout', authController.logoutUser)

// Private route
// POST http://localhost:5002/auth/change-password - change password
router.post('/change-password', authMiddleware, passwordController.changePassword)

// Public route
// POST http://localhost:5002/auth/forgot-password - forgot password
router.post('/forgot-password', passwordController.forgotPassword)

// Public route
// POST http://localhost:5002/auth/reset-password - reset password
router.post('/reset-password', passwordController.resetPassword)

// Public route
// POST http://localhost:5002/auth/login-link - login link
router.post('/login-link', loginLinkController.loginLink)

// Public route
// POST http://localhost:5002/auth/verify-link/:token - verify link
router.post('/verify-link/:token', loginLinkController.verifyLink)

// Public route
// POST http://localhost:5002/auth/two-fa - 2fa
router.post('/two-fa', twoFaController.twoFactorAuth)

// Private route
// POST http://localhost:5002/auth/verify-two-fa - verify 2fa
router.post('/verify-two-fa', twoFaController.verifyTwoFactorAuth)

// Private route
// POST http://localhost:5002/auth/verify-token
router.post('/verify-token', authMiddleware, authController.verifyToken)

module.exports = router
