const bcrypt = require("bcryptjs") // FOR HASHING PASSWORDS

// MODELS
const User = require('../models/User')
const UserProfile = require('../models/UserProfile')

// UTILS
const validateEmail = require('../utils/validateEmail')
const validatePassword = require('../utils/validatePassword')

// GET http://localhost:5002/users - get all users
const getAllUsers = async (req, res) => {

    try {
        // ATTEMPT TO GET ALL USERS FROM DATABASE
        const users = await User.findAll()

        // IF NO USERS FOUND
        if (!users) {
            return res.json({
                status: 404,
                msg: 'No users found'
            })
        }

        // IF USERS FOUND, REMOVE PASSWORD FROM EACH USER
        users.forEach(user => {
            user.password = undefined
        })

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            users
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// GET http://localhost:5002/users/:id - get user by id
const getUserById = async (req, res) => {

    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })

        // IF NO USER FOUND
        if (!user) {
            return res.json({
                status: 404,
                msg: 'User not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            user
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// GET http://localhost:5002/users/email/:email - get user by email
// RETURNS USER OBJECT IF USER EXISTS, AND NULL IF USER DOES NOT EXIST
const getUserByEmail = async (req, res) => {

    // VALIDATE USER EMAIL
    if (!validateEmail(req.params.email)) {
        return res.json({
            status: 400,
            msg: 'Invalid email'
        })
    }

    // GET USER BY EMAIL
    try {
        const user = await User.findOne({
            where: {
                email: req.params.email
            }
        })

        // IF USER EXISTS, RETURN USER OBJECT
        if (!user) {
            res.json({
                status: 404,
                msg: 'User not found'
            })
        }

        // IF USER DOES NOT EXIST, RETURN NULL
        else {
            return res.json({
                status: 200,
                user
            })
        }

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error while getting user by email',
            error
        })
    }
}


// GET http://localhost:5002/users/:id - get user link by id
const getUserByLinkId = async (req, res) => {

    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })

        // IF NO USER FOUND
        if (!user) {
            return res.json({
                status: 404,
                msg: 'User not found'
            })
        }

        // SEND SUCCESS RESPONSE
        return res.json({
            status: 200,
            user
        })

        // CATCH ANY OTHER ERRORS AND SEND INTERNAL SERVER ERROR RESPONSE
    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// POST http://localhost:5002/users - create new user
const createUser = async (req, res) => {

    // DESCTRUCTURE USER DATA FROM REQUEST BODY
    const { email, password, roleId } = req.body

    // VALIDATE USER DATA
    if (!email || !password) {
        return res.json({
            status: 400,
            msg: 'Please provide email and password'
        })
    }

    // VALIDATE USER EMAIL
    if (!validateEmail(email)) {
        return res.json({
            status: 400,
            msg: 'Invalid email'
        })
    }

    // VALIDATE USER PASSWORD
    if (!validatePassword(password)) {
        return res.json({
            status: 400,
            msg: 'Password should be greater than 7 and having special characters, number, and uppercase and lowercase letters'
        })
    }

    // CREATE NEW USER
    try {
        // CHECK IF USER ALREADY EXISTS
        const userExists = await User.findOne({ where: { email } })

        if (userExists) {
            return res.json({
                status: 400,
                msg: 'User with that email already exists'
            })
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
                const destroyed = await User.destroy({
                    where: {
                        id: user.id
                    }
                })

                if (!destroyed) {
                    return res.json({
                        status: 400,
                        msg: 'Failed!'
                    })
                }
                else {
                    return res.json({
                        status: 200,
                        msg: 'Success!'
                    })
                }
            }
        }

        // RETURN THE USER, ALL IS WELL
        return res.json({
            status: 200,
            user
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
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
            return res.json({
                status: 400,
                msg: 'User with that id does not exist'
            })
        }

        const user = await User.update({
            password,
            updatedAt: new Date()
        }, {
            where: {
                id: req.params.id
            }
        })

        // IF USER IS NOT UPDATED SUCCESSFULLY, RETURN ERROR msg
        if (!user) {
            return res.json({
                status: 400,
                msg: 'Failed to update user'
            })
        }

        // RETURN THE USER, ALL IS WELL
        return res.json({
            status: 200,
            user
        })

    } catch (error) {
        return res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// DELETE http://localhost:5002/users/:id - delete user by id
const deleteUser = async (req, res) => {
    try {
        const userid = await User.findByPk(req.params.id)

        if (!userid) {
            return res.json({
                status: 404,
                msg: 'User not found'
            })
        }

        else {
            const user = await User.destroy({
                where: {
                    id: req.params.id
                }
            })

            // IF USER IS NOT DELETED SUCCESSFULLY, RETURN ERROR msg
            if (!user) {
                return res.json({
                    status: 400,
                    msg: 'Failed!'
                })
            }

            // RETURN THE USER, ALL IS WELL
            return res.json({
                status: 200,
                user
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            msg: 'Internal server error',
            error
        })
    }
}

// EXPORTS
module.exports = {
    getAllUsers,
    getUserById,
    getUserByLinkId,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
}
