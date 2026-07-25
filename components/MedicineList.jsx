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
                    <h3 style={styles.formTitle}>{editingId ? '✏️ Edit Medicine' : '➕ Add New Medicine'}</h3>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            {/* Name */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>💊 Medicine Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Paracetamol 500mg"
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            
                            {/* Category */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>📂 Category *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Pain Relief"
                                    value={form.category}
                                    onChange={(e) => setForm({...form, category: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            {/* Manufacturer */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>🏭 Manufacturer *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Cipla"
                                    value={form.manufacturer}
                                    onChange={(e) => setForm({...form, manufacturer: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            
                            {/* Batch No */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>🔢 Batch No *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., BATCH001"
                                    value={form.batchNo}
                                    onChange={(e) => setForm({...form, batchNo: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            {/* HSN Code */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>📋 HSN Code *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 300490"
                                    value={form.hsnCode}
                                    onChange={(e) => setForm({...form, hsnCode: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            
                            {/* Pack Size */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>📦 Pack Size *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 10 tablets"
                                    value={form.packSize}
                                    onChange={(e) => setForm({...form, packSize: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            {/* Quantity */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>📊 Quantity *</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 100"
                                    value={form.quantity}
                                    onChange={(e) => setForm({...form, quantity: parseInt(e.target.value) || 0})}
                                    style={styles.input}
                                    required
                                    min="0"
                                />
                            </div>
                            
                            {/* Min Stock */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>⚠️ Min Stock Alert</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 10"
                                    value={form.minStock}
                                    onChange={(e) => setForm({...form, minStock: parseInt(e.target.value) || 0})}
                                    style={styles.input}
                                    min="0"
                                />
                            </div>

                            {/* Purchase Price */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>💰 Purchase Price *</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 30"
                                    value={form.purchasePrice}
                                    onChange={(e) => setForm({...form, purchasePrice: parseFloat(e.target.value) || 0})}
                                    style={styles.input}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            
                            {/* Selling Price */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>💲 Selling Price *</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 50"
                                    value={form.sellingPrice}
                                    onChange={(e) => setForm({...form, sellingPrice: parseFloat(e.target.value) || 0})}
                                    style={styles.input}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* MRP */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>🏷️ MRP *</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 60"
                                    value={form.mrp}
                                    onChange={(e) => setForm({...form, mrp: parseFloat(e.target.value) || 0})}
                                    style={styles.input}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            
                            {/* GST */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>🧾 GST %</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 5"
                                    value={form.gst}
                                    onChange={(e) => setForm({...form, gst: parseFloat(e.target.value) || 0})}
                                    style={styles.input}
                                    min="0"
                                    max="100"
                                />
                            </div>

                            {/* Expiry Date */}
                            <div style={{...styles.fieldGroup, gridColumn: '1 / -1'}}>
                                <label style={styles.label}>📅 Expiry Date *</label>
                                <input
                                    type="date"
                                    value={form.expiryDate}
                                    onChange={(e) => setForm({...form, expiryDate: e.target.value})}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>
                        
                        <button type="submit" style={styles.submitBtn}>
                            {editingId ? '✏️ Update Medicine' : '➕ Add Medicine'}
                        </button>
                    </form>
                </div>
            )}

            <div style={styles.listContainer}>
                {medicines.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No medicines found. Add your first medicine!</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {medicines.map((m) => (
                            <div key={m._id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.medicineName}>{m.name}</h3>
                                    <span style={m.quantity < m.minStock ? styles.badgeLow : styles.badgeInStock}>
                                        {m.quantity < m.minStock ? '⚠️ Low Stock' : '✅ In Stock'}
                                    </span>
                                </div>
                                <div style={styles.cardBody}>
                                    <p><strong>Category:</strong> {m.category}</p>
                                    <p><strong>Batch:</strong> {m.batchNo}</p>
                                    <p><strong>Quantity:</strong> {m.quantity}</p>
                                    <p><strong>Selling Price:</strong> ₹{m.sellingPrice}</p>
                                    <p><strong>MRP:</strong> ₹{m.mrp}</p>
                                    <p><strong>Expiry:</strong> {new Date(m.expiryDate).toLocaleDateString()}</p>
                                </div>
                                <div style={styles.cardFooter}>
                                    <button onClick={() => handleEdit(m)} style={styles.editBtn}>✏️ Edit</button>
                                    <button onClick={() => handleDelete(m._id)} style={styles.deleteBtn}>🗑️ Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        color: 'white'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
    },
    title: {
        margin: 0,
        fontSize: '28px',
        fontWeight: '600'
    },
    addBtn: {
        padding: '10px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    formCard: {
        background: 'rgba(255,255,255,0.05)',
        padding: '25px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '30px'
    },
    formTitle: {
        marginBottom: '18px',
        fontSize: '18px',
        color: 'rgba(255,255,255,0.8)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '2px'
    },
  input: {
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.06)',
        color: 'white',
        outline: 'none',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease'
    },
    
    inputFocus: {
        borderColor: '#667eea',
        background: 'rgba(102,126,234,0.08)'
    },
    
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '4px'
    },
    
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px'
    },
    submitBtn: {
        padding: '12px',
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500'
    },
    listContainer: {
        padding: '5px 0'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '18px',
        transition: 'transform 0.2s'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    },
    medicineName: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: '#a78bfa'
    },
    badgeInStock: {
        background: 'rgba(16,185,129,0.15)',
        color: '#10b981',
        padding: '3px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '500'
    },
    badgeLow: {
        background: 'rgba(239,68,68,0.15)',
        color: '#ef4444',
        padding: '3px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '500'
    },
    cardBody: {
        fontSize: '14px',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '12px'
    },
    cardFooter: {
        display: 'flex',
        gap: '10px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
    },
    editBtn: {
        padding: '6px 16px',
        background: 'rgba(96,165,250,0.2)',
        color: '#60a5fa',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        flex: 1
    },
    deleteBtn: {
        padding: '6px 16px',
        background: 'rgba(239,68,68,0.2)',
        color: '#ef4444',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        flex: 1
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        color: 'white',
        fontSize: '18px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: 'rgba(255,255,255,0.3)'
    }
};

export default MedicineList;