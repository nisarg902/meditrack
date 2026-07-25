const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');

// ✅ GET all bills
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().sort({ createdAt: -1 });
        res.json({ success: true, data: bills });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET single bill
exports.getBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
        res.json({ success: true, data: bill });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ CREATE bill with stock update
exports.createBill = async (req, res) => {
    try {
        const { items, patientName, patientPhone, discount, gst, paid, paymentMethod } = req.body;

        // Calculate totals
        let subtotal = 0;
        for (const item of items) {
            subtotal += item.amount;
        }

        const gstAmount = (subtotal * (gst || 0)) / 100;
        const discountAmount = (subtotal * (discount || 0)) / 100;
        const total = subtotal + gstAmount - discountAmount;

        // Update stock
        for (const item of items) {
            if (item.medicineId) {
                const medicine = await Medicine.findById(item.medicineId);
                if (medicine) {
                    medicine.quantity = (medicine.quantity || 0) - item.qty;
                    await medicine.save();
                }
            }
        }

        const bill = new Bill({
            billNo: `BILL-${Date.now().toString().slice(-6)}`,
            patientName,
            patientPhone,
            items,
            subtotal,
            discount: discountAmount,
            gst: gstAmount,
            total,
            paid: paid || false,
            paymentMethod: paymentMethod || 'Cash'
        });

        await bill.save();
        res.status(201).json({ success: true, data: bill });
    } catch (error) {
        console.error('Create Bill Error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ DELETE bill
exports.deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
        res.json({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};