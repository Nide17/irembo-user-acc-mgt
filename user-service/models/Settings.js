const { DataTypes } = require('sequelize')
const db = require('../config/db')
const User = require('./User')

// SPECIFIC SETTINGS TO ONE USER SUCH AS NOTIFICATIONS, TWO FACTOR AUTH, ETC.
const Settings = db.define('settings', {
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
        }
    },
    notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    mfa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

// TABLE ASSOCIATIONS OR FOREIGN KEYS
Settings.belongsTo(User, { foreignKey: 'userId' })

// EXPORT MODEL TO BE USED IN OTHER FILES
module.exports = Settings