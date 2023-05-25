// IMPORTING REQUIRED MODULES
const express = require('express')
const cors = require('cors')
const app = express()
const axios = require('axios')
const multer = require('multer')
const FormData = require('form-data')

require('dotenv').config()
const PORT = process.env.PORT || 5000

// MIDDLEWARES
app.use(cors()) // ALLOW OTHER DOMAINS TO ACCESS THIS SERVER
app.use(express.json()) // PARSE JSON DATA FROM REQUEST BODY - POST/PUT REQUESTS
app.use(express.urlencoded({ extended: true })) // PARSE URL ENCODED DATA FROM REQUEST BODY - POST/PUT REQUESTS

// HANDLE ALL REQUESTS TO MICROSERVICES
// ALL TYPE OF REQUESTS TO /users WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/users', (req, res) => {

    console.log("REQUEST TO /users")

    // REDIRECT ALL REQUESTS TO /users (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.USER_SERVICE}${req.originalUrl}`,

        // IF REQUEST BODY CONTAINS FILE, SEND FILE INSTEAD OF JSON DATA
        data: req.file ? req.file : req.body,

        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {

        // SUCCESSFUL REQUEST
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            error: JSON.parse(JSON.stringify(error.response.data))
        })
    })
})

// ALL TYPE OF REQUESTS TO /profiles WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/profiles', (req, res) => {
    console.log('REQUEST TO /profiles')

    // CREATE FORM DATA OBJECT TO SEND TO SERVER (IF REQUEST BODY CONTAINS FILE)
    const formData = new FormData()

    // USE MULTER TO PARSE FILE FROM REQUEST BODY AND APPEND TO FORM DATA OBJECT
    const profilePhoto = multer().single('profilePhoto')

    profilePhoto(req, res, (err) => {
        if (err) {
            console.log(err)
            return
        }

        // APPEND FILE TO FORM DATA OBJECT
        if(req.file) {
            console.log('FILE FOUND')
            formData.append('profilePhoto', req.file.buffer, req.file.originalname)
        }

        // REDIRECT ALL REQUESTS TO /profiles (USING AXIOS)
        axios({
            method: req.method,
            url: `${process.env.USER_SERVICE}${req.originalUrl}`,
            data: req.file ? formData : req.body,
            headers: {
                'Content-Type': req.headers['content-type'],
                'x-auth-token': req.headers['x-auth-token']
            }
        }).then(response => {
            res.status(200).send(response.data)

        }).catch(error => {
            res.status(500).send({
                error: JSON.parse(JSON.stringify(error.response.data))
            })
        })

    })
})

// ALL TYPE OF REQUESTS TO /settings WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/settings', (req, res) => {

    console.log("REQUEST TO /settings")

    // REDIRECT ALL REQUESTS TO /settings (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.USER_SERVICE}${req.originalUrl}`,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            error: JSON.parse(JSON.stringify(error.response.data))
        })
    })
})

// ALL TYPE OF REQUESTS TO /roles WILL BE REDIRECTED TO USER SERVICE MICROSERVICE
app.use('/roles', (req, res) => {

    console.log("REQUEST TO /roles")

    // REDIRECT ALL REQUESTS TO /roles (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.USER_SERVICE}${req.originalUrl}`,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'x-auth-token': req.headers['x-auth-token']
        }
    }).then(response => {
        res.status(200).send(response.data)

    }).catch(error => {
        res.status(500).send({
            // error: error.response
            error: JSON.parse(JSON.stringify(error.response.data))
        })
    })
})

// ALL TYPE OF REQUESTS TO /auth WILL BE REDIRECTED TO AUTH SERVICE MICROSERVICE
app.use('/auth', (req, res) => {

    console.log("REQUEST TO /auth")

    // REDIRECT ALL REQUESTS TO /auth (USING AXIOS)
    axios({
        method: req.method,
        url: `${process.env.AUTH_SERVICE}${req.originalUrl}`,
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
            error: JSON.parse(JSON.stringify(error.response.data))
        })
    })
})

// ALL TYPE OF REQUESTS TO /accvers WILL BE REDIRECTED TO VERIFICATION SERVICE MICROSERVICE
app.use('/accvers', (req, res) => {

    console.log("REQUEST TO /accvers")

// CREATE FORM DATA OBJECT TO SEND TO SERVER (IF REQUEST BODY CONTAINS FILE)
    const formData = new FormData()

    // USE MULTER TO PARSE FILE FROM REQUEST BODY AND APPEND TO FORM DATA OBJECT
    const documentImage = multer().single('documentImage')

    documentImage(req, res, (err) => {
        if (err) {
            console.log(err)
            return
        }

        // APPEND FILE TO FORM DATA OBJECT
        if(req.file) {
            console.log('FILE FOUND')
            formData.append('documentImage', req.file.buffer, req.file.originalname)
        }

        // APPEND ALL OTHER FIELDS TO FORM DATA OBJECT IF THEY EXIST
        if(req.body) {
            for (const [key, value] of Object.entries(req.body)) {
                formData.append(key, value)
            }
        }

        // REDIRECT ALL REQUESTS TO /accvers (USING AXIOS)
        axios({
            method: req.method,
            url: `${process.env.VERIFICATION_SERVICE}${req.originalUrl}`,
            data: req.file ? formData : req.body,
            headers: {
                'Content-Type': req.headers['content-type'],
                'x-auth-token': req.headers['x-auth-token']
            }
        }).then(response => {
            res.status(200).send(response.data)

        }).catch(error => {
            res.status(500).send({
                error: JSON.parse(JSON.stringify(error.response.data))
            })
        })

    })
})

// STARTING SERVER
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))