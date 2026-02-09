import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Tag, AlertCircle } from 'lucide-react';

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

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {initialData ? 'Edit Task' : 'New Task'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Tag className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                                    <label className="block text-sm font-medium text-gray-700">Importance</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <AlertCircle className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Est. Time</label>
                                    <div className="mt-1 relative rounded-md shadow-sm flex">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="block w-full pl-10 border border-gray-300 rounded-l-md shadow-sm py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={formData.estimatedTime}
                                            onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                                            placeholder="0"
                                        />
                                        <select
                                            className="border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50 px-2 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                            value={formData.estimatedTimeUnit}
                                            onChange={(e) => setFormData({ ...formData, estimatedTimeUnit: e.target.value })}
                                        >
                                            <option value="mins">mins</option>
                                            <option value="hrs">hrs</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={formData.assignedDate}
                                            onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                                >
                                    {initialData ? 'Update Task' : 'Create Task'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
