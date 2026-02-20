import { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import { Plus, Filter, CheckCircle2, Circle, Trash2, Edit2, Clock, AlertTriangle, XCircle, ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import clsx from 'clsx';
import { format, addDays, subDays, isSameDay, parseISO, startOfToday } from 'date-fns';
import Card from '../components/Card';
import Badge from '../components/Badge';

const ModularDropdown = ({ value, options, onChange, label, icon: Icon }) => {
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
                className="flex items-center justify-between min-w-[140px] px-3 py-2 text-sm font-medium text-gray-300 bg-card border border-white/5 rounded-xl shadow-sm hover:bg-white/5 hover:text-gray-100 transition-all"
            >
                <div className="flex items-center gap-2 truncate">
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0 text-gray-400" />}
                    <span className="truncate">{value === 'All' ? label : value}</span>
                </div>
                <ChevronDown className={clsx("w-4 h-4 ml-2 transition-transform text-gray-500", isOpen && "transform rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-full origin-top-right bg-card border border-white/5 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
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
                                        ? "bg-primary-500/10 text-primary-400 font-medium"
                                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Tasks</h1>
                    <p className="text-gray-400 mt-1">Manage and organize your daily work</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Date Navigation */}
                    <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-white/5 shadow-sm">
                        <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-gray-100">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium text-gray-200 min-w-[120px] text-center flex items-center justify-center gap-2 text-sm">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            {format(selectedDate, 'EEE, MMM d')}
                        </span>
                        <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-gray-100">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20 font-medium text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">New Task</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-400 mr-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-semibold">Filters:</span>
                </div>

                <ModularDropdown
                    label="Category"
                    value={filter.category}
                    options={['All', 'Study', 'Work', 'Household', 'Personal']}
                    onChange={(val) => setFilter({ ...filter, category: val })}
                />

                <ModularDropdown
                    label="Importance"
                    value={filter.importance}
                    options={['All', 'Low', 'Medium', 'High', 'Critical']}
                    onChange={(val) => setFilter({ ...filter, importance: val })}
                />

                <ModularDropdown
                    label="Status"
                    value={filter.status}
                    options={['All', 'Pending', 'Completed', 'Failed']}
                    onChange={(val) => setFilter({ ...filter, status: val })}
                />
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-card/50 rounded-2xl border border-dashed border-white/5">
                        <div className="p-4 bg-white/5 rounded-full mb-4">
                            <CheckCircle2 className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-400">No tasks found for {format(selectedDate, 'MMM d')}</p>
                        <p className="text-sm text-gray-600">Create a new task to get started!</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <Card key={task._id} className={clsx(
                            "group flex flex-col relative",
                            task.status === 'Completed' && "opacity-60",
                            task.status === 'Failed' && "border-error/20 bg-error/5"
                        )}>
                            {/* Importance Badge & Actions */}
                            <div className="flex justify-between items-start mb-4">
                                <Badge type={task.importance}>{task.importance}</Badge>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(task)} className="p-1.5 text-gray-500 hover:text-primary-400 rounded-lg hover:bg-white/5 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteTask(task._id)} className="p-1.5 text-gray-500 hover:text-error rounded-lg hover:bg-white/5 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 mb-4">
                                <h3 className={clsx("text-lg font-bold text-gray-100 mb-2 leading-tight",
                                    task.status === 'Completed' && "line-through text-gray-500",
                                    task.status === 'Failed' && "text-gray-400 line-through"
                                )}>
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {task.description || "No description."}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                                <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-gray-300">
                                    {task.category}
                                </span>
                                {task.estimatedTime && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {task.estimatedTime}{task.estimatedTimeUnit === 'hrs' ? 'h' : 'm'}
                                    </span>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                <span className={clsx("text-xs font-medium",
                                    new Date(task.assignedDate) < new Date(new Date().setHours(0, 0, 0, 0)) && task.status !== 'Completed' ? "text-error" : "text-gray-500"
                                )}>
                                    {task.assignedDate ? format(new Date(task.assignedDate), 'MMM d') : "No Due Date"}
                                </span>

                                <button
                                    onClick={() => toggleTaskCompletion(task._id)}
                                    disabled={task.status === 'Failed'}
                                    className={clsx("flex items-center gap-2 text-sm font-semibold transition-colors",
                                        task.status === 'Completed' ? "text-success hover:text-success/80" : "text-gray-400 hover:text-gray-200",
                                        task.status === 'Failed' && "text-error cursor-not-allowed opacity-75 hover:text-error"
                                    )}
                                >
                                    {task.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : task.status === 'Failed' ? <XCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    {task.status === 'Completed' ? "Done" : task.status === 'Failed' ? "Failed" : "Mark Done"}
                                </button>
                            </div>
                        </Card>
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
