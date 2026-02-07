import { createContext, useContext, useState, useEffect } from 'react';
import { useTasks } from './TaskContext';
import { format } from 'date-fns';

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

export const PlannerProvider = ({ children }) => {
    // The Backend now stores "Slots" as properties on a Task.
    // So "Planner" is really just a view of Tasks for a specific date.
    // We keep this context to maintain API compatibility for the Planner Page,
    // but internally it proxies to useTasks.

    const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();

    // Mapping function: Task (Backend) -> Slot (Frontend shape)
    // Backend: { _id, title, startSlot, endSlot, status, ... }
    // Frontend Slot expected: { id, startTime, endTime, label, completed... }

    const getSlotsForDate = (dateString) => {
        // dateString is yyyy-MM-dd
        // Filter tasks where assignedDate matches
        const now = new Date();
        const currentDateStr = format(now, 'yyyy-MM-dd');
        const currentTimeStr = format(now, 'HH:mm');

        return tasks.filter(task => {
            // Skip tasks without assignedDate (backlog tasks)
            if (!task.assignedDate) return false;

            const taskDate = new Date(task.assignedDate).toISOString().split('T')[0];
            return taskDate === dateString;
        }).map(task => {
            const taskDate = new Date(task.assignedDate).toISOString().split('T')[0];

            // Check if expired
            let isExpired = false;
            if (taskDate < currentDateStr) {
                isExpired = true;
            } else if (taskDate === currentDateStr) {
                if (task.slotEnd < currentTimeStr) {
                    isExpired = true;
                }
            }

            // A slot is failed if backend says so OR if it is expired and not completed
            const isFailed = task.status === 'Failed' || (isExpired && task.status !== 'Completed');

            return {
                id: task._id,
                startTime: task.slotStart,
                endTime: task.slotEnd,
                label: task.title,
                completed: task.status === 'Completed',
                failed: isFailed,
                taskId: task._id,
                ...task
            };
        }).sort((a, b) => {
            // Safe sort with fallback
            if (!a.startTime || !b.startTime) return 0;
            return a.startTime.localeCompare(b.startTime);
        });
    };

    const addSlot = async (slotData) => {
        // Planner "Add Slot" is now just "Create Task" with time-bound fields
        // slotData: { date, startTime, endTime, label, taskId (optional) }

        const payload = {
            title: slotData.label || 'Untitled Slot',
            assignedDate: slotData.date,
            slotStart: slotData.startTime,
            slotEnd: slotData.endTime,
            category: 'Study', // Default
            description: '',
            status: 'Pending',
            type: 'slot'
        };

        await addTask(payload);
    };

    const updateSlot = async (id, updates) => {
        // Map frontend slot updates to backend task updates
        const payload = {};
        if (updates.label) payload.title = updates.label;
        if (updates.startTime) payload.slotStart = updates.startTime;
        if (updates.endTime) payload.slotEnd = updates.endTime;
        if (updates.completed !== undefined) {
            payload.status = updates.completed ? 'Completed' : 'Pending';
        }

        await updateTask(id, payload);
    };

    const deleteSlot = async (id) => {
        await deleteTask(id);
    };

    const toggleSlotCompletion = async (id) => {
        await toggleTaskCompletion(id);
    };

    const value = {
        slots: [], // No local state anymore
        addSlot,
        updateSlot,
        deleteSlot,
        toggleSlotCompletion,
        getSlotsForDate
    };

    return (
        <PlannerContext.Provider value={value}>
            {children}
        </PlannerContext.Provider>
    );
};
