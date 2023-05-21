const Role = require('../models/Role');

// GET http://localhost:5002/roles - get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET http://localhost:5002/roles/:id - get role by id
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// POST http://localhost:5002/roles - create new role
const createRole = async (req, res) => {
    try {
        const role = await Role.create({
            role: req.body.role
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// PUT http://localhost:5002/roles/:id - update role by id
const updateRole = async (req, res) => {
    try {
        const role = await Role.update({
            name: req.body.name
        }, {
            where: {
                id: req.params.id
            }
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// DELETE http://localhost:5002/roles/:id - delete role by id
const deleteRole = async (req, res) => {
    try {
        const role = await Role.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
