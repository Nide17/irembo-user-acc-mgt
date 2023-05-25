const Role = require('../models/Role')

// GET http://localhost:5002/roles - get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll()

        // IF NO ROLES FOUND
        if (!roles) {
            return res.json({
                status: 404,
                msg: 'No roles found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            roles
        })
    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// GET http://localhost:5002/roles/:id - get role by id
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        })

        // IF NO ROLE FOUND
        if (!role) {
            return res.json({
                status: 404,
                msg: 'Role not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            role
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// POST http://localhost:5002/roles - create new role
const createRole = async (req, res) => {
    try {
        const role = await Role.create({
            role: req.body.role
        })

        // IF ROLE NOT CREATED
        if (!role) {
            return res.json({
                status: 400,
                msg: 'Role not created'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            role
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
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
        })

        // IF ROLE NOT UPDATED
        if (!role) {
            return res.json({
                status: 400,
                msg: 'Role not updated'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            role
        })

    } catch (error) {

        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// DELETE http://localhost:5002/roles/:id - delete role by id
const deleteRole = async (req, res) => {
    try {
        const role = await Role.destroy({
            where: {
                id: req.params.id
            }
        })

        // IF ROLE NOT DELETED
        if (!role) {
            return res.json({
                status: 400,
                msg: 'Role not deleted'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            role
        })

    } catch (error) {

        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
}
