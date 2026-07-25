const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'my_secret_key_12345',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'my_secret_key_12345',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};