import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import MedicineList from './components/MedicineList';
import Patients from './components/Patients';
import Bills from './components/Bills';  // ✅ Import Bills

function App() {
    const token = localStorage.getItem('token');

    if (!token) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <div style={styles.app}>
                <Sidebar />
                <div style={styles.content}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/medicines" element={<MedicineList />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/bills" element={<Bills />} />  {/* ✅ Bills Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

const styles = {
    app: {
        display: 'flex',
        minHeight: '100vh'
    },
    content: {
        marginLeft: '250px',
        flex: 1,
        padding: '20px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        minHeight: '100vh'
    }
};

export default App;