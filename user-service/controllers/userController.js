const bcrypt = require("bcryptjs")

// MODELS
const User = require('../models/User')

// UTILS
const validateEmail = require('../utils/validateEmail')
const validatePassword = require('../utils/validatePassword')

// GET http://localhost:5001/ - get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// GET http://localhost:5001/users/:id - get user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// POST http://localhost:5001/ - create new user
const createUser = async (req, res) => {

    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { email, password, roleId } = req.body

    // VALIDATE USER DATA
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    // VALIDATE USER EMAIL
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' })
    }

    // VALIDATE USER PASSWORD
    if (!validatePassword(password)) {
        return res.status(400).json({
            error: 'Password should be greater than 7 and having special characters, number, and uppercase and lowercase letters'
        })
    }

    // CREATE NEW USER
    try {
        // CHECK IF USER ALREADY EXISTS
        const userExists = await User.findOne({
            where: {
                email
            }
        })

        if (userExists) {
            return res.status(400).json({ error: 'User with that email already exists' })
        }

        // HASH THE PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // CREATE NEW USER
        const user = await User.create({
            email,
            password: hashedPassword,
            roleId: roleId || 1, // DEFAULT ROLE ID IS 1
            createdAt: new Date(),
            updatedAt: new Date()
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// PUT http://localhost:5001/users/:id - update user by id
const updateUser = async (req, res) => {

    const { password } = req.body

    // UPDATE USER
    try {
        // CHECK IF USER ALREADY EXISTS
        const userExists = await User.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ error: 'User with that id does not exist' })
        }

        const user = await User.update({
            password,
            updatedAt: new Date()
        }, {
            where: {
                id: req.params.id
            }
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// DELETE http://localhost:5001/:id - delete user by id
const deleteUser = async (req, res) => {
    try {
        const userid = await User.findByPk(req.params.id)

        if (!userid) {
            res.status(404).json({ error: 'User not found' })
        }
        else {
            const user = await User.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.json(user)
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// GET http://localhost:5001/:email - get user by email
const getUserByEmail = async (req, res) => {
    try {
        // CHECK IF USER EXISTS
        const user = await User.findOne({
            where: {
                email: req.params.email
            }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(user)

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

// EXPORTS
module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
}
