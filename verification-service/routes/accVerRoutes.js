const express = require('express')
const router = express.Router()
const accVerController = require('../controllers/accVerController')
const { verificationUpload } = require('../middlewares/verificationUpload.js')

// Public route - get all accvers
// GET http://localhost:5003/accvers
router.get('/', accVerController.getAllAccVers)

// Public route - get accver by id
// GET http://localhost:5003/accvers/:id
router.get('/:id', accVerController.getAccVerById)

// Public route - get accver by user userId
// GET http://localhost:5003/accvers/user/:userId
router.get('/user/:id', accVerController.getAccVerByUserId)

// Public route - update accver by userId
// PUT http://localhost:5003/accvers/user/:userId
router.put('/user/:userId', verificationUpload.single('documentImage'), accVerController.updateAccVer)

// Public route - delete accver by id
// DELETE http://localhost:5003/accvers/:id
router.delete('/:id', accVerController.deleteAccVer)

module.exports = router