import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref: 'User' // If we had a User model
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
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
        // required: false - Allow tasks to be in "Backlog" without a specific date
    },
    estimatedTime: {
        type: Number
    },
    estimatedTimeUnit: {
        type: String,
        enum: ['mins', 'hrs'],
        default: 'mins'
    },
    slotStart: {
        type: String // HH:mm format
    },
    slotEnd: {
        type: String // HH:mm format
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Failed'],
        default: 'Pending',
        index: true // Optimizing queries on status
    },
    type: {
        type: String, // 'task' or 'slot'
        default: 'task',
        enum: ['task', 'slot']
    },
    failureReason: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index for the main query: Get failed tasks for a user, sorted by date
taskSchema.index({ userId: 1, status: 1, assignedDate: -1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
