const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    address: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);