import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X } from 'lucide-react';
import clsx from 'clsx';

const TimeSelect = ({ label, value, onChange }) => {
    // Parse HH:mm to 12-hour format
    const parseTime = (timeStr) => {
        if (!timeStr) return { hour: '09', minute: '00', period: 'AM' };
        const [h, m] = timeStr.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        let hour = h % 12;
        if (hour === 0) hour = 12;
        return {
            hour: hour.toString().padStart(2, '0'),
            minute: m.toString().padStart(2, '0'),
            period
        };
    };

    const [localState, setLocalState] = useState(parseTime(value));

    useEffect(() => {
        setLocalState(parseTime(value));
    }, [value]);

    const handleChange = (field, val) => {
        const newState = { ...localState, [field]: val };
        setLocalState(newState);

        // Convert back to HH:mm
        let h = parseInt(newState.hour);
        if (newState.period === 'PM' && h !== 12) h += 12;
        if (newState.period === 'AM' && h === 12) h = 0;
        const time24 = `${h.toString().padStart(2, '0')}:${newState.minute}`;
        onChange(time24);
    };

    const selectClasses = "block w-full bg-surface border border-white/10 rounded-xl shadow-sm py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 sm:text-sm";

    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <div className="flex gap-2">
                <select
                    className={selectClasses}
                    value={localState.hour}
                    onChange={(e) => handleChange('hour', e.target.value)}
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h.toString().padStart(2, '0')}>{h}</option>
                    ))}
                </select>
                <span className="self-center font-bold text-gray-500">:</span>
                <select
                    className={selectClasses}
                    value={localState.minute}
                    onChange={(e) => handleChange('minute', e.target.value)}
                >
                    {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                        <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                    ))}
                </select>
                <select
                    className={selectClasses}
                    value={localState.period}
                    onChange={(e) => handleChange('period', e.target.value)}
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );
};

export default function SlotForm({ isOpen, onClose, onSubmit, initialData = null, selectedDate }) {
    const { tasks } = useTasks();
    const [formData, setFormData] = useState({
        startTime: '09:00',
        endTime: '10:00',
        label: '',
        taskId: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                startTime: '09:00',
                endTime: '10:00',
                label: '',
                taskId: ''
            });
        }
    }, [initialData, isOpen]);

    // If a task is selected, auto-fill label if empty
    useEffect(() => {
        if (formData.taskId && !formData.label) {
            const task = tasks.find(t => t.id === formData.taskId);
            if (task) {
                setFormData(prev => ({ ...prev, label: task.title }));
            }
        }
    }, [formData.taskId, tasks]);

    // Filter tasks for the selected date
    const filteredTasks = tasks.filter(t => {
        if (t.status === 'Completed' || t.status === 'Failed') return false;

        // If selectedDate is provided, check if task matches
        if (selectedDate && t.assignedDate) {
            const taskDate = new Date(t.assignedDate).toISOString().split('T')[0];
            return taskDate === selectedDate;
        }

        // If no date on task, maybe show it? Or only show dateless tasks if no date on planner?
        // User requested: "only show the today's task in linked task"
        // So strict filtering seems appropriate.
        return false;
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const inputClasses = "mt-1 block w-full bg-surface border border-white/10 rounded-xl shadow-sm py-2.5 px-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 sm:text-sm transition-all";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-1";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-card rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/10">
                    <div className="px-6 pt-6 pb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-100">
                                {initialData ? 'Edit Time Slot' : 'Add Time Slot'}
                            </h3>
                            <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TimeSelect
                                    label="Start Time"
                                    value={formData.startTime}
                                    onChange={(val) => setFormData(prev => ({ ...prev, startTime: val }))}
                                />
                                <TimeSelect
                                    label="End Time"
                                    value={formData.endTime}
                                    onChange={(val) => setFormData(prev => ({ ...prev, endTime: val }))}
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Link a Task (Optional)</label>
                                <select
                                    className={inputClasses}
                                    value={formData.taskId}
                                    onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                                >
                                    <option value="">-- None --</option>
                                    {filteredTasks.map(task => (
                                        <option key={task._id || task.id} value={task._id || task.id}>{task.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClasses}>Label / Activity Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Morning Study"
                                    className={inputClasses}
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary-600 border border-transparent rounded-xl text-white font-bold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Save Slot
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
