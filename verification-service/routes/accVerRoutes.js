const express = require('express');
const router = express.Router();
const accVerController = require('../controllers/accVerController');
const { verificationUpload } = require('../middlewares/verificationUpload.js');

// Public route - get all accvers
// GET http://localhost:5003/accvers
router.get('/', accVerController.getAllAccVers);

// Public route - get accver by id
// GET http://localhost:5003/accvers/:id
router.get('/:id', accVerController.getAccVerById);

// Public route - create new accver
// POST http://localhost:5003/accvers
router.post('/', verificationUpload.single('documentImage'), accVerController.createAccVer);

// Public route - update accver by id
// PUT http://localhost:5003/accvers/:id
router.put('/:id', accVerController.updateAccVer);

// Public route - delete accver by id
// DELETE http://localhost:5003/accvers/:id
router.delete('/:id', accVerController.deleteAccVer);

module.exports = router;