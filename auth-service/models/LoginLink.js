/**
 * id	INTEGER	Unique identifier for the login link
user_id	INTEGER	Foreign key referencing the user associated with the link
token	VARCHAR	Unique token generated for the login link
expiration	TIMESTAMP	Expiration timestamp for the login link
created_at	TIMESTAMP	Timestamp for when the login link was created
used	BOOLEAN	Flag indicating if the login link has been used
 */

const { DataTypes } = require('sequelize')
const db = require('../config/db')

// Login link table: This table stores the login link and its expiry date.
const LoginLink = db.define('loginLink', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

// Export the LoginLink model for use in other modules
module.exports = LoginLink
