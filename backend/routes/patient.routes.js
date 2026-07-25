const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const patientController = require('../controllers/patientController');

router.use(authMiddleware);

router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatient);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;