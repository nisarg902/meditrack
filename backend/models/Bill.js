const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    billNo: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String },
    items: [{
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card', 'Credit'], default: 'Cash' }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);