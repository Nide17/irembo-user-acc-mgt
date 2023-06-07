// IMPORTING REQUIRED MODULES
const Sequelize = require('sequelize')
require('dotenv').config()

// CONNECTION TO POSTGRESQL DATABASE USING SEQUELIZE
module.exports = new Sequelize(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)