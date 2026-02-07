import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import startFailureCheckJob from './jobs/failureCheck.js';
import Task from './models/Task.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);

// Routes
// 1. Get All Tasks (with optional filtering)
app.get('/api/tasks', async (req, res) => {
    try {
        const { status, userId } = req.query;
        const query = {};
        if (status) query.status = status;
        if (userId) query.userId = userId;

        const tasks = await Task.find(query).sort({ assignedDate: 1, slotStart: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Get Failed Tasks (Global View)
app.get('/api/tasks/failed', async (req, res) => {
    try {
        const query = { status: 'Failed' };
        // If we had auth middleware, we would add: query.userId = req.user.id

        const tasks = await Task.find(query)
            .select('title assignedDate importance failureReason') // Optimized select as requested
            .sort({ assignedDate: -1 }); // Newest first

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Create Task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. Update Task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        // Start Scheduler after DB connection
        startFailureCheckJob();
        console.log('Failure Check Scheduler Started');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
    });
