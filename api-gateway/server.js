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

    // REDIRECT ALL REQUESTS TO /users (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {
        // SUCCESSFUL REQUEST
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            code: 'USERS_ACCESSS_ERROR',
            msg: 'Failed to access users',
            status: 500,
            error: error
        })
    })
})

// ALL TYPE OF REQUESTS TO /profiles WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/profiles', (req, res) => {

    // REDIRECT ALL REQUESTS TO /profiles (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}${req.originalUrl}`,
        data: req.file ? req.file : req.body,
        headers: {
            'x-auth-token': req.headers['x-auth-token'],
            'Content-Type': req.file ? 'multipart/form-data' : req.headers['content-type']
        }
    }).then(response => {
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            code: 'PROFILES_ACCESS_ERROR',
            msg: 'Profiles access failed',
            status: 500,
            error: error
        })
    })
})

// ALL TYPE OF REQUESTS TO /settings WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/settings', (req, res) => {

    // REDIRECT ALL REQUESTS TO /settings (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            code: 'SETTINGS_ACCESS_ERROR',
            msg: 'Failed to access settings',
            status: 500,
            error: error
        })
    })
})

// ALL TYPE OF REQUESTS TO /roles WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/roles', (req, res) => {

    // REDIRECT ALL REQUESTS TO /roles (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.USER_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            code: 'FAILED_ROLE_REQUEST',
            msg: 'Failed role request',
            status: 500,
            error: error
        })
    })
})

// ALL TYPE OF REQUESTS TO /auth WILL BE REDIRECTED TO AUTH SERVICE MICROSERVICE
app.use('/auth', (req, res) => {

    // REDIRECT ALL REQUESTS TO /auth (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.AUTH_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {
        // IF RESPONSE IS SUCCESSFUL, SEND RESPONSE
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            code: 'UNAUTHORIZED',
            msg: 'Not Authorized',
            status: 500,
            error: error
        })
    })
})

// ALL TYPE OF REQUESTS TO /accvers WILL BE REDIRECTED TO VERIFICATION SERVICE MICROSERVICE
app.use('/accvers', (req, res) => {

    // REDIRECT ALL REQUESTS TO /accvers (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.APP_HOST}:${process.env.VERIFICATION_SERVICE_PORT}${req.originalUrl}`,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {
        // IF RESPONSE IS SUCCESSFUL, SEND RESPONSE
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            code: 'FAILED_VERIFICATION',
            msg: 'Unsuccessful verification',
            status: 500,
            error: error
        })
    })
})

// STARTING SERVER
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))