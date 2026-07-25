import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();

    const links = [
        { to: '/', icon: '📊', label: 'Dashboard' },
        { to: '/medicines', icon: '💊', label: 'Medicines' },
        { to: '/patients', icon: '👤', label: 'Patients' },
          { to: '/bills', icon: '🧾', label: 'Bills' }
    ];

    return (
        <div style={styles.sidebar}>
            <div style={styles.logo}>
                <span style={styles.logoIcon}>🏥</span>
                <span style={styles.logoText}>MediTrack</span>
            </div>

            <nav style={styles.nav}>
                {links.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            style={{
                                ...styles.link,
                                ...(isActive ? styles.activeLink : {})
                            }}
                        >
                            <span>{link.icon}</span> {link.label}
                        </Link>
                    );
                })}
            </nav>

            <button style={styles.logoutBtn} onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }}>
                🚪 Logout
            </button>
        </div>
    );
}

const styles = {
    sidebar: {
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#1a1a2e',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 1000
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingBottom: '20px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    },
    logoIcon: { fontSize: '28px' },
    logoText: { fontSize: '22px', fontWeight: 'bold', color: 'white' },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        color: 'rgba(255,255,255,0.6)',
        textDecoration: 'none',
        borderRadius: '8px',
        transition: 'all 0.2s'
    },
    activeLink: {
        background: 'rgba(102, 126, 234, 0.15)',
        color: '#667eea'
    },
    logoutBtn: {
        padding: '12px 16px',
        background: 'rgba(239,68,68,0.15)',
        color: '#ef4444',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        transition: 'all 0.2s',
        marginTop: '10px'
    }
};

export default Sidebar;