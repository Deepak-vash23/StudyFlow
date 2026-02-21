import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const TimeSelect = ({ label, value, onChange }) => {
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

export default function SlotForm({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        startTime: '09:00',
        endTime: '10:00',
        label: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                startTime: initialData.startTime || '09:00',
                endTime: initialData.endTime || '10:00',
                label: initialData.label || '',
            });
        } else {
            setFormData({
                startTime: '09:00',
                endTime: '10:00',
                label: '',
            });
        }
    }, [initialData, isOpen]);

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

                <div className="inline-block align-bottom bg-card rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-white/10">
                    <div className="px-6 pt-6 pb-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-500/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-100">
                                    {initialData ? 'Edit Time Slot' : 'New Time Slot'}
                                </h3>
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-gray-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Work Name */}
                            <div>
                                <label className={labelClasses}>Work Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Morning Study, Deep Work, Exercise..."
                                    className={inputClasses}
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            {/* Time Slot */}
                            <div>
                                <label className={labelClasses}>Time Slot</label>
                                <div className="grid grid-cols-2 gap-4 mt-1">
                                    <TimeSelect
                                        label="Start"
                                        value={formData.startTime}
                                        onChange={(val) => setFormData(prev => ({ ...prev, startTime: val }))}
                                    />
                                    <TimeSelect
                                        label="End"
                                        value={formData.endTime}
                                        onChange={(val) => setFormData(prev => ({ ...prev, endTime: val }))}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-white/10 transition-colors"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary-600 border border-transparent rounded-xl text-white font-bold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20"
                                >
                                    {initialData ? 'Save Changes' : 'Add Slot'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
