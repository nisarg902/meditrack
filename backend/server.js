const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const billRoutes = require('./routes/bill.routes');

require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const medicineRoutes = require('./routes/medicine.routes');
const patientRoutes = require('./routes/patient.routes');

const app = express();

// Middleware
app.use('/api/bills', billRoutes);

app.use(cors());
app.use(express.json());
require('dotenv').config();  // ✅ Yeh line honi chahiye!

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/patients', patientRoutes);

// Home Route
app.get('/', (req, res) => {
    res.send('🚀 MediTrack API is running!');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));