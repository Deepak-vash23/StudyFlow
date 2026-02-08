import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { useTasks } from '../context/TaskContext';
import { format, addDays, subDays, parseISO, isBefore, startOfToday, parse } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Edit2, CheckCircle2, Circle, XCircle } from 'lucide-react';
import SlotForm from '../components/SlotForm';
import clsx from 'clsx';

export default function Planner() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const { slots, addSlot, updateSlot, deleteSlot, getSlotsForDate, toggleSlotCompletion } = usePlanner();
    const { tasks } = useTasks();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    const dailySlots = getSlotsForDate(formattedDate);
    const isPastDate = isBefore(selectedDate, startOfToday());

    const handleCreate = (data) => {
        addSlot({ ...data, date: formattedDate });
    };

    const handleUpdate = (data) => {
        if (editingSlot) {
            updateSlot(editingSlot.id, data);
            setEditingSlot(null);
        }
    };

    const openEditModal = (slot) => {
        setEditingSlot(slot);
        setIsModalOpen(true);
    };

    // Helper to get color based on linked task importance
    const getSlotColor = (taskId) => {
        if (!taskId) return 'bg-blue-50/50 border-blue-200/50 text-blue-800';
        const task = tasks.find(t => t.id === taskId);
        if (!task) return 'bg-gray-50/50 border-gray-200/50 text-gray-800';

        if (task.status === 'Failed') return 'bg-red-50/50 border-red-200/50 text-red-800';

        switch (task.importance) {
            case 'Low': return 'bg-green-50/50 border-green-200/50 text-green-800';
            case 'Medium': return 'bg-yellow-50/50 border-yellow-200/50 text-yellow-800';
            case 'High': return 'bg-orange-50/50 border-orange-200/50 text-orange-800';
            case 'Critical': return 'bg-red-50/50 border-red-200/50 text-red-800';
            default: return 'bg-blue-50/50 border-blue-200/50 text-blue-800';
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daily Planner</h1>
                    <p className="text-gray-500">Structure your day for maximum productivity</p>
                </div>

                <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl p-1 rounded-xl border border-white/20 shadow-sm">
                    <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="font-medium text-gray-700 min-w-[140px] text-center">
                        {format(selectedDate, 'EEEE, MMM d')}
                    </span>
                    <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {!isPastDate && (
                    <button
                        onClick={() => { setEditingSlot(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Slot</span>
                    </button>
                )}
            </div>

            <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 flex flex-col relative overflow-hidden">
                {/* Simple Time Column Visualization */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {dailySlots.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p>{isPastDate ? "No slots were scheduled for this day." : "No slots scheduled for this day."}</p>
                            {!isPastDate && (
                                <button onClick={() => setIsModalOpen(true)} className="mt-2 text-primary-600 hover:underline">Plan your day</button>
                            )}
                        </div>
                    ) : (
                        dailySlots.map((slot) => (
                            <div
                                key={slot.id}
                                className={clsx(
                                    "flex items-center gap-4 p-3 rounded-xl border-l-4 transition-all hover:shadow-md hover:bg-white/40",
                                    getSlotColor(slot.taskId),
                                    slot.completed && "opacity-60 grayscale"
                                )}
                            >
                                <div className="flex flex-col min-w-[80px] text-center">
                                    <span className="text-sm font-semibold">
                                        {format(parse(slot.startTime, 'HH:mm', new Date()), 'h:mm a')}
                                    </span>
                                    <span className="text-xs opacity-75">
                                        {format(parse(slot.endTime, 'HH:mm', new Date()), 'h:mm a')}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h4 className={clsx("font-medium text-lg", slot.completed && "line-through")}>{slot.label}</h4>
                                    {slot.taskId && (
                                        <span className="text-xs bg-white bg-opacity-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                            Linked Task
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleSlotCompletion(slot.id)}
                                        disabled={slot.failed}
                                        className={clsx("p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors",
                                            slot.failed && "opacity-50 cursor-not-allowed"
                                        )}
                                        title={slot.completed ? "Mark as Incomplete" : slot.failed ? "Task Failed" : "Mark as Complete"}
                                    >
                                        {slot.completed ? <CheckCircle2 className="w-6 h-6" /> : slot.failed ? <XCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                    </button>

                                    <div className="h-6 w-px bg-current opacity-20 mx-1"></div>

                                    <button
                                        onClick={() => openEditModal(slot)}
                                        disabled={slot.failed}
                                        className={clsx("p-1.5 rounded-md",
                                            slot.failed ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:bg-opacity-50"
                                        )}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteSlot(slot.id)}
                                        className="p-1.5 rounded-md hover:bg-white hover:bg-opacity-50 text-red-600 hover:text-red-700 transition-colors"
                                        title="Delete Slot"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <SlotForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingSlot ? handleUpdate : handleCreate}
                initialData={editingSlot}
            />
        </div>
    );
}
