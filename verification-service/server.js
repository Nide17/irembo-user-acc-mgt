// IMPORTING REQUIRED MODULES
const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 5003

// IMPORTING CONNECTION TO POSTGRESQL DATABASE
const sequelize = require('./config/db')

// IMPORTING ROUTES
const accVerRoutes = require('./routes/accVerRoutes')


// MIDDLEWARES
app.use(cors()) // ALLOW OTHER DOMAINS TO ACCESS THIS SERVER
app.use(express.json()) // PARSE JSON DATA FROM REQUEST BODY - POST/PUT REQUESTS

// TESTING DATABASE CONNECTION AND SYNCING MODELS TO DB
try {
    sequelize.authenticate() // TESTING DATABASE CONNECTION
    sequelize.sync({ force: false }) // SYNCING MODELS TO DB
    console.log('Verification service connected to the database ...')
} catch (error) {
    console.log('Unable to connect to the database:', error)
}

// STARTING SERVER
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// ROUTES
app.use('/accvers', accVerRoutes) // USE ROUTES FROM accVerRoutes.js
