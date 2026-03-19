import express from 'express';
import User from '../models/User.js';
import crypto from 'crypto';

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
        // Check password
        if (user && (await user.matchPassword(password))) {
            // Updated last active date
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
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid email or password' });
        }



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

// Forgot Password - Send Reset Link
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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

        console.log("Reset Link:", resetURL);

        if (!process.env.MAILJET_API || !process.env.MAILJET_SECRET || !process.env.EMAIL) {
            console.error("Missing Mailjet configuration in .env");
            return res.status(500).json({ message: "Server email configuration is missing." });
        }

        const mailjetPayload = {
            "Messages": [
                {
                    "From": { "Email": process.env.EMAIL, "Name": "StudyFlow Support" },
                    "To": [{ "Email": user.email, "Name": user.name }],
                    "Subject": "Password Reset Link",
                    "TextPart": `You requested a password reset. Please click the following link to reset your password: \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`,
                    "HTMLPart": `<h3>Password Reset</h3><p>You requested a password reset. Please click the link to reset your password: <br><br> <a href="${resetURL}">Reset Password</a> <br><br> If you did not request this, please ignore this email.</p>`
                    // If you want to use a Mailjet Template later, you can remove Subject/TextPart/HTMLPart and use:
                    // "TemplateID": 123456,
                    // "TemplateLanguage": true,
                    // "Variables": { "resetLink": resetURL, "firstname": user.name }
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
            return res.status(500).json({ message: "Failed to send reset email via Mailjet API." });
        }

        console.log("Email sent successfully via Mailjet fetch API");
        return res.json({ message: "Reset link sent to email" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
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
        res.status(500).json({ message: error.message });
    }
});

export default router;
