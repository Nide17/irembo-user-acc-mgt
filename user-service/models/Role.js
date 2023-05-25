const { DataTypes } = require('sequelize');
const db = require('../config/db');

// ROLES SUCH AS ADMIN, USER, AGENT, ETC.
const Role = db.define('role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isAlpha: true,
            notEmpty: true,
            isIn: [['ADMIN', 'USER', 'AGENT']],
        }
    }
})

// EXPORT MODEL TO BE USED IN OTHER FILES
module.exports = Role