import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Tag, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function TaskForm({ isOpen, onClose, onSubmit, initialData = null, selectedDate = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Study',
        importance: 'Medium',
        estimatedTime: '',
        estimatedTimeUnit: 'mins',
        assignedDate: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                assignedDate: initialData.assignedDate ? new Date(initialData.assignedDate).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: 'Study',
                importance: 'Medium',
                estimatedTime: '',
                estimatedTimeUnit: 'mins',
                assignedDate: selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : ''
            });
        }
    }, [initialData, isOpen, selectedDate]);

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
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-gray-100">
                                {initialData ? 'Edit Task' : 'New Task'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/5">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className={labelClasses}>Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="What needs to be done?"
                                    className={inputClasses}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Description</label>
                                <textarea
                                    className={inputClasses}
                                    rows="3"
                                    placeholder="Add details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClasses}>Category</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Tag className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <select
                                            className={clsx(inputClasses, "pl-10")}
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option>Study</option>
                                            <option>Work</option>
                                            <option>Household</option>
                                            <option>Personal</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Importance</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <AlertCircle className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <select
                                            className={clsx(inputClasses, "pl-10")}
                                            value={formData.importance}
                                            onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                            <option>Critical</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClasses}>Est. Time</label>
                                    <div className="flex">
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className={clsx(inputClasses, "mt-0 rounded-r-none pl-10")}
                                                value={formData.estimatedTime}
                                                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                                                placeholder="0"
                                            />
                                        </div>
                                        <select
                                            className="bg-surface border-t border-b border-r border-white/10 rounded-r-xl px-2 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                            value={formData.estimatedTimeUnit}
                                            onChange={(e) => setFormData({ ...formData, estimatedTimeUnit: e.target.value })}
                                        >
                                            <option value="mins">mins</option>
                                            <option value="hrs">hrs</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <input
                                            type="date"
                                            className={clsx(inputClasses, "mt-0 pl-10")}
                                            value={formData.assignedDate}
                                            onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                </div>
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
                                    {initialData ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
