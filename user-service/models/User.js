const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./Role');

// USER
const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: true,
            notEmpty: true,
        }
    },
});

// TABLE ASSOCIATIONS OR FOREIGN KEYS
User.belongsTo(Role, { foreignKey: 'roleId' });

// EXPORT MODEL TO BE USED IN OTHER FILES
module.exports = User;
