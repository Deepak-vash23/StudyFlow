import { useTasks } from '../context/TaskContext';
import { usePlanner } from '../context/PlannerContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { CheckCircle2, ListTodo, Clock, CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function Dashboard() {
    const { user } = useAuth();
    const { tasks } = useTasks();
    const { getSlotsForDate } = usePlanner();
    const today = format(new Date(), 'yyyy-MM-dd');

    const todaySlots = getSlotsForDate(today);
    const totalSlots = todaySlots.length;
    const completedSlots = todaySlots.filter(s => s.completed).length;
    const progress = totalSlots === 0 ? 0 : Math.round((completedSlots / totalSlots) * 100);

    const pendingTasks = tasks.filter(t => t.status !== 'Completed' && t.type !== 'slot');
    const criticalTasks = pendingTasks.filter(t => t.importance === 'Critical');

    // Find "Most Important" task logic: Critical > High > Deadline Today
    const nextImportantTask = criticalTasks[0] || pendingTasks.find(t => t.importance === 'High') || pendingTasks[0];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-500 mt-1">Here's your productivity overview for today.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-2xl font-bold text-primary-600">{format(new Date(), 'eeee')}</p>
                    <p className="text-gray-400">{format(new Date(), 'MMMM d, yyyy')}</p>
                </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">Daily Progress</h2>
                        <p className="text-primary-100 mb-4 opacity-90">
                            {progress === 100 ? "Amazing! You've completed everything for today. 🎉" :
                                progress > 50 ? "Great job! You're more than halfway there." :
                                    "Keep going! Productivity happens one step at a time."}
                        </p>
                        <div className="w-full bg-black bg-opacity-20 rounded-full h-3">
                            <div
                                className="bg-white rounded-full h-3 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm font-medium opacity-80">
                            <span>{completedSlots} / {totalSlots} Targets</span>
                            <span>{progress}%</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-lg min-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-50 rounded-lg">
                                <Clock className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Next Up</p>
                                <p className="font-bold text-sm text-gray-900">
                                    {todaySlots.find(s => !s.completed)?.label || "Nothing scheduled"}
                                </p>
                            </div>
                        </div>
                        {todaySlots.find(s => !s.completed) && (
                            <div className="text-xs text-gray-500 mt-2 flex justify-between font-medium">
                                <span>{todaySlots.find(s => !s.completed)?.startTime}</span>
                                <span>{todaySlots.find(s => !s.completed)?.endTime}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/tasks" className="bg-blue-200 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white text-blue-700 rounded-lg shadow-md">
                            <ListTodo className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-blue-500 group-hover:text-blue-800 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{pendingTasks.length}</h3>
                    <p className="text-blue-900 font-medium">Pending Tasks</p>
                </Link>

                <Link to="/planner" className="bg-purple-200 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white text-purple-700 rounded-lg shadow-md">
                            <Clock className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-500 group-hover:text-purple-800 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{totalSlots}</h3>
                    <p className="text-purple-900 font-medium">Scheduled Today</p>
                </Link>

                <Link to="/calendar" className="bg-green-200 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white text-green-700 rounded-lg shadow-md">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-green-500 group-hover:text-green-800 transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Check Progress</h3>
                    <p className="text-green-900 font-medium">Monthly View</p>
                </Link>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Important Task */}
                <div className="bg-orange-200 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
                        Top Priority
                    </h3>

                    {nextImportantTask ? (
                        <div className="p-4 bg-white bg-opacity-60 rounded-xl shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-0.5 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full mb-2">
                                        {nextImportantTask.importance}
                                    </span>
                                    <h4 className="text-lg font-bold text-gray-900">{nextImportantTask.title}</h4>
                                    <p className="text-gray-800 text-sm mt-1">{nextImportantTask.description}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 flex justify-between items-center">
                                <span className="text-xs text-orange-800 font-medium flex items-center gap-1">
                                    Due: {nextImportantTask.assignedDate ? format(new Date(nextImportantTask.assignedDate), 'MMM d, yyyy') : "No deadline"}
                                </span>
                                <Link to="/tasks" className="text-sm font-medium text-orange-900 hover:underline">View Details</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-orange-800 opacity-60">
                            <p>No urgent tasks at the moment!</p>
                        </div>
                    )}
                </div>

                {/* Today's Schedule Preview */}
                <div className="bg-pink-200 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-pink-600 rounded-full"></span>
                        Schedule Snapshot
                    </h3>

                    <div className="space-y-3">
                        {todaySlots.slice(0, 3).map(slot => (
                            <div key={slot.id} className="flex items-center gap-3 p-3 bg-white bg-opacity-60 rounded-lg">
                                <span className="text-xs font-bold text-pink-900 w-12 text-right">{slot.startTime}</span>
                                <div className="w-px h-6 bg-pink-400"></div>
                                <span className={clsx("text-sm font-medium text-gray-900", slot.completed && "line-through text-gray-500")}>
                                    {slot.label}
                                </span>
                            </div>
                        ))}
                        {todaySlots.length === 0 && <p className="text-pink-800 opacity-60 text-center py-4">Nothing scheduled yet.</p>}
                        {todaySlots.length > 3 && (
                            <Link to="/planner" className="block text-center text-sm text-pink-900 hover:underline mt-2">
                                View {todaySlots.length - 3} more...
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
