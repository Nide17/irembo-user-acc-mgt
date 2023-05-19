const checkOTP = async (savedOTPcode) => {

    console.log('\nChecking OTP code...\n')

    // PROMPT USER TO ENTER OTP CODE
    const enteredOTP = prompt('Enter OTP code: ')

    // CHECK IF OTP CODE IS CORRECT
    if (enteredOTP === savedOTPcode.otpCode) {

        // CHECK IF OTP CODE HAS EXPIRED
        if (Date.now() > savedOTPcode.expiresAt) {
            res.status(400).json({ msg: 'OTP code has expired, try again!' })
            return false
        }

        // CHECK IF OTP CODE HAS BEEN USED
        if (savedOTPcode.used) {
            res.status(400).json({ msg: 'OTP code has been used, try again!' })
            return false
        }

        // UPDATE OTP CODE TO USED
        const updateOTPcode = await OTPcode.update({
            used: true
        }, {
            where: {
                id: savedOTPcode.id
            }
        })

        // CHECK IF OTP CODE UPDATED
        if (!updateOTPcode) {
            res.status(400).json({ msg: 'Couldnt update OTP code, try again!' })
            return false
        }
    }

    else {
        res.status(400).json({ msg: 'Invalid OTP code, try again!' })
        return false
    }

    return true
}

// EXPORTS
module.exports = checkOTP