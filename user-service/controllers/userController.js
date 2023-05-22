const bcrypt = require("bcryptjs")

// MODELS
const User = require('../models/User')
const UserProfile = require('../models/UserProfile')

// UTILS
const validateEmail = require('../utils/validateEmail')
const validatePassword = require('../utils/validatePassword')

// GET http://localhost:5002/users/ - get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// GET http://localhost:5002/users/:id - get user by id
const getUserById = async (req, res) => {
    console.log('\n\nUpdating password:\n\n', `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}/users/${req.params.id}`)
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!user) {
            res.status(404).json({ msg: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// POST http://localhost:5002/users - create new user
const createUser = async (req, res) => {

    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { email, password, roleId } = req.body

    // VALIDATE USER DATA
    if (!email || !password) {
        res.status(400).json({ msg: 'All fields are required' })
        return
    }

    // VALIDATE USER EMAIL
    if (!validateEmail(email)) {
        res.status(400).json({ msg: 'Invalid email' })
        return
    }

    // VALIDATE USER PASSWORD
    if (!validatePassword(password)) {
        res.status(400).json({
            msg: 'Password should be greater than 7 and having special characters, number, and uppercase and lowercase letters'
        })
        return
    }

    // CREATE NEW USER
    try {
        // CHECK IF USER ALREADY EXISTS
        const userExists = await User.findOne({ where: { email } })

        if (userExists) {
            console.log('\n\nUser already exists\n\n', userExists)
            res.status(400).json({ msg: 'User with that email already exists' })
            return
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

        // IF USER IS CREATED SUCCESSFULLY, CREATE USER PROFILE
        if (user) {
            const userProfile = await UserProfile.create({
                userId: user.id,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            // IF PROFILE IS NOT CREATED, DELETE THE USER AND RETURN ERROR msg
            if (!userProfile) {
               const profil = await User.destroy({
                    where: {
                        id: user.id
                    }
                })

                if(!profil) {
                    console.log('\n\nFailed to delete user\n\n', user)
                    res.status(500).json({ msg: 'Failed!' })
                }
            }
        }

        // RETURN THE USER, ALL IS WELL
        res.status(200).json(user)

    } catch (error) {
        console.log('\n\nError creating user\n\n', error)
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// PUT http://localhost:5002/users/user/:id - update user by id
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
            res.status(400).json({ msg: 'User with that id does not exist' })
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
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// DELETE http://localhost:5002/users/:id - delete user by id
const deleteUser = async (req, res) => {
    try {
        const userid = await User.findByPk(req.params.id)

        if (!userid) {
            res.status(404).json({ msg: 'User not found' })
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
        res.status(500).json({ msg: 'Internal server error' })
    }
}

// GET http://localhost:5002/users/email/:email - get user by email
// RETURNS USER OBJECT IF USER EXISTS, AND NULL IF USER DOES NOT EXIST
const getUserByEmail = async (req, res) => {

    // VALIDATE USER EMAIL
    if (!validateEmail(req.params.email)) {
        res.status(400).json({ msg: 'Invalid email' })
    }

    // GET USER BY EMAIL
    try {
        const user = await User.findOne({
            where: {
                email: req.params.email
            }
        })
        return res.json(user)
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' })
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
