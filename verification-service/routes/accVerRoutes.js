const express = require('express')
const router = express.Router()
const accVerController = require('../controllers/accVerController')

// MIDDLEWARES
const { verificationUpload } = require('../middlewares/verificationUpload.js')
const verificationProtection = require('../middlewares/verificationProtection')

// Private route - get all accvers
// GET http://localhost:5003/accvers
router.get('/', verificationProtection([1, 2, 3]), accVerController.getAllAccVers)

// Private route - get accver by id
// GET http://localhost:5003/accvers/:id
router.get('/:id', verificationProtection([2]), accVerController.getAccVerById)

// Private route - get accver by user userId
// GET http://localhost:5003/accvers/user/:userId
router.get('/user/:userId', verificationProtection([1, 2, 3]), accVerController.getAccVerByUserId)

// Private route - update accver by userId
// PUT http://localhost:5003/accvers/user/:userId
router.put('/user/:userId', verificationProtection([1, 2, 3]), verificationUpload.single('documentImage'), accVerController.updateAccVer)

// Private route - verify accver by id
// PUT http://localhost:5003/accvers/verify/:id
router.put('/verify/:id', verificationProtection([2]), accVerController.verifyAccVer)

// Private route - delete accver by id
// DELETE http://localhost:5003/accvers/:id
router.delete('/:id', verificationProtection([2]), accVerController.deleteAccVer)

module.exports = router