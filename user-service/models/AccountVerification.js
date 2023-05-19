const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

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
        }
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
        allowNull: true
    },
    documentImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('UNVERIFIED', 'PENDING VERIFICATION', 'VERIFIED'),
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});

// TABLE ASSOCIATIONS OR FOREIGN KEYS
AccountVerification.belongsTo(User, { foreignKey: 'userId' });

// EXPORT MODEL TO BE USED IN OTHER FILES
module.exports = AccountVerification;
