// IMPORTING REQUIRED MODULES
const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const PORT = process.env.USER_SERVICE_PORT || 5001

// IMPORTING CONNECTION TO POSTGRESQL DATABASE
const sequelize = require('./config/db')

// IMPORTING ROUTES
const userRoutes = require('./routes/userRoutes')
const roleRoutes = require('./routes/roleRoutes')
const settingsRoutes = require('./routes/settingsRoutes')

// MIDDLEWARES
app.use(cors()) // ALLOW OTHER DOMAINS TO ACCESS THIS SERVER
app.use(express.json()) // PARSE JSON DATA FROM REQUEST BODY - POST/PUT REQUESTS

// TESTING DATABASE CONNECTION AND SYNCING MODELS
// Using .authenticate() function to test if the connection is OK
try {
    // sequelize.sync({ force: true })
    sequelize.sync({ force: false })
    sequelize.authenticate()
    console.log('User service connected to the database ...')
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

// STARTING SERVER
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// ROUTES
app.use('/users', userRoutes) // USE ROUTES FROM userRoutes.js
app.use('/roles', roleRoutes) // USE ROUTES FROM roleRoutes.js
app.use('/settings', settingsRoutes) // USE ROUTES FROM settingsRoutes.js
