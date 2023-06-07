const { DataTypes } = require('sequelize')
const db = require('../config/db')

// Login link table: This table stores the login link and its expiry date.
const LoginLink = db.define('loginLink', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

// Export the LoginLink model for use in other modules
module.exports = LoginLink
