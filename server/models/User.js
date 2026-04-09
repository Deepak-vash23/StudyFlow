import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: [254, 'Email cannot exceed 254 characters'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters'],
        maxlength: [128, 'Password cannot exceed 128 characters']
    },
    // Statistics for dashboard
    stats: {
        totalTasksCreated: {
            type: Number,
            default: 0
        },
        totalTasksCompleted: {
            type: Number,
            default: 0
        },
        totalTasksFailed: {
            type: Number,
            default: 0
        },
        currentStreak: {
            type: Number,
            default: 0
        },
        longestStreak: {
            type: Number,
            default: 0
        },
        lastActiveDate: {
            type: Date
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



const User = mongoose.model('User', userSchema);


export default User;
