// OTP SERVICE
const otpGenerator = require('otp-generator')

// GENERATE OTP
const generateOTP = () => {

    // GENERATE 6 DIGIT OTP WITH NO SPECIAL CHARACTERS
    return otpGenerator.generate(6, {
        upperCase: true,
        specialChars: false,
        alphabets: false
    })
}

// EXPORTS
module.exports = generateOTP