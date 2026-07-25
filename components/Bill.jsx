import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Bills() {
    const [bills, setBills] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        patientName: '',
        patientPhone: '',
        items: [],
        discount: 0,
        gst: 5,
        paid: false,
        paymentMethod: 'Cash'
    });
    const [currentItem, setCurrentItem] = useState({ medicineId: '', qty: 1 });

    useEffect(() => {
        fetchBills();
        fetchMedicines();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await api.get('/bills');
            setBills(res.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/medicines');
            setMedicines(res.data.data || []);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const addItemToBill = () => {
        if (!currentItem.medicineId) {
            alert('Please select a medicine');
            return;
        }

        const selectedMedicine = medicines.find(m => m._id === currentItem.medicineId);
        if (!selectedMedicine) return;

        if (selectedMedicine.quantity < currentItem.qty) {
            alert(`Only ${selectedMedicine.quantity} items in stock!`);
            return;
        }

        setForm({
            ...form,
            items: [
                ...form.items,
                {
                    medicineId: currentItem.medicineId,
                    name: selectedMedicine.name,
                    qty: currentItem.qty,
                    price: selectedMedicine.sellingPrice,
                    amount: currentItem.qty * selectedMedicine.sellingPrice
                }
            ]
        });
        setCurrentItem({ medicineId: '', qty: 1 });
    };

    const removeItem = (index) => {
        const updatedItems = form.items.filter((_, i) => i !== index);
        setForm({ ...form, items: updatedItems });
    };

    const calculateSubtotal = () => {
        return form.items.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discountAmount = (subtotal * form.discount) / 100;
        const gstAmount = (subtotal * form.gst) / 100;
        return subtotal - discountAmount + gstAmount;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.patientName) {
            alert('Please enter patient name');
            return;
        }
        if (form.items.length === 0) {
            alert('Please add at least one medicine');
            return;
        }

        try {
            const billData = {
                patientName: form.patientName,
                patientPhone: form.patientPhone || 'N/A',
                items: form.items.map(item => ({
                    medicineId: item.medicineId,
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                    amount: item.amount
                })),
                discount: form.discount,
                gst: form.gst,
                paid: form.paid,
                paymentMethod: form.paymentMethod
            };

            const res = await api.post('/bills', billData);
            
            if (res.data.success) {
                setForm({ patientName: '', patientPhone: '', items: [], discount: 0, gst: 5, paid: false, paymentMethod: 'Cash' });
                fetchBills();
                fetchMedicines();
                alert('✅ Bill added successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Failed to add bill');
        }
    };

    if (loading) return <div style={styles.loading}>Loading...</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🧾 Bills</h2>

            <div style={styles.formCard}>
                <h5>➕ Add New Bill</h5>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Patient Name *"
                        value={form.patientName}
                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={form.patientPhone}
                        onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                    />

                    <div style={styles.itemRow}>
                        <select
                            value={currentItem.medicineId}
                            onChange={(e) => setCurrentItem({ ...currentItem, medicineId: e.target.value })}
                        >
                            <option value="">-- Select Medicine --</option>
                            {medicines.map(m => (
                                <option key={m._id} value={m._id}>
                                    {m.name} (₹{m.sellingPrice} | Stock: {m.quantity})
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Qty"
                            value={currentItem.qty}
                            onChange={(e) => setCurrentItem({ ...currentItem, qty: parseInt(e.target.value) || 1 })}
                            min="1"
                        />
                        <button type="button" onClick={addItemToBill}>➕ Add</button>
                    </div>

                    {form.items.length > 0 && (
                        <div>
                            <h6>Items:</h6>
                            {form.items.map((item, index) => (
                                <div key={index}>
                                    {item.name} × {item.qty} = ₹{item.amount}
                                    <button type="button" onClick={() => removeItem(index)}>✕</button>
                                </div>
                            ))}
                            <div>
                                Subtotal: ₹{calculateSubtotal()} | Discount: {form.discount}% | GST: {form.gst}% | Total: ₹{calculateTotal().toFixed(2)}
                            </div>
                        </div>
                    )}

                    <div>
                        <input
                            type="number"
                            placeholder="Discount %"
                            value={form.discount}
                            onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
                            min="0"
                            max="100"
                        />
                        <input
                            type="number"
                            placeholder="GST %"
                            value={form.gst}
                            onChange={(e) => setForm({ ...form, gst: parseFloat(e.target.value) || 0 })}
                            min="0"
                            max="100"
                        />
                    </div>

                    <div>
                        <select
                            value={form.paymentMethod}
                            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        >
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Card">Card</option>
                            <option value="Credit">Credit</option>
                        </select>
                        <select
                            value={form.paid}
                            onChange={(e) => setForm({ ...form, paid: e.target.value === 'true' })}
                        >
                            <option value="false">Pending</option>
                            <option value="true">Paid</option>
                        </select>
                    </div>

                    <button type="submit">🧾 Generate Bill</button>
                </form>
            </div>

            <div>
                <h5>📋 Bills ({bills.length})</h5>
                {bills.length === 0 ? (
                    <p>No bills found</p>
                ) : (
                    bills.map((b) => (
                        <div key={b._id} style={styles.billCard}>
                            <div>
                                <span>{b.billNo}</span>
                                <span>{b.patientName}</span>
                                <span>₹{b.total}</span>
                                <span>{b.paid ? '✅ Paid' : '⏳ Pending'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', color: 'white' },
    title: { fontSize: '28px' },
    formCard: { background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '30px' },
    itemRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    billCard: { background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
    loading: { textAlign: 'center', padding: '50px', color: 'white' }
};

export default Bills;