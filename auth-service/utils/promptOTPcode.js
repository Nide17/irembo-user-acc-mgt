// PROMPTING USER TO ENTER OTP CODE

// Path: auth-service\utils\promptOTPcode.js

// FUNCTION TO PROMPT USER TO ENTER OTP CODE
const promptUserToEnterOTPcode = async () => {

    // PROMPT USER TO ENTER OTP CODE
    const otpCode = prompt('Enter OTP code: ')

    // CHECK IF OTP CODE IS CORRECT
    if (otpCode === saveOTPcode.otpCode) {
        
        // CHECK IF OTP CODE HAS EXPIRED
        if (Date.now() > saveOTPcode.expiresAt) {
            return res.status(400).json({ msg: 'OTP code has expired, try again!' })
        }

        // CHECK IF OTP CODE HAS BEEN USED
        if (saveOTPcode.used) {
            return res.status(400).json({ msg: 'OTP code has been used, try again!' })
        }

        // UPDATE OTP CODE TO USED
        const updateOTPcode = await OTPcode.update({
            used: true
        }, {
            where: {
                id: saveOTPcode.id
            }
        })

        // CHECK IF OTP CODE UPDATED
        if (!updateOTPcode) {
            return res.status(400).json({ msg: 'Couldnt update OTP code, try again!' })
        }
    } else {
        return res.status(400).json({ msg: 'Invalid OTP code, try again!' })
    }
}

module.exports = promptUserToEnterOTPcode