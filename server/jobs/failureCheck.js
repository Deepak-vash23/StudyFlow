import cron from 'node-cron';
import Task from '../models/Task.js';

const startFailureCheckJob = () => {
    // Run every minute: '*/1 * * * *'
    cron.schedule('*/1 * * * *', async () => {
        console.log('Running Task Failure Check...');

        try {
            const now = new Date();
            const currentHours = now.getHours();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            // ONLY run this logic if it is past 11:00 PM (23:00)
            if (currentHours < 23) {
                console.log('Not yet 11 PM. Skipping failure check.');
                return;
            }

            // Find tasks that obey these conditions:
            // 1. Status is "Pending" or "In Progress"
            // 2. Assigned date is BEFORE today OR (Assigned date IS today)
            // Basically, if it's 11 PM and the task is still Pending/In Progress on the Assigned Date, it's failed.

            const overdueTasks = await Task.find({
                status: { $in: ['Pending', 'In Progress'] },
                // importance: { $in: ['High', 'Critical'] }, // REMOVED: Fail ALL tasks
                $or: [
                    // Case 1: Task was assigned to a past date (and has a date)
                    { assignedDate: { $exists: true, $lt: todayStart } },
                    // Case 2: Task is assigned to today (and we are past 23:00)
                    {
                        assignedDate: { $gte: todayStart, $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000) }
                    }
                ]
            });

            if (overdueTasks.length > 0) {
                const ids = overdueTasks.map(t => t._id);

                await Task.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: {
                            status: 'Failed',
                            failureReason: 'Time Slot Exceeded'
                        }
                    }
                );

                console.log(`Updated ${overdueTasks.length} tasks to Failed status.`);
            } else {
                console.log('No overdue tasks found.');
            }

        } catch (error) {
            console.error('Error in Failure Check Job:', error);
        }
    });
};

export default startFailureCheckJob;
