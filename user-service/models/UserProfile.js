const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const User = require('./User')

// USER PROFILE
const UserProfile = sequelize.define('userProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: true,
            notEmpty: true
        },
        unique: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: true
        }
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: true,
            isIn: [['MALE', 'FEMALE', 'OTHER']]
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    maritalStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: true,
            isIn: [['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']]
        }
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: true
        }
    }
})

// EXPORT MODEL TO BE USED IN OTHER FILES
module.exports = UserProfile
