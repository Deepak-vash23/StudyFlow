import express from 'express';
import User from '../models/User.js';
import crypto from 'crypto';
import {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateObjectId
} from '../middleware/validators.js';

const router = express.Router();

// Register new user — with validation
router.post('/register', validateRegister, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // $eq wrapper prevents NoSQL operator injection on email lookup
        const existingUser = await User.findOne({ email: { $eq: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            name,
            email,
            password
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
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// Login user — with validation
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // $eq wrapper prevents NoSQL operator injection
        const user = await User.findOne({ email: { $eq: email } });

        if (!user) {
            // Generic message — don't reveal whether email exists
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password with bcrypt
        if (user && (await user.matchPassword(password))) {
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
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Get user stats — with ObjectId validation
router.get('/stats/:userId', ...validateObjectId('userId'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('name email stats');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Failed to fetch user stats' });
    }
});

// Forgot Password — with validation
router.post("/forgot-password", validateForgotPassword, async (req, res) => {
    try {
        const { email } = req.body;

        // $eq wrapper prevents NoSQL operator injection
        const user = await User.findOne({ email: { $eq: email } });
        if (!user) {
            // Don't reveal if user exists — return success-like message regardless
            return res.json({ message: "If an account exists with this email, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

        await user.save();

        const clientUrl = process.env.CLIENT_URL;
        const resetURL = `${clientUrl}/reset-password/${resetToken}`;

        if (!process.env.MAILJET_API || !process.env.MAILJET_SECRET || !process.env.EMAIL) {
            console.error("Missing Mailjet configuration in .env");
            return res.status(500).json({ message: "Server email configuration is missing." });
        }

        const mailjetPayload = {
            "Messages": [
                {
                    "From": { "Email": process.env.EMAIL, "Name": "Flowsy Support" },
                    "To": [{ "Email": user.email, "Name": user.name }],
                    "Subject": "Password Reset Link",
                    "TextPart": `You requested a password reset. Please click the following link to reset your password: \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`,
                    "HTMLPart": `<h3>Password Reset</h3><p>You requested a password reset. Please click the link to reset your password: <br><br> <a href="${resetURL}">Reset Password</a> <br><br> If you did not request this, please ignore this email.</p>`
                }
            ]
        };

        const response = await fetch("https://api.mailjet.com/v3.1/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + Buffer.from(`${process.env.MAILJET_API}:${process.env.MAILJET_SECRET}`).toString('base64')
            },
            body: JSON.stringify(mailjetPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Mailjet API Error:", JSON.stringify(data, null, 2));
            return res.status(500).json({ message: "Failed to send reset email." });
        }

        return res.json({ message: "If an account exists with this email, a reset link has been sent." });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
});

// Reset Password — with validation
router.post("/reset-password/:token", validateResetPassword, async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: { $eq: resetPasswordToken },
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalid or expired" });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Password reset failed. Please try again.' });
    }
});

export default router;
