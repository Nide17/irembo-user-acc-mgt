// IMPORTING REQUIRED MODULES
const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 5001

// IMPORTING CONNECTION TO POSTGRESQL DATABASE
const sequelize = require('./config/db')

// IMPORTING ROUTES
const authRoutes = require('./routes/authRoutes')

// MIDDLEWARES
app.use(cors()) // ALLOW OTHER DOMAINS TO ACCESS THIS SERVER
app.use(express.json()) // PARSE JSON DATA FROM REQUEST BODY - POST/PUT REQUESTS

// TESTING DATABASE CONNECTION AND SYNCING MODELS
try {
    // sequelize.sync({ force: true })
    sequelize.sync({ force: false })
    sequelize.authenticate()
    console.log('Auth service connected to database ...')
} catch (error) {
    console.log('Unable to connect auth to the database:', error)
}

// STARTING SERVER
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// ROUTES
app.use('/auth', authRoutes) // USE ROUTES FROM authRoutes.js

