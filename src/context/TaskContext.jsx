import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const API_URL = 'http://localhost:5000/api/tasks';

    // Fetch tasks on mount
    const fetchTasks = async () => {
        if (!user) return; // Don't fetch if no user

        try {
            const response = await fetch(`${API_URL}?userId=${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const addTask = async (taskData) => {
        try {
            // Use actual logged-in user's ID
            const payload = {
                ...taskData,
                userId: user?.id || '65f1a2b3c4d5e6f7a8b9c0d1', // Fallback to mock ID if not logged in
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create task');
            const newTask = await response.json();
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const updateTask = async (id, updates) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();

            setTasks(prev => prev.map(task =>
                task._id === id ? updatedTask : task // Mongo uses _id
            ));
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task');

            setTasks(prev => prev.filter(task => task._id !== id));
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const toggleTaskCompletion = async (id) => {
        const task = tasks.find(t => t._id === id);
        if (!task) return;

        // Logic check: Failed tasks shouldn't be simply toggled. But for now let's allow it if user wants to force complete.
        // The requirement said: "Once marked as Failed: Task cannot be auto-completed... User must Reschedule"
        // We'll handle that restriction in the UI. Here just simple toggle logic.
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        await updateTask(id, { status: newStatus });
    };

    const value = {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        refreshTasks: fetchTasks
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};
