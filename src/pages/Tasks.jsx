import { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import { Plus, Filter, CheckCircle2, Circle, Trash2, Edit2, Clock, AlertTriangle, XCircle, ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import clsx from 'clsx';
import { format, addDays, subDays, isSameDay, parseISO, startOfToday } from 'date-fns';

const GlassDropdown = ({ value, options, onChange, label, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-32 md:w-40 px-3 py-2 text-sm font-medium text-gray-700 bg-white/50 border border-white/30 rounded-lg shadow-sm hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 backdrop-blur-sm transition-all"
            >
                <div className="flex items-center gap-2 truncate">
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                    <span className="truncate">{value === 'All' ? label : value}</span>
                </div>
                <ChevronDown className={clsx("w-4 h-4 ml-2 transition-transform", isOpen && "transform rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-full origin-top-right bg-white/80 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    "block w-full text-left px-4 py-2 text-sm transition-colors",
                                    value === option
                                        ? "bg-primary-50/50 text-primary-700 font-medium"
                                        : "text-gray-700 hover:bg-white/50 hover:text-gray-900"
                                )}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Tasks() {
    const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState({ category: 'All', importance: 'All', status: 'All' });
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleCreate = (data) => {
        addTask(data);
    };

    const handleUpdate = (data) => {
        if (editingTask) {
            updateTask(editingTask._id, data);
            setEditingTask(null);
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const filteredTasks = tasks.filter(task => {
        if (task.type === 'slot') return false; // Hide planner slots from main task list

        // Filter by Date
        const dateToCheck = task.assignedDate || task.createdAt;
        if (dateToCheck) {
            const taskDate = new Date(dateToCheck);
            if (!isSameDay(taskDate, selectedDate)) return false;
        } else {
            // If absolutely no date, show on Today or hide? 
            // Let's hide to avoid clutter, or maybe they belong to "Backlog"
            return false;
        }

        if (filter.category !== 'All' && task.category !== filter.category) return false;
        if (filter.importance !== 'All' && task.importance !== filter.importance) return false;
        if (filter.status !== 'All') {
            if (filter.status === 'Completed' && task.status !== 'Completed') return false;
            if (filter.status === 'Pending' && task.status !== 'Pending') return false;
            if (filter.status === 'Failed' && task.status !== 'Failed') return false;
        }
        return true;
    });

    const getImportanceColor = (level) => {
        switch (level) {
            case 'Low': return 'bg-green-100 text-green-800 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Study': return 'text-blue-600 bg-blue-50';
            case 'Work': return 'text-purple-600 bg-purple-50';
            case 'Household': return 'text-green-600 bg-green-50';
            case 'Personal': return 'text-pink-600 bg-pink-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-gray-500">Manage and organize your daily work</p>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl p-1 rounded-xl border border-white/20 shadow-sm order-last sm:order-none">
                    <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="font-medium text-gray-700 min-w-[140px] text-center flex items-center justify-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        {format(selectedDate, 'EEE, MMM d')}
                    </span>
                    <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <button
                    onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Task</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/20 flex flex-wrap gap-4 items-center transition-all hover:bg-white/80 relative z-20">
                <div className="flex items-center gap-2 text-gray-700 mr-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/30">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-semibold">Filters</span>
                </div>

                <GlassDropdown
                    label="Category"
                    value={filter.category}
                    options={['All', 'Study', 'Work', 'Household', 'Personal']}
                    onChange={(val) => setFilter({ ...filter, category: val })}
                />

                <GlassDropdown
                    label="Importance"
                    value={filter.importance}
                    options={['All', 'Low', 'Medium', 'High', 'Critical']}
                    onChange={(val) => setFilter({ ...filter, importance: val })}
                />

                <GlassDropdown
                    label="Status"
                    value={filter.status}
                    options={['All', 'Pending', 'Completed', 'Failed']}
                    onChange={(val) => setFilter({ ...filter, status: val })}
                />
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <p>No tasks found for {format(selectedDate, 'MMM d')}. Create one to get started!</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task._id} className={clsx("group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all border border-white/20 overflow-hidden flex flex-col hover:bg-white/80",
                            task.status === 'Completed' && "opacity-75",
                            task.status === 'Failed' && "border-gray-200/50 bg-gray-100/80"
                        )}>
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm", getImportanceColor(task.importance))}>
                                        {task.importance}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(task)} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-md hover:bg-white/50">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteTask(task._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-white/50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className={clsx("text-lg font-semibold text-gray-900 mb-1", task.status === 'Completed' && "line-through text-gray-500", task.status === 'Failed' && "text-gray-500 line-through")}>
                                    {task.title}
                                </h3>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 font-medium">
                                    {task.description}
                                </p>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className={clsx("text-xs font-medium px-2 py-1 rounded-md border border-black/5", getCategoryColor(task.category))}>
                                        {task.category}
                                    </span>
                                    {task.estimatedTime && (
                                        <span className="flex items-center text-xs text-gray-500 gap-1 bg-white/50 px-2 py-1 rounded-md border border-white/20">
                                            <Clock className="w-3 h-3" />
                                            {task.estimatedTime}{task.estimatedTimeUnit === 'hrs' ? 'h' : 'm'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-white/70 border-t border-white/20 flex items-center justify-between backdrop-blur-sm">
                                {task.assignedDate ? (
                                    <span className={clsx("text-xs flex items-center gap-1",
                                        new Date(task.assignedDate) < new Date(new Date().setHours(0, 0, 0, 0)) && task.status !== 'Completed' ? "text-red-600 font-bold" : "text-gray-600 font-medium"
                                    )}>
                                        <CalendarIcon className="w-3 h-3" />
                                        {format(new Date(task.assignedDate), 'MMM d')}
                                    </span>
                                ) : (
                                    <span></span>
                                )}

                                <button
                                    onClick={() => toggleTaskCompletion(task._id)}
                                    disabled={task.status === 'Failed'}
                                    className={clsx("flex items-center gap-1.5 text-sm font-bold transition-colors",
                                        task.status === 'Completed' ? "text-green-600 hover:text-green-700" : "text-gray-500 hover:text-gray-800",
                                        task.status === 'Failed' && "text-red-500 cursor-not-allowed opacity-75 hover:text-red-500"
                                    )}
                                >
                                    {task.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : task.status === 'Failed' ? <XCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    {task.status === 'Completed' ? "Done" : task.status === 'Failed' ? "Failed" : "Mark Done"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <TaskForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialData={editingTask}
                selectedDate={selectedDate}
            />
        </div>
    );
}
