const validateEmail = (email) => {

    // CHECK FOR VALIDITY OF EMAIL - REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // RETURN TRUE IF EMAIL IS VALID, FALSE OTHERWISE
    return emailRegex.test(email)
}

module.exports = validateEmail