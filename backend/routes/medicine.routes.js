const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const medicineController = require('../controllers/medicineController');

router.use(authMiddleware);

router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicine);
router.post('/', medicineController.createMedicine);
router.put('/:id', medicineController.updateMedicine);
router.delete('/:id', medicineController.deleteMedicine);

module.exports = router;