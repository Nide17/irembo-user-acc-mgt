const nodemailer = require('nodemailer')
require('dotenv').config()

// UTILITY FUNCTION TO SEND EMAIL WITH NODEMAILER - SENDS EMAIL TO USER WITH RESET LINK
const sendEmailWithNodemailer = async (req, res, emailData) => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            pool: true,
            secure: true,
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            maxConnections: 20,
            maxMessages: Infinity
        })

        const info = await transporter.sendMail(emailData)
    } catch (error) {
        console.error('Error sending email with nodemailer', error)
    }
}

module.exports = {
    sendEmailWithNodemailer
}