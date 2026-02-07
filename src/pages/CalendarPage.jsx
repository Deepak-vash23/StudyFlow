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
                    <h1 className="text-2xl font-bold text-gray-900">Monthly Progress</h1>
                    <p className="text-gray-500">Track your consistency over time</p>
                </div>
                <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl p-1 rounded-xl border border-white/20 shadow-sm">
                    <button onClick={previousMonth} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-800 text-lg min-w-[160px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-white/20 bg-white/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-[120px]">
                    {paddingDays.map((_, i) => (
                        <div key={`pad-${i}`} className="bg-transparent border-b border-r border-white/20"></div>
                    ))}

                    {daysInMonth.map((day) => {
                        const status = getDayStatus(day);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toISOString()}
                                className={clsx(
                                    "border-b border-r border-white/20 p-2 relative group hover:bg-white/40 transition-colors",
                                    !isSameMonth(day, currentMonth) && "text-gray-400 bg-white/10"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={clsx(
                                        "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
                                        isToday ? "bg-primary-600 text-white" : "text-gray-700"
                                    )}>
                                        {format(day, 'd')}
                                    </span>

                                    {status !== 'empty' && (
                                        <div className="mt-1">
                                            {status === 'success' ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500 opacity-50" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Mini tasks indicators */}
                                <div className="mt-2 space-y-1">
                                    {getSlotsForDate(format(day, 'yyyy-MM-dd')).slice(0, 3).map(slot => (
                                        <div key={slot.id} className={clsx("text-[10px] px-1 py-0.5 rounded truncate",
                                            slot.completed ? "bg-green-100 text-green-800 line-through opacity-50" :
                                                slot.failed ? "bg-red-100 text-red-800 border border-red-200" :
                                                    "bg-blue-100 text-blue-800"
                                        )}>
                                            {slot.label}
                                        </div>
                                    ))}
                                    {getSlotsForDate(format(day, 'yyyy-MM-dd')).length > 3 && (
                                        <span className="text-[10px] text-gray-400 pl-1">+ more</span>
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
