/**
 * id	INTEGER	Unique identifier for the OTP code
user_id	INTEGER	ID of the user associated with the OTP code
otp_code	VARCHAR(6)	OTP code (6-digit)
created_at	TIMESTAMP	Timestamp when the OTP code was created
expires_at	TIMESTAMP	Timestamp indicating the expiration time of the OTP code
used    BOOLEAN	Flag indicating if the OTP code has been used
 */

const { DataTypes } = require('sequelize')
const db = require('../config/db')

// OTP code table: This table stores the OTP code and its expiry date.
const OTPcode = db.define('otpCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    otpCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

// Export the OTPcode model for use in other modules
module.exports = OTPcode