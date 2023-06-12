// IMPORTING REQUIRED MODULES
const express = require('express')
const cors = require('cors')

// IMPORTING CONNECTION TO POSTGRESQL DATABASE
const sequelize = require('./config/db')

// IMPORTING ROUTES FROM ROUTE FILES
const userRoutes = require('./routes/userRoutes')
const profileRoutes = require('./routes/profileRoutes')
const roleRoutes = require('./routes/roleRoutes')
const settingsRoutes = require('./routes/settingsRoutes')

// PORT NUMBER AT WHICH THE SERVER WILL RUN
const PORT = process.env.PORT || 5002

// LOAD ALL ENVIRONMENT VARIABLES FROM .env FILE
require('dotenv').config()

// INITIALIZE OR CREATING AN EXPRESS APP
const app = express()

// MIDDLEWARES
app.use(cors()) // ALLOW OTHER DOMAINS TO ACCESS THIS SERVER
app.use(express.json()) // PARSE JSON DATA FROM REQUEST BODY - POST/PUT REQUESTS

// TESTING DATABASE CONNECTION AND SYNCING MODELS
try {
    sequelize.authenticate() // TEST CONNECTION TO DATABASE IF IT IS SUCCESSFUL
    // sequelize.sync({ force: true }) // DROP TABLES
    sequelize.sync({ force: false }) // DO NOT DROP TABLES
    console.log('User service connected to the database ...')
} catch (error) {
    console.log('Unable to connect to the database:', error)
}

// STARTING SERVER 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// DEFINE TO WHICH ROUTE TO REDIRECT REQUESTS THAT START WITH /users, /profiles, /roles, /settings
app.use('/users', userRoutes) // USE ROUTES FROM userRoutes.js
app.use('/profiles', profileRoutes) // USE ROUTES FROM profileRoutes.js
app.use('/roles', roleRoutes) // USE ROUTES FROM roleRoutes.js
app.use('/settings', settingsRoutes) // USE ROUTES FROM settingsRoutes.js
