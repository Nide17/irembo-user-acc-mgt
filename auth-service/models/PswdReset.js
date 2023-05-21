// MODEL FOR PASSWORD RESET TOKEN 
const { DataTypes } = require('sequelize');
const db = require('../config/db');

// Password reset table: This table stores the password reset token and its expiry date.
const PswdReset = db.define('pswdReset', {
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
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// Export the PswdReset model for use in other modules
module.exports = PswdReset;
