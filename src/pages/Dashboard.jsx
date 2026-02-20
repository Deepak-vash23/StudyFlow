import { useTasks } from '../context/TaskContext';
import { usePlanner } from '../context/PlannerContext';
import { useAuth } from '../context/AuthContext';
import { format, subDays, isSameDay } from 'date-fns';
import { CheckCircle2, ListTodo, Clock, CalendarDays, ArrowRight, AlertCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import clsx from 'clsx';

export default function Dashboard() {
    const { user } = useAuth();
    const { tasks } = useTasks();
    const { getSlotsForDate } = usePlanner();
    const today = format(new Date(), 'yyyy-MM-dd');

    const todaySlots = getSlotsForDate(today);
    const totalSlots = todaySlots.length;
    // const completedSlots = todaySlots.filter(s => s.completed).length; // Unused
    const failedSlots = todaySlots.filter(s => !s.completed && new Date(s.endTime) < new Date()).length;

    // Calculate daily stats (robust)
    // 1. Helper to check if a task "belongs" to today (either assigned today or completed today)
    const isForToday = (t) => {
        if (!t.assignedDate) return false;
        // Handle ISO strings from Mongo
        return t.assignedDate.startsWith(today) || format(new Date(t.assignedDate), 'yyyy-MM-dd') === today;
    };

    // 2. Completed Tasks: Anything marked 'Completed' that was assigned today OR completed today (if we had timestamp)
    // For now, we trust assignedDate matching today.
    // We also want to include "Slots" which are just tasks with time.

    // Filter tasks that are relevant for today's view
    const todayItems = tasks.filter(t => isForToday(t));

    // Total: Assigned today + Pending tasks without date (Backlog visible)
    // However, for "Completion Rate", meaningful denominator is "Planned for Today".
    // Let's use: (Completed Today) / (Total Assigned Today)

    // Filter items that are definitely Plans/Slots
    const todayPlans = todayItems.filter(t => t.slotStart && t.slotEnd);
    const totalPlansToday = todayPlans.length;
    const completedPlansToday = todayPlans.filter(t => t.status === 'Completed').length;

    // Keep total assigned for legacy usage if needed, or just use todayItems.length
    const totalAssignedToday = todayItems.length;

    // We also show "Total Tasks" card which traditionally included backlog.
    // Let's keep that card count as "Active Workload"
    // 3. Total Tasks (Non-Plan tasks)
    // Filter out plans from "Total Tasks" count
    const isPlan = t => t.slotStart && t.slotEnd;

    // Regular tasks assigned today (no slots)
    const todayRegularTasks = todayItems.filter(t => !isPlan(t));

    // Backlog tasks (no date, no slots)
    const backlogTasks = tasks.filter(t => !t.assignedDate && t.status !== 'Completed' && !isPlan(t));

    // Usage: "Total Tasks" = Today's Regular + Backlog Regular
    const totalTasksTodayDisplay = todayRegularTasks.length + backlogTasks.length;

    // Pending Regular Tasks for count
    const pendingRegularTasksCount = todayRegularTasks.filter(t => t.status !== 'Completed').length + backlogTasks.length;

    // Global pending for other uses
    const pendingTasks = tasks.filter(t => t.status !== 'Completed');

    const criticalTasks = pendingTasks.filter(t => t.importance === 'Critical');
    const nextImportantTask = criticalTasks[0] || pendingTasks.find(t => t.importance === 'High') || pendingTasks[0];

    // Weekly Stats Logic
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');

        // Find tasks for this date
        const dayTasks = tasks.filter(t => t.assignedDate === dateStr);
        const daySlots = getSlotsForDate(dateStr);

        if (daySlots.length > 0) {
            const completed = daySlots.filter(s => s.completed).length;
            return {
                day: format(date, 'EEE'), // M, T, W...
                completion: Math.round((completed / daySlots.length) * 100)
            };
        }

        // Fallback to tasks if no slots
        if (dayTasks.length > 0) {
            const completed = dayTasks.filter(t => t.status === 'Completed').length;
            return {
                day: format(date, 'EEE'),
                completion: Math.round((completed / dayTasks.length) * 100)
            };
        }

        return { day: format(date, 'EEE'), completion: 0 };
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.name.split(' ')[0]}. Here is your daily overview.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-xl font-bold text-primary-400">{format(new Date(), 'eeee')}</p>
                    <p className="text-gray-500 text-sm">{format(new Date(), 'MMMM d, yyyy')}</p>
                </div>
            </div>

            {/* Section 1: Summary Cards (3 equal columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col justify-between h-32 hover:border-primary-500/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Tasks</p>
                            <h3 className="text-3xl font-bold text-gray-100 mt-1">{totalTasksTodayDisplay}</h3>
                        </div>
                        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                            <ListTodo className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-auto">
                        <span className="text-primary-400 font-medium">{pendingRegularTasksCount}</span> pending
                    </div>
                </Card>

                <Card className="flex flex-col justify-between h-32 hover:border-success/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Completed Plans</p>
                            <h3 className="text-3xl font-bold text-gray-100 mt-1">{completedPlansToday}</h3>
                        </div>
                        <div className="p-2 bg-success/10 rounded-lg text-success">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-auto">
                        <span className="text-success font-medium">
                            {totalPlansToday > 0 ? Math.round((completedPlansToday / totalPlansToday) * 100) : 0}%
                        </span> completion rate
                    </div>
                </Card>

                <Card className="flex flex-col justify-between h-32 hover:border-error/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Failed / Overdue</p>
                            <h3 className="text-3xl font-bold text-gray-100 mt-1">{failedSlots}</h3>
                        </div>
                        <div className="p-2 bg-error/10 rounded-lg text-error">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-auto">
                        <span className="text-error font-medium">Action required</span>
                    </div>
                </Card>
            </div>

            {/* Section 2: Time Slots & Priority (2 column grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule (Time Slots) */}
                <Card className="h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-400" />
                            Time Slots
                        </h3>
                        <Link to="/planner" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                            View Planner
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {todaySlots.slice(0, 4).map((slot, index) => (
                            <div key={slot.id || index} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                                <div className="flex flex-col items-end min-w-[60px]">
                                    <span className="text-sm font-bold text-gray-200">{slot.startTime}</span>
                                    <span className="text-xs text-gray-500">{slot.endTime}</span>
                                </div>
                                <div className={clsx("w-1 h-10 rounded-full", slot.completed ? "bg-success" : "bg-primary-500")}></div>
                                <div className="flex-1">
                                    <p className={clsx("text-sm font-medium", slot.completed ? "text-gray-500 line-through" : "text-gray-200")}>
                                        {slot.label || "Untitled Slot"}
                                    </p>
                                    <Badge type={slot.completed ? 'success' : 'neutral'} className="mt-1">
                                        {slot.completed ? 'Completed' : 'Scheduled'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {todaySlots.length === 0 && (
                            <div className="text-center py-10 text-gray-500 text-sm">
                                <p>No time slots scheduled for today.</p>
                                <Link to="/planner" className="text-primary-400 hover:underline mt-2 inline-block">Plan your day</Link>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Top Priority Task */}
                <Card className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-warning" />
                            Top Priority
                        </h3>
                        <Link to="/tasks" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                            View All Tasks
                        </Link>
                    </div>

                    {nextImportantTask ? (
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge type={nextImportantTask.importance}>{nextImportantTask.importance}</Badge>
                                    {nextImportantTask.assignedDate && (
                                        <span className="text-xs text-gray-400">Due: {format(new Date(nextImportantTask.assignedDate), 'MMM d')}</span>
                                    )}
                                </div>
                                <h4 className="text-xl font-bold text-gray-100 mb-2">{nextImportantTask.title}</h4>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6">{nextImportantTask.description || "No description provided."}</p>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors">
                                        Complete
                                    </button>
                                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs text-gray-500 text-center">
                                    {nextImportantTask.importance === 'Critical' || nextImportantTask.importance === 'High'
                                        ? "⚠️ This task will auto-fail if not completed by end of day."
                                        : "Stay consistent! Finish this to keep your streak."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                            <CheckCircle2 className="w-12 h-12 text-gray-700/50 mb-3" />
                            <p>No urgent tasks remaining.</p>
                            <p className="text-xs mt-1">Enjoy your free time!</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Section 3: Analytics (3 column grid - or maybe just a full width chart section based on text "Below that: Weekly completion chart") */}
            {/* The prompt says "Below that: Weekly completion chart, Calendar view". Let's use a grid for this. */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary-400" />
                            Weekly Activity
                        </h3>
                    </div>
                    {/* Real Weekly Chart */}
                    <div className="h-48 flex items-end justify-between gap-2 px-4">
                        {weeklyStats.map((stat, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-white/5 rounded-t-lg relative overflow-hidden h-full flex items-end">
                                    <div
                                        className="w-full bg-primary-600/50 group-hover:bg-primary-500/80 transition-all duration-500 rounded-t-sm"
                                        style={{ height: `${stat.completion}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 uppercase">
                                    {stat.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-primary-400" />
                            Calendar
                        </h3>
                        <Link to="/calendar" className="text-xs text-primary-400 hover:text-primary-300">Open</Link>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-gray-500">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {Array.from({ length: 30 }, (_, i) => {
                            const isToday = i + 1 === new Date().getDate();
                            const status = Math.random() > 0.7 ? 'fail' : Math.random() > 0.3 ? 'success' : 'neutral'; // Mock status
                            return (
                                <div key={i} className={clsx(
                                    "aspect-square rounded-full flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-white/10 transition-colors",
                                    isToday ? "bg-primary-600 text-white" : "text-gray-400",
                                    !isToday && status === 'success' && "text-gray-200 relative after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-success after:rounded-full",
                                    !isToday && status === 'fail' && "text-gray-200 relative after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-error after:rounded-full"
                                )}>
                                    {i + 1}
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}
