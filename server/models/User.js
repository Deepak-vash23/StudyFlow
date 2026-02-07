import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
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
    }
}, {
    timestamps: true
});

// Index for faster email lookups during login
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
