import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        age: '',
        gender: 'Male'
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await api.get('/patients');
            setPatients(res.data.data || []);
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
                await api.put(`/patients/${editingId}`, form);
            } else {
                await api.post('/patients', form);
            }
            setForm({
                name: '',
                phone: '',
                email: '',
                address: '',
                age: '',
                gender: 'Male'
            });
            setEditingId(null);
            setShowForm(false);
            fetchPatients();
            alert(editingId ? '✅ Patient updated!' : '✅ Patient added!');
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Failed to save patient');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await api.delete(`/patients/${id}`);
                fetchPatients();
                alert('✅ Patient deleted!');
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Failed to delete patient');
            }
        }
    };

    const handleEdit = (patient) => {
        setForm({
            name: patient.name,
            phone: patient.phone,
            email: patient.email || '',
            address: patient.address || '',
            age: patient.age || '',
            gender: patient.gender || 'Male'
        });
        setEditingId(patient._id);
        setShowForm(true);
    };

    if (loading) {
        return <div style={styles.loading}>Loading patients...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>👤 Patients</h2>
                <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
                    {showForm ? '✕ Cancel' : '➕ Add Patient'}
                </button>
            </div>

            {showForm && (
                <div style={styles.formCard}>
                    <h3>{editingId ? '✏️ Edit Patient' : '➕ Add New Patient'}</h3>
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
                            placeholder="Phone *"
                            value={form.phone}
                            onChange={(e) => setForm({...form, phone: e.target.value})}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={form.address}
                            onChange={(e) => setForm({...form, address: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={form.age}
                            onChange={(e) => setForm({...form, age: e.target.value})}
                        />
                        <select
                            value={form.gender}
                            onChange={(e) => setForm({...form, gender: e.target.value})}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                    </form>
                </div>
            )}

            <div style={styles.listContainer}>
                {patients.length === 0 ? (
                    <p>No patients found</p>
                ) : (
                    patients.map((p) => (
                        <div key={p._id} style={styles.card}>
                            <h3>{p.name}</h3>
                            <p>Phone: {p.phone}</p>
                            <p>Age: {p.age}</p>
                            <p>Gender: {p.gender}</p>
                            <button onClick={() => handleEdit(p)}>✏️ Edit</button>
                            <button onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
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

export default Patients;