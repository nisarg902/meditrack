import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/register', { name, email, password });
            
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>📝 Create Account</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <p style={styles.footer}>
                    Already have an account?{' '}
                    <span style={styles.link} onClick={() => navigate('/login')}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    },
    card: {
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '20px',
        width: '380px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.12)'
    },
    heading: { color: 'white', marginBottom: '30px' },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.06)',
        color: 'white',
        outline: 'none'
    },
    button: {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px'
    },
    error: { color: '#ef4444', marginBottom: '15px' },
    footer: { color: 'rgba(255,255,255,0.6)', marginTop: '20px' },
    link: { color: '#a78bfa', cursor: 'pointer', fontWeight: '500' }
};

export default Register;