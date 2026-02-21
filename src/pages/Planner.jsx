import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { format, addDays, subDays, isBefore, startOfToday, parse } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, CheckCircle2, Circle, XCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';
import SlotForm from '../components/SlotForm';
import clsx from 'clsx';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function Planner() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const { addSlot, updateSlot, deleteSlot, getSlotsForDate, toggleSlotCompletion } = usePlanner();

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

    // Color based on slot status only (no task linking)
    const getSlotColor = (slot) => {
        if (slot.failed) return 'bg-error/10 border-error/20 text-error';
        if (slot.completed) return 'bg-success/10 border-success/20 text-gray-400';
        return 'bg-secondary border-white/5 text-gray-300';
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Daily Planner</h1>
                    <p className="text-gray-400 mt-1">Structure your day for maximum productivity</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-white/5 shadow-sm">
                        <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-gray-100">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium text-gray-200 min-w-[140px] text-center flex items-center justify-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            {format(selectedDate, 'EEEE, MMM d')}
                        </span>
                        <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-gray-100">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {!isPastDate && (
                        <button
                            onClick={() => { setEditingSlot(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20 font-medium text-sm"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Add Slot</span>
                        </button>
                    )}
                </div>
            </div>

            <Card className="flex-1 flex flex-col relative overflow-hidden bg-card border-white/5">
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                    {dailySlots.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <div className="p-4 bg-white/5 rounded-full mb-4">
                                <Clock className="w-8 h-8 text-gray-600" />
                            </div>
                            <p className="text-lg font-medium text-gray-400">{isPastDate ? "No slots were scheduled." : "No slots scheduled for today."}</p>
                            {!isPastDate && (
                                <button onClick={() => setIsModalOpen(true)} className="mt-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                    Start planning your day &rarr;
                                </button>
                            )}
                        </div>
                    ) : (
                        dailySlots.map((slot) => (
                            <div
                                key={slot.id}
                                className={clsx(
                                    "group flex items-center gap-4 p-4 rounded-xl border-l-4 transition-all hover:bg-white/5",
                                    getSlotColor(slot),
                                    slot.completed && "opacity-60"
                                )}
                            >
                                <div className="flex flex-col min-w-[90px] text-center border-r border-white/5 pr-4">
                                    <span className="text-base font-bold text-gray-200">
                                        {format(parse(slot.startTime, 'HH:mm', new Date()), 'h:mm a')}
                                    </span>
                                    <span className="text-xs font-medium text-gray-500">
                                        {format(parse(slot.endTime, 'HH:mm', new Date()), 'h:mm a')}
                                    </span>
                                </div>

                                <div className="flex-1 pl-2">
                                    <h4 className={clsx("font-semibold text-lg text-gray-100", slot.completed && "line-through text-gray-500")}>
                                        {slot.label}
                                    </h4>
                                    {slot.failed && (
                                        <Badge type="error" className="text-[10px] py-0 px-1.5 h-5 mt-1">Failed</Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => toggleSlotCompletion(slot.id)}
                                        disabled={slot.failed}
                                        className={clsx("p-2 rounded-lg transition-colors",
                                            slot.completed ? "text-success hover:bg-success/10" : "text-gray-400 hover:text-gray-200 hover:bg-white/10",
                                            slot.failed && "text-error opacity-50 cursor-not-allowed"
                                        )}
                                        title={slot.completed ? "Mark as Incomplete" : slot.failed ? "Task Failed" : "Mark as Complete"}
                                    >
                                        {slot.completed ? <CheckCircle2 className="w-6 h-6" /> : slot.failed ? <XCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                    </button>

                                    <div className="h-6 w-px bg-white/10 mx-1"></div>

                                    <button
                                        onClick={() => openEditModal(slot)}
                                        disabled={slot.failed}
                                        className={clsx("p-2 rounded-lg text-gray-400 transition-colors",
                                            slot.failed ? "opacity-30 cursor-not-allowed" : "hover:text-primary-400 hover:bg-white/10"
                                        )}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteSlot(slot.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-error hover:bg-error/10 transition-colors"
                                        title="Delete Slot"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <SlotForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingSlot ? handleUpdate : handleCreate}
                initialData={editingSlot}
                selectedDate={formattedDate}
            />
        </div>
    );
}
