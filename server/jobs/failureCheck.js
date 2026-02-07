import cron from 'node-cron';
import Task from '../models/Task.js';

const startFailureCheckJob = () => {
    // Run every minute: '*/1 * * * *'
    cron.schedule('*/1 * * * *', async () => {
        console.log('Running Task Failure Check...');

        try {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

            // Get today's date at 00:00:00
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            // Find tasks that obey these conditions:
            // 1. Status is "Pending" or "In Progress"
            // 2. Assigned date is BEFORE today OR (Assigned date IS today AND slotEnd < currentTime)

            const overdueTasks = await Task.find({
                status: { $in: ['Pending', 'In Progress'] },
                $or: [
                    // Case 1: Task was assigned to a past date (and has a date)
                    { assignedDate: { $exists: true, $lt: todayStart } },
                    // Case 2: Task is assigned to today, but time slot has passed
                    {
                        assignedDate: { $gte: todayStart, $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000) },
                        slotEnd: { $exists: true, $lt: currentTimeStr }
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
