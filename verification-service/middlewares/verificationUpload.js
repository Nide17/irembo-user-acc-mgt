const path = require('path')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')
require('dotenv').config()

const s3Config = new AWS.S3({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
    Bucket: process.env.USER_DOCUMENTS,
    region: process.env.AWS_REGION,
})

const fileFilter = (req, file, callback) => {

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/svg, image/jpg, image/gif', 'image/JPEG', 'image/PNG', 'image/SVG, image/JPG, image/GIF']

    if (allowedFileTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

// UPLOAD IMAGE ON LOCAL MACHINE
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, 'documents'));
    },
    filename: (req, file, callback) => {
        // REPLACE SPACE WITH DASHES AND REMOVE SPECIAL CHARACTERS FROM FILENAME
        const fileName = file.originalname.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9.]/g, '-')
        callback(null, req.params.id + '-' + fileName)
    }
})

// UPLOAD IMAGE ON AWS S3 BUCKET
const multerS3Storage = multerS3({
    s3: s3Config,
    bucket: process.env.USER_DOCUMENTS,
    acl: 'public-read',
    metadata: (req, file, callback) => {
        callback(null, { fieldName: file.fieldname })
    },
    key: (req, file, callback) => {

        // REPLACE SPACE WITH DASHES AND REMOVE SPECIAL CHARACTERS FROM FILENAME
        const fileName = file.originalname.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9.]/g, '-')
        callback(null, req.params.id + '-' + fileName)
    }
})

// UPLOAD IMAGE WITH MULTER AND MULTER-S3
const upload = multer({
    // LOCAL MACHINE UPLOAD
    // storage: storage,
    storage: multerS3Storage,
    fileFilter,
    limits: {
        fileSize: 12000000 // 1000000 Bytes = 1 MB (2MB)
    }
})

exports.verificationUpload = upload