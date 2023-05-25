const express = require('express')
const router = express.Router()
const roleController = require('../controllers/roleController')
const userProtection = require('../middlewares/userProtection')

// Public route - get all roles
// GET http://localhost:5002/roles
router.get('/', userProtection([2]), roleController.getAllRoles)

// Public route - get role by id
// GET http://localhost:5002/roles/:id
router.get('/:id', userProtection([1, 2, 3]), roleController.getRoleById)

// Public route - create new role
// POST http://localhost:5002/roles
router.post('/', userProtection([2]), roleController.createRole)

// Public route - update role by id
// PUT http://localhost:5002/roles/:id
router.put('/:id', userProtection([2]), roleController.updateRole)

// Public route - delete role by id
// DELETE http://localhost:5002/roles/:id
router.delete('/:id', userProtection([2]), roleController.deleteRole)

module.exports = router