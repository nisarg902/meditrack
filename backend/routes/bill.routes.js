const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const billController = require('../controllers/billController');

router.use(authMiddleware);

router.get('/', billController.getAllBills);
router.get('/:id', billController.getBill);
router.post('/', billController.createBill);
router.delete('/:id', billController.deleteBill);

module.exports = router;