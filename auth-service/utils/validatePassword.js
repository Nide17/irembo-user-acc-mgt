const validatePassword = (password) => {

    // CHECK FOR VALIDITY OF password - REGEX
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

    // RETURN TRUE IF password IS VALID, FALSE OTHERWISE
    return passwordRegex.test(password)
}

module.exports = validatePassword