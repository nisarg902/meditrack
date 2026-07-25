const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    manufacturer: { type: String, required: true },
    batchNo: { type: String, required: true, unique: true },
    hsnCode: { type: String, required: true },
    packSize: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 10 },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    mrp: { type: Number, required: true },
    gst: { type: Number, default: 5 },
    expiryDate: { type: Date, required: true },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);