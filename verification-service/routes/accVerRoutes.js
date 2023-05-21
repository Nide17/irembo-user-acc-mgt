const express = require('express')
const router = express.Router()
const accVerController = require('../controllers/accVerController')

// MIDDLEWARES
const { verificationUpload } = require('../middlewares/verificationUpload.js')
const protectionMiddleware = require('../middlewares/protectionMiddleware')

// Private route - get all accvers
// GET http://localhost:5003/accvers
router.get('/', protectionMiddleware, accVerController.getAllAccVers)

// Private route - get accver by id
// GET http://localhost:5003/accvers/:id
router.get('/:id', protectionMiddleware, accVerController.getAccVerById)

// Private route - get accver by user userId
// GET http://localhost:5003/accvers/user/:userId
router.get('/user/:id', protectionMiddleware, accVerController.getAccVerByUserId)

// Private route - update accver by userId
// PUT http://localhost:5003/accvers/user/:userId
router.put('/user/:userId', protectionMiddleware, verificationUpload.single('documentImage'), accVerController.updateAccVer)

// Private route - delete accver by id
// DELETE http://localhost:5003/accvers/:id
router.delete('/:id', protectionMiddleware, accVerController.deleteAccVer)

module.exports = router