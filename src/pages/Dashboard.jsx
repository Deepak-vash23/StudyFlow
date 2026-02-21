import { usePlanner } from '../context/PlannerContext';
import { useAuth } from '../context/AuthContext';
import { format, subDays, parse } from 'date-fns';
import { CheckCircle2, Clock, CalendarDays, AlertCircle, BarChart3, TrendingUp, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import clsx from 'clsx';

export default function Dashboard() {
    const { user } = useAuth();
    const { getSlotsForDate } = usePlanner();
    const today = format(new Date(), 'yyyy-MM-dd');

    // Today's slot metrics
    const todaySlots = getSlotsForDate(today);
    const totalSlots = todaySlots.length;
    const completedSlots = todaySlots.filter(s => s.completed).length;
    const failedSlots = todaySlots.filter(s => s.failed).length;
    const completionRate = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

    // Focus Time: only completed slots count
    const slotDurationMinutes = (slot) => {
        try {
            const [sh, sm] = slot.startTime.split(':').map(Number);
            const [eh, em] = slot.endTime.split(':').map(Number);
            const diff = (eh * 60 + em) - (sh * 60 + sm);
            return diff > 0 ? diff : 0;
        } catch { return 0; }
    };
    const completedFocusMinutes = todaySlots.filter(s => s.completed).reduce((acc, slot) => acc + slotDurationMinutes(slot), 0);
    const focusHours = Math.floor(completedFocusMinutes / 60);
    const focusMinutes = completedFocusMinutes % 60;
    const focusLabel = focusHours > 0
        ? `${focusHours}h ${focusMinutes > 0 ? focusMinutes + 'm' : ''}`
        : completedFocusMinutes > 0 ? `${focusMinutes}m` : '0m';
    const pendingFocusMinutes = todaySlots.filter(s => !s.completed && !s.failed).reduce((acc, slot) => acc + slotDurationMinutes(slot), 0);
    const pendingHours = Math.floor(pendingFocusMinutes / 60);
    const pendingMins = pendingFocusMinutes % 60;
    const pendingLabel = pendingHours > 0
        ? `${pendingHours}h ${pendingMins > 0 ? pendingMins + 'm' : ''}`
        : pendingFocusMinutes > 0 ? `${pendingMins}m` : null;

    // Weekly Stats (Planner slots only)
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const daySlots = getSlotsForDate(dateStr);

        if (daySlots.length > 0) {
            const completed = daySlots.filter(s => s.completed).length;
            return {
                day: format(date, 'EEE'),
                completion: Math.round((completed / daySlots.length) * 100)
            };
        }
        return { day: format(date, 'EEE'), completion: 0 };
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.name.split(' ')[0]}. Here is your daily overview.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-xl font-bold text-primary-400">{format(new Date(), 'eeee')}</p>
                    <p className="text-gray-500 text-sm">{format(new Date(), 'MMMM d, yyyy')}</p>
                </div>
            </div>

            {/* Section 1: Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col justify-between h-32 hover:border-orange-500/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Focus Time Today</p>
                            <h3 className="text-3xl font-bold text-gray-100 mt-1">{focusLabel}</h3>
                        </div>
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                            <Flame className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-auto">
                        {pendingLabel
                            ? <><span className="text-gray-400 font-medium">{pendingLabel}</span> still pending</>
                            : <span className="text-orange-400 font-medium">All done for today! 🎉</span>
                        }
                    </div>
                </Card>

                <Card className="flex flex-col justify-between h-32 hover:border-success/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Completed</p>
                            <h3 className="text-3xl font-bold text-gray-100 mt-1">{completedSlots}</h3>
                        </div>
                        <div className="p-2 bg-success/10 rounded-lg text-success">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-auto">
                        <span className="text-success font-medium">{completionRate}%</span> completion rate
                    </div>
                </Card>

                <Card className="flex flex-col justify-between h-32 hover:border-error/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Failed / Overdue</p>
                            <h3 className="text-3xl font-bold text-gray-100 mt-1">{failedSlots}</h3>
                        </div>
                        <div className="p-2 bg-error/10 rounded-lg text-error">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-auto">
                        <span className="text-error font-medium">{failedSlots > 0 ? 'Action required' : 'All good!'}</span>
                    </div>
                </Card>
            </div>

            {/* Section 2: Today's Schedule (Full Width) */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-400" />
                        Today's Schedule
                    </h3>
                    <Link to="/planner" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                        View Planner →
                    </Link>
                </div>

                <div className="space-y-3">
                    {todaySlots.slice(0, 5).map((slot, index) => (
                        <div key={slot.id || index} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                            <div className="flex flex-col items-end min-w-[70px]">
                                <span className="text-sm font-bold text-gray-200">
                                    {format(parse(slot.startTime, 'HH:mm', new Date()), 'h:mm a')}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {format(parse(slot.endTime, 'HH:mm', new Date()), 'h:mm a')}
                                </span>
                            </div>
                            <div className={clsx("w-1 h-10 rounded-full flex-shrink-0", slot.completed ? "bg-success" : slot.failed ? "bg-error" : "bg-primary-500")}></div>
                            <div className="flex-1">
                                <p className={clsx("text-sm font-medium", slot.completed ? "text-gray-500 line-through" : "text-gray-200")}>
                                    {slot.label || "Untitled Slot"}
                                </p>
                                <Badge type={slot.completed ? 'success' : slot.failed ? 'error' : 'neutral'} className="mt-1">
                                    {slot.completed ? 'Completed' : slot.failed ? 'Failed' : 'Scheduled'}
                                </Badge>
                            </div>
                        </div>
                    ))}
                    {todaySlots.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            <p>No time slots scheduled for today.</p>
                            <Link to="/planner" className="text-primary-400 hover:underline mt-2 inline-block">Plan your day →</Link>
                        </div>
                    )}
                    {todaySlots.length > 5 && (
                        <div className="text-center pt-2">
                            <Link to="/planner" className="text-xs text-primary-400 hover:text-primary-300">
                                +{todaySlots.length - 5} more slots — View all
                            </Link>
                        </div>
                    )}
                </div>
            </Card>

            {/* Section 3: Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary-400" />
                            Weekly Activity
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <span>Completion rate by day</span>
                        </div>
                    </div>
                    <div className="h-48 flex items-end justify-between gap-2 px-4">
                        {weeklyStats.map((stat, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-all">{stat.completion}%</span>
                                <div className="w-full bg-white/5 rounded-t-lg relative overflow-hidden h-40 flex items-end">
                                    <div
                                        className="w-full bg-primary-600/50 group-hover:bg-primary-500/80 transition-all duration-500 rounded-t-sm"
                                        style={{ height: `${stat.completion}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 uppercase">
                                    {stat.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-primary-400" />
                            Calendar
                        </h3>
                        <Link to="/calendar" className="text-xs text-primary-400 hover:text-primary-300">Open</Link>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-gray-500">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {Array.from({ length: 30 }, (_, i) => {
                            const isToday = i + 1 === new Date().getDate();
                            return (
                                <div key={i} className={clsx(
                                    "aspect-square rounded-full flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-white/10 transition-colors",
                                    isToday ? "bg-primary-600 text-white" : "text-gray-400"
                                )}>
                                    {i + 1}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}
