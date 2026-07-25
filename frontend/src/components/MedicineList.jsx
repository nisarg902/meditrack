import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MedicineList() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        name: '',
        category: '',
        manufacturer: '',
        batchNo: '',
        hsnCode: '',
        packSize: '',
        quantity: 0,
        minStock: 10,
        purchasePrice: 0,
        sellingPrice: 0,
        mrp: 0,
        gst: 5,
        expiryDate: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/medicines');
            setMedicines(res.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/medicines/${editingId}`, form);
            } else {
                await api.post('/medicines', form);
            }
            setForm({
                name: '',
                category: '',
                manufacturer: '',
                batchNo: '',
                hsnCode: '',
                packSize: '',
                quantity: 0,
                minStock: 10,
                purchasePrice: 0,
                sellingPrice: 0,
                mrp: 0,
                gst: 5,
                expiryDate: ''
            });
            setEditingId(null);
            setShowForm(false);
            fetchMedicines();
            alert(editingId ? '✅ Medicine updated!' : '✅ Medicine added!');
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Failed to save medicine');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                await api.delete(`/medicines/${id}`);
                fetchMedicines();
                alert('✅ Medicine deleted!');
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Failed to delete medicine');
            }
        }
    };

    const handleEdit = (medicine) => {
        setForm({
            name: medicine.name,
            category: medicine.category,
            manufacturer: medicine.manufacturer,
            batchNo: medicine.batchNo,
            hsnCode: medicine.hsnCode,
            packSize: medicine.packSize,
            quantity: medicine.quantity,
            minStock: medicine.minStock || 10,
            purchasePrice: medicine.purchasePrice,
            sellingPrice: medicine.sellingPrice,
            mrp: medicine.mrp,
            gst: medicine.gst || 5,
            expiryDate: medicine.expiryDate ? medicine.expiryDate.split('T')[0] : ''
        });
        setEditingId(medicine._id);
        setShowForm(true);
    };

    if (loading) {
        return <div style={styles.loading}>Loading medicines...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>💊 Medicines</h2>
                <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
                    {showForm ? '✕ Cancel' : '➕ Add Medicine'}
                </button>
            </div>

            {showForm && (
                <div style={styles.formCard}>
                    <h3>{editingId ? '✏️ Edit Medicine' : '➕ Add New Medicine'}</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Name *"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category *"
                            value={form.category}
                            onChange={(e) => setForm({...form, category: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Manufacturer *"
                            value={form.manufacturer}
                            onChange={(e) => setForm({...form, manufacturer: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Batch No *"
                            value={form.batchNo}
                            onChange={(e) => setForm({...form, batchNo: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="HSN Code *"
                            value={form.hsnCode}
                            onChange={(e) => setForm({...form, hsnCode: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Pack Size *"
                            value={form.packSize}
                            onChange={(e) => setForm({...form, packSize: e.target.value})}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity *"
                            value={form.quantity}
                            onChange={(e) => setForm({...form, quantity: parseInt(e.target.value) || 0})}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Min Stock"
                            value={form.minStock}
                            onChange={(e) => setForm({...form, minStock: parseInt(e.target.value) || 0})}
                        />
                        <input
                            type="number"
                            placeholder="Purchase Price *"
                            value={form.purchasePrice}
                            onChange={(e) => setForm({...form, purchasePrice: parseFloat(e.target.value) || 0})}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Selling Price *"
                            value={form.sellingPrice}
                            onChange={(e) => setForm({...form, sellingPrice: parseFloat(e.target.value) || 0})}
                            required
                        />
                        <input
                            type="number"
                            placeholder="MRP *"
                            value={form.mrp}
                            onChange={(e) => setForm({...form, mrp: parseFloat(e.target.value) || 0})}
                            required
                        />
                        <input
                            type="number"
                            placeholder="GST %"
                            value={form.gst}
                            onChange={(e) => setForm({...form, gst: parseFloat(e.target.value) || 0})}
                        />
                        <input
                            type="date"
                            placeholder="Expiry Date *"
                            value={form.expiryDate}
                            onChange={(e) => setForm({...form, expiryDate: e.target.value})}
                            required
                        />
                        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                    </form>
                </div>
            )}

            <div style={styles.listContainer}>
                {medicines.length === 0 ? (
                    <p>No medicines found</p>
                ) : (
                    medicines.map((m) => (
                        <div key={m._id} style={styles.card}>
                            <h3>{m.name}</h3>
                            <p>Category: {m.category}</p>
                            <p>Quantity: {m.quantity}</p>
                            <p>Price: ₹{m.sellingPrice}</p>
                            <button onClick={() => handleEdit(m)}>✏️ Edit</button>
                            <button onClick={() => handleDelete(m._id)}>🗑️ Delete</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '20px', color: 'white' },
    header: { display: 'flex', justifyContent: 'space-between' },
    title: { fontSize: '28px' },
    addBtn: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px' },
    formCard: { background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px' },
    card: { background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
    loading: { textAlign: 'center', padding: '50px', color: 'white' },
    listContainer: { marginTop: '20px' }
};

export default MedicineList;