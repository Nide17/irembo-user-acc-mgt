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
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //     isAlpha: true
        // }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    documentType: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['passport', 'drivers_license', 'nid', 'laissez_passer']]
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
        type: DataTypes.ENUM('unverified', 'pending', 'verified'),
        allowNull: false,
        validate: {
            isIn: [['unverified', 'pending', 'verified']],
            notEmpty: true
        },
        defaultValue: 'unverified'
    }
});

// EXPORT MODEL TO BE USED IN OTHER FILES
module.exports = AccountVerification;
