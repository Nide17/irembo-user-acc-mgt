const AccountVerification = require('../models/AccountVerification');

// GET http://localhost:5003/accvers - get all accvers
const getAllAccVers = async (req, res) => {
    console.log('Fetching all accvers...');
    try {
        const accvers = await AccountVerification.findAll();
        res.json(accvers);
    } catch (error) {
        console.error('Error fetching accvers', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET http://localhost:5003/accvers/:id - get accver by id
const getAccVerById = async (req, res) => {
    console.log('Fetching accver by id...');
    try {
        const accver = await AccountVerification.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(accver);
    } catch (error) {
        console.error('Error fetching accver by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// POST http://localhost:5003/accvers - create new accver
const createAccVer = async (req, res) => {

    // DESTRUCTURE THE REQUEST BODY
    const { userId, documentType, documentNumber, status } = req.body;

    // VALIDATE THE REQUEST BODY
    if (!userId || !documentType || !documentNumber || !status) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // CHECK IF FILE IS MISSING
    if (!req.file) {
        throw Error('FILE_MISSING')
    }

    // CHECK IF FILE IS AN IMAGE
    else {
        const img_file = req.file

        // IF VERIFICATION WITH SAME USER ID ALREADY EXISTS, UPDATE IT
        const existingAccVer = await AccountVerification.findOne({
            where: {
                userId: userId,
            }
        });

        if (existingAccVer) {
            // UPDATE EXISTING VERIFICATION
            const updatedAccVer = await AccountVerification.update({
                documentType,
                documentNumber,
                documentImage: img_file.location ? img_file.location : img_file.path,
                status
            }, {
                where: {
                    userId: userId
                }
            });
            return res.json(updatedAccVer);
        }

        else {

            // CREATE NEW VERIFICATION
            try {
                const newAccver = await AccountVerification.create({
                    userId,
                    documentType,
                    documentNumber,
                    documentImage: img_file.location ? img_file.location : img_file.path,
                    status
                });

                // SEND RESPONSE
                res.json(newAccver);
            } catch (error) {
                console.error('Error creating new accver', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        } // END OF EXISTING ACCOUNT VERIFICATION CHECK
    } // END OF FILE EXISTENCE CHECK
}

// PUT http://localhost:5003/accvers/:id - update accver by id
const updateAccVer = async (req, res) => {
    console.log('Updating accver by id...');

    // CHECK IF user id is valid
    if (!userId) {
        return res.status(400).json({ error: 'Please provide user id' });
    }

    // DESTRUCTURE THE REQUEST BODY
    const { documentType, documentNumber, status } = req.body;

    // CHECK IF VERIFICATION WITH SAME USER ID ALREADY EXISTS
    const existingAccVer = await AccountVerification.findOne({
        where: {
            userId: req.userId,
        }
    });

    // UPDATE EXISTING VERIFICATION
    if (existingAccVer) {
        try {
            const accver = await AccountVerification.update({
                documentType,
                documentNumber,
                documentImage: img_file.location ? img_file.location : img_file.path,
                status
            }, {
                where: {
                    userId: req.userId
                }
            });

            // SEND RESPONSE
            res.json(accver);
        } catch (error) {
            console.error('Error updating accver by id', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

// DELETE http://localhost:5003/accvers/:id - delete accver by id
const deleteAccVer = async (req, res) => {
    console.log('Deleting accver by id...');
    try {
        const accver = await AccountVerification.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json(accver);
    } catch (error) {
        console.error('Error deleting accver by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllAccVers,
    getAccVerById,
    createAccVer,
    updateAccVer,
    deleteAccVer
};
