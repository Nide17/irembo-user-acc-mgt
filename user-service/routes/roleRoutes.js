const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Public route - get all roles
// GET http://localhost:5001/roles
router.get('/', roleController.getAllRoles);

// Public route - get role by id
// GET http://localhost:5001/roles/:id
router.get('/:id', roleController.getRoleById);

// Public route - create new role
// POST http://localhost:5001/roles
router.post('/', roleController.createRole);

// Public route - update role by id
// PUT http://localhost:5001/roles/:id
router.put('/:id', roleController.updateRole);

// Public route - delete role by id
// DELETE http://localhost:5001/roles/:id
router.delete('/:id', roleController.deleteRole);

module.exports = router;
