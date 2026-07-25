import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
    const [medicines, setMedicines] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [medRes, patientRes] = await Promise.all([
                api.get('/medicines'),
                api.get('/patients')
            ]);

            setMedicines(medRes.data?.data || []);
            setPatients(patientRes.data?.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const totalMedicines = medicines.length;
    const lowStockMedicines = medicines.filter(m => m.quantity < 10).length;
    const totalPatients = patients.length;
    const totalRevenue = medicines.reduce((sum, m) => sum + (m.sellingPrice * m.quantity), 0);

    if (loading) {
        return <div style={styles.loading}>Loading Dashboard...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📊 Dashboard</h2>
            
            <div style={styles.grid}>
                {/* 💊 Medicines Card */}
                <div style={{...styles.card, ...styles.cardPurple}}>
                    <div style={styles.cardIcon}>💊</div>
                    <h3 style={styles.cardTitle}>Medicines</h3>
                    <p style={styles.number}>{totalMedicines}</p>
                    <small style={styles.cardSmall}>
                        {lowStockMedicines > 0 ? `⚠️ ${lowStockMedicines} low stock` : '✅ All in stock'}
                    </small>
                </div>
                
                {/* 👤 Patients Card */}
                <div style={{...styles.card, ...styles.cardBlue}}>
                    <div style={styles.cardIcon}>👤</div>
                    <h3 style={styles.cardTitle}>Patients</h3>
                    <p style={styles.number}>{totalPatients}</p>
                    <small style={styles.cardSmall}>Total registered patients</small>
                </div>
                
                {/* 💰 Revenue Card */}
                <div style={{...styles.card, ...styles.cardGold}}>
                    <div style={styles.cardIcon}>💰</div>
                    <h3 style={styles.cardTitle}>Revenue</h3>
                    <p style={styles.number}>₹{totalRevenue}</p>
                    <small style={styles.cardSmall}>Total stock value</small>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        color: 'white',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    title: {
        marginBottom: '25px',
        fontSize: '28px',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px'
    },
    card: {
        padding: '25px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)'
    },
    cardPurple: {
        background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(139,92,246,0.05))',
        borderColor: 'rgba(167,139,250,0.3)'
    },
    cardBlue: {
        background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(59,130,246,0.05))',
        borderColor: 'rgba(96,165,250,0.3)'
    },
    cardGold: {
        background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.05))',
        borderColor: 'rgba(251,191,36,0.3)'
    },
    cardIcon: { fontSize: '40px', marginBottom: '8px', display: 'block' },
    cardTitle: {
        margin: '8px 0 4px 0',
        fontSize: '14px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    number: { fontSize: '36px', fontWeight: '700', margin: '5px 0', color: 'white' },
    cardSmall: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '5px' },
    loading: { textAlign: 'center', padding: '50px', color: 'white', fontSize: '18px' }
};

export default Dashboard;