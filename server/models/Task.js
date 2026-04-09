import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        enum: ['Study', 'Work', 'Household', 'Personal'],
        default: 'Study'
    },
    importance: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    assignedDate: {
        type: Date
    },
    estimatedTime: {
        type: Number,
        min: [0, 'Estimated time cannot be negative'],
        max: [9999, 'Estimated time cannot exceed 9999']
    },
    estimatedTimeUnit: {
        type: String,
        enum: ['mins', 'hrs'],
        default: 'mins'
    },
    slotStart: {
        type: String, // HH:mm format
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Slot start must be in HH:mm format']
    },
    slotEnd: {
        type: String, // HH:mm format
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Slot end must be in HH:mm format']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Failed'],
        default: 'Pending',
        index: true
    },
    type: {
        type: String,
        default: 'task',
        enum: ['task', 'slot']
    },
    failureReason: {
        type: String,
        trim: true,
        maxlength: [500, 'Failure reason cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Compound index for the main query: Get failed tasks for a user, sorted by date
taskSchema.index({ userId: 1, status: 1, assignedDate: -1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
