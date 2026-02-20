import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { getSlotsForDate } = usePlanner();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add padding days for start of week (Sunday start)
    const startDay = getDay(monthStart);
    const paddingDays = Array(startDay).fill(null);

    const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // Logic for daily status
    const getDayStatus = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const daysSlots = getSlotsForDate(dateStr);

        if (daysSlots.length === 0) return 'empty'; // No slots planned

        const allCompleted = daysSlots.every(s => s.completed);
        return allCompleted ? 'success' : 'incomplete';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Monthly Progress</h1>
                    <p className="text-gray-400">Track your consistency over time</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-lg">
                    <button onClick={previousMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-gray-100 text-lg min-w-[160px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-4 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-[120px]">
                    {paddingDays.map((_, i) => (
                        <div key={`pad-${i}`} className="bg-transparent border-b border-r border-white/10"></div>
                    ))}

                    {daysInMonth.map((day) => {
                        const status = getDayStatus(day);
                        const isToday = isSameDay(day, new Date());
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <div
                                key={day.toISOString()}
                                className={clsx(
                                    "border-b border-r border-white/10 p-3 relative group transition-colors",
                                    isCurrentMonth ? "hover:bg-white/5" : "bg-black/20 text-gray-600 hover:bg-black/10"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={clsx(
                                        "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-sm",
                                        isToday ? "bg-primary-500 text-white shadow-primary-500/30" :
                                            isCurrentMonth ? "text-gray-300 bg-white/5" : "text-gray-600 bg-transparent"
                                    )}>
                                        {format(day, 'd')}
                                    </span>

                                    {status !== 'empty' && isCurrentMonth && (
                                        <div className="mt-1">
                                            {status === 'success' ? (
                                                <CheckCircle2 className="w-5 h-5 text-success" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-error/70" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Mini tasks indicators */}
                                <div className="mt-3 space-y-1.5 opacity-90">
                                    {getSlotsForDate(format(day, 'yyyy-MM-dd')).slice(0, 3).map(slot => (
                                        <div key={slot.id} className={clsx("text-[10px] px-2 py-1 rounded truncate font-medium",
                                            slot.completed ? "bg-success/20 text-success border border-success/20 line-through opacity-70" :
                                                slot.failed ? "bg-error/20 text-error border border-error/20" :
                                                    "bg-primary-500/20 text-primary-200 border border-primary-500/20"
                                        )}>
                                            {slot.label}
                                        </div>
                                    ))}
                                    {getSlotsForDate(format(day, 'yyyy-MM-dd')).length > 3 && (
                                        <span className="text-[10px] text-gray-500 pl-1 font-medium">+ more</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
