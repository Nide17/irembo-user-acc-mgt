const { DataTypes } = require('sequelize')
const db = require('../config/db')

// OTP code table: This table stores the OTP code and its expiry date.
const OTPcode = db.define('otpCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    otpCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

// Export the OTPcode model for use in other modules
module.exports = OTPcode