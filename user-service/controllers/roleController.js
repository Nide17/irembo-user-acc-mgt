const Role = require('../models/Role');

// GET http://localhost:5001/roles - get all roles
const getAllRoles = async (req, res) => {
    console.log('Fetching all roles...');
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET http://localhost:5001/roles/:id - get role by id
const getRoleById = async (req, res) => {
    console.log('Fetching role by id...');
    try {
        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(role);
    } catch (error) {
        console.error('Error fetching role by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// POST http://localhost:5001/roles - create new role
const createRole = async (req, res) => {
    console.log('Creating new role...');
    try {
        const role = await Role.create({
            role: req.body.role
        });
        res.json(role);
    } catch (error) {
        console.error('Error creating new role', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// PUT http://localhost:5001/roles/:id - update role by id
const updateRole = async (req, res) => {
    console.log('Updating role by id...');
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
        console.error('Error updating role by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// DELETE http://localhost:5001/roles/:id - delete role by id
const deleteRole = async (req, res) => {
    console.log('Deleting role by id...');
    try {
        const role = await Role.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json(role);
    } catch (error) {
        console.error('Error deleting role by id', error);
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
