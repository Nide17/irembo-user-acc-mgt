// IMPORTING REQUIRED MODULES
const express = require('express')
const cors = require('cors')
const app = express()
const axios = require('axios')

require('dotenv').config()
const PORT = process.env.GATEWAY_PORT || 5000

// MIDDLEWARES
app.use(cors()) // ALLOW OTHER DOMAINS TO ACCESS THIS SERVER
app.use(express.json()) // PARSE JSON DATA FROM REQUEST BODY - POST/PUT REQUESTS
app.use(express.urlencoded({ extended: false })) // PARSE URL ENCODED DATA FROM REQUEST BODY - POST/PUT REQUESTS

// HANDLE ALL REQUESTS TO MICROSERVICES
// ALL TYPE OF REQUESTS TO /users WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/users', (req, res) => {

    console.log('Request made to /users', req.originalUrl)

    // REDIRECT ALL REQUESTS TO /users WITHOUT USING PROXY MIDDLEWARE (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: req.headers
    }).then(response => {
        console.log('Response from /users', response.data)
        res.send(response.data)
    }).catch(error => {
        console.log('Response:', error)
        // IF ERROR OCCURS, SEND ERROR MESSAGE
        res.send(error.message)
    })
})

// ALL TYPE OF REQUESTS TO /settings WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/settings', (req, res) => {

    // REDIRECT ALL REQUESTS TO /settings WITHOUT USING PROXY MIDDLEWARE (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: req.headers
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        // IF ERROR OCCURS, SEND ERROR MESSAGE
        res.send(error.message)
    })
})

// ALL TYPE OF REQUESTS TO /roles WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/roles', (req, res) => {

    // REDIRECT ALL REQUESTS TO /roles WITHOUT USING PROXY MIDDLEWARE (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: req.headers
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        // IF ERROR OCCURS, SEND ERROR MESSAGE
        res.send(error.message)
    })
})

// ALL TYPE OF REQUESTS TO /auth WILL BE REDIRECTED TO AUTH SERVICE MICROSERVICE
app.use('/auth', (req, res) => {

    // REDIRECT ALL REQUESTS TO /auth WITHOUT USING PROXY MIDDLEWARE (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.AUTH_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: req.headers
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        // IF ERROR OCCURS, SEND ERROR MESSAGE
        res.send(error.message)
    })
})

// ALL TYPE OF REQUESTS TO /accvers WILL BE REDIRECTED TO VERIFICATION SERVICE MICROSERVICE
app.use('/accvers', (req, res) => {

    // REDIRECT ALL REQUESTS TO /accvers WITHOUT USING PROXY MIDDLEWARE (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.VERIFICATION_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: req.headers
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        // IF ERROR OCCURS, SEND ERROR MESSAGE
        res.send(error.message)
    })
})


// STARTING SERVER
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))