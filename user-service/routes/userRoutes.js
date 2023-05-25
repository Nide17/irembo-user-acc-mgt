const express = require('express')
const userController = require('../controllers/userController')
const protectionMiddleware = require('../middlewares/protectionMiddleware')
const router = express.Router()
require('dotenv').config()

// Private route
// GET http://localhost:5002/users/ - get all users
router.get('/', protectionMiddleware([2]), userController.getAllUsers)

// Private route
// GET http://localhost:5002/users/:id - get user by id
router.get('/:id', protectionMiddleware([2]), userController.getUserById)

// Pubic route
// GET http://localhost:5002/users/link/:id - get user by link and id
router.get('/link/:id', userController.getUserByLinkId)

// Public route
// GET http://localhost:5002/users/email/:email - get user by email
router.get('/email/:email', userController.getUserByEmail)

// Public route
// POST http://localhost:5002/users/ - create new user
router.post('/', userController.createUser)

// Private route
// PUT http://localhost:5002/users/:id - update user by id
router.put('/:id', protectionMiddleware([1, 2, 3]), userController.updateUser)

// Private route
// DELETE http://localhost:5002/users/:id - delete user by id
router.delete('/:id', protectionMiddleware([2]), userController.deleteUser)

module.exports = router
