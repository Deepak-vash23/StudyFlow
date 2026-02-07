import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user (Note: In production, hash the password with bcrypt)
        const user = new User({
            name,
            email,
            password // WARNING: Store hashed password in production!
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        console.log(`Login attempt for: ${email}`);

        if (!user) {
            console.log('User not found in DB');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log(`User found. stored pass: ${user.password}, provided pass: ${password}`);

        // Check password (Note: In production, use bcrypt.compare)
        if (user.password !== password) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last active date
        user.stats.lastActiveDate = new Date();
        await user.save();

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                stats: user.stats
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user stats
router.get('/stats/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('name email stats');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
