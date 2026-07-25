const Patient = require('../models/Patient');

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json({ success: true, data: patients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPatient = async (req, res) => {
    try {
        const existingPatient = await Patient.findOne({ 
            phone: req.body.phone 
        });
        if (existingPatient) {
            return res.status(400).json({ 
                message: 'Phone number already registered' 
            });
        }

        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json({ success: true, data: patient });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json({ success: true, data: updatedPatient });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};