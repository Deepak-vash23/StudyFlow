import 'dotenv/config'; // Load env vars immediately
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import startFailureCheckJob from './jobs/failureCheck.js';
import Task from './models/Task.js';
import authRoutes from './routes/auth.js';
import {
    validateTaskCreate,
    validateTaskUpdate,
    validateTaskQuery,
    validateObjectId,
    pickAllowedFields
} from './middleware/validators.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// ── Payload size limit: prevents DoS via oversized JSON bodies ──
app.use(express.json({ limit: '100kb' }));

// Auth Routes
app.use('/api/auth', authRoutes);

// Routes
// 1. Get All Tasks (with optional filtering)
app.get('/api/tasks', validateTaskQuery, async (req, res) => {
    try {
        const { status, userId } = req.query;
        const query = {};

        // Wrap in $eq to prevent NoSQL operator injection
        if (status) query.status = { $eq: status };
        if (userId) query.userId = { $eq: userId };

        const tasks = await Task.find(query).sort({ assignedDate: 1, slotStart: 1 });
        res.json(tasks);
    } catch (error) {
        console.error('GET /api/tasks error:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

// 2. Get Failed Tasks (Global View)
app.get('/api/tasks/failed', async (req, res) => {
    try {
        const query = { status: 'Failed' };

        const tasks = await Task.find(query)
            .select('title assignedDate importance failureReason')
            .sort({ assignedDate: -1 });

        res.json(tasks);
    } catch (error) {
        console.error('GET /api/tasks/failed error:', error);
        res.status(500).json({ message: 'Failed to fetch failed tasks' });
    }
});

// 3. Create Task — with validation + field whitelisting
app.post('/api/tasks', validateTaskCreate, async (req, res) => {
    try {
        // Only pick allowed fields — prevents mass assignment
        const sanitizedBody = pickAllowedFields(req.body);
        const newTask = new Task(sanitizedBody);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('POST /api/tasks error:', error);
        res.status(400).json({ message: 'Failed to create task. Please check your input.' });
    }
});

// 4. Update Task — with validation + field whitelisting
app.put('/api/tasks/:id', validateTaskUpdate, async (req, res) => {
    try {
        const { id } = req.params;
        // Only pick allowed fields — prevents mass assignment
        const sanitizedBody = pickAllowedFields(req.body);
        const updatedTask = await Task.findByIdAndUpdate(id, sanitizedBody, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('PUT /api/tasks/:id error:', error);
        res.status(400).json({ message: 'Failed to update task. Please check your input.' });
    }
});

// 5. Delete Task — with ObjectId validation
app.delete('/api/tasks/:id', ...validateObjectId('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('DELETE /api/tasks/:id error:', error);
        res.status(500).json({ message: 'Failed to delete task' });
    }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*all', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        // Start Scheduler after DB connection
        startFailureCheckJob();
        console.log('Failure Check Scheduler Started');
    })
    .catch(err => {
        console.error('MongoDB Connection Error. Please ensure Network Access is set to 0.0.0.0/0 in MongoDB Atlas:', err);
    });
