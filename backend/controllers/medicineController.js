const Medicine = require('../models/Medicine');

exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.json({ success: true, data: medicines });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMedicine = async (req, res) => {
    try {
        const existingMedicine = await Medicine.findOne({ 
            batchNo: req.body.batchNo 
        });
        if (existingMedicine) {
            return res.status(400).json({ 
                message: 'Batch number already exists' 
            });
        }

        const medicine = new Medicine(req.body);
        await medicine.save();
        res.status(201).json({ success: true, data: medicine });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json({ success: true, data: updatedMedicine });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json({ success: true, message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};