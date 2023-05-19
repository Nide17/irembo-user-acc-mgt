const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ACCOUNT VERIFICATION
const AccountVerification = sequelize.define('AccountVerification', {
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
        unique: true
    },
    documentType: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['PASSPORT', 'DRIVERS LICENSE', 'NATIONAL ID']]
        }
    },
    documentNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            notEmpty: true
        }
    },
    documentImage: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    status: {
        type: DataTypes.ENUM('UNVERIFIED', 'PENDING VERIFICATION', 'VERIFIED'),
        allowNull: false
    }
});

// EXPORT MODEL TO BE USED IN OTHER FILES
module.exports = AccountVerification;
