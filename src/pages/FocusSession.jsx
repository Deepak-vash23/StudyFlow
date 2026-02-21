import { useState, useCallback } from 'react';
import ProgressRing from '../components/ProgressRing';
import PointsBadge from '../components/PointsBadge';
import useTimer from '../components/useTimer';
import clsx from 'clsx';

const DURATION_OPTIONS = [20, 25, 30, 45, 60];

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const loadPoints = () => {
    try { return parseInt(localStorage.getItem('focusPoints') || '0', 10); } catch { return 0; }
};
const savePoints = (pts) => {
    try { localStorage.setItem('focusPoints', String(pts)); } catch { /* noop */ }
};

export default function FocusSession() {
    const [points, setPoints] = useState(loadPoints);
    const [taskName, setTaskName] = useState('Deep Work Session');
    const [tabAwayMsg, setTabAwayMsg] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(25);
    const [editingTask, setEditingTask] = useState(false);
    const [customMode, setCustomMode] = useState(false);
    const [customInput, setCustomInput] = useState('');

    const handleComplete = useCallback((minutesCompleted) => {
        const earned = minutesCompleted;
        setPoints((prev) => {
            const newPts = prev + earned;
            savePoints(newPts);
            return newPts;
        });
        setPointsEarned(earned);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setPointsEarned(null); }, 4000);
    }, []);

    const handleTabAway = useCallback(() => {
        setTabAwayMsg(true);
        setTimeout(() => setTabAwayMsg(false), 4000);
    }, []);

    const { remaining, totalSeconds, isRunning, isComplete, progress, start, pause, reset, setDuration } = useTimer({
        onComplete: handleComplete,
        onTabAway: handleTabAway,
    });

    const handleDurationSelect = (mins) => {
        if (isRunning) return;
        setSelectedDuration(mins);
        setDuration(mins);
        setShowSuccess(false);
        setCustomMode(false);
        setCustomInput('');
    };

    const handleCustomApply = () => {
        const mins = parseInt(customInput, 10);
        if (!mins || mins < 1 || mins > 480) return;
        setSelectedDuration(mins);
        setDuration(mins);
        setShowSuccess(false);
        setCustomMode(false);
        setCustomInput('');
    };

    const handleStartPause = () => {
        setTabAwayMsg(false);
        if (isRunning) { pause(); } else { start(); }
    };

    const handleReset = () => {
        reset();
        setShowSuccess(false);
        setTabAwayMsg(false);
        setPointsEarned(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-white/5 pb-6">
                <h1 className="text-3xl font-bold text-gray-100">Focus Session</h1>
                <p className="text-gray-400 mt-1">Start a timed focus sprint and earn points for staying on task.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Timer Panel */}
                <div className="flex-1 flex flex-col items-center gap-6 bg-card border border-white/5 rounded-2xl p-8">

                    {/* Duration pills */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {DURATION_OPTIONS.map((mins) => (
                            <button
                                key={mins}
                                onClick={() => handleDurationSelect(mins)}
                                disabled={isRunning}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
                                    selectedDuration === mins && !customMode
                                        ? "border-green-500 bg-green-500/10 text-green-400"
                                        : "border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200",
                                    isRunning && selectedDuration !== mins && "opacity-40 cursor-not-allowed"
                                )}
                            >
                                {mins}m
                            </button>
                        ))}
                        {!customMode ? (
                            <button
                                onClick={() => { if (!isRunning) setCustomMode(true); }}
                                disabled={isRunning}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200 transition-all",
                                    isRunning && "opacity-40 cursor-not-allowed"
                                )}
                            >
                                Custom ✎
                            </button>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <input
                                    autoFocus
                                    type="number"
                                    min="1"
                                    max="480"
                                    placeholder="min"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomApply()}
                                    className="w-16 px-3 py-1 rounded-full border border-green-500 bg-green-500/10 text-gray-100 text-sm text-center focus:outline-none"
                                />
                                <button
                                    onClick={handleCustomApply}
                                    className="px-3 py-1 rounded-full bg-green-500 text-gray-900 text-xs font-bold hover:bg-green-400 transition-colors"
                                >
                                    Set
                                </button>
                                <button
                                    onClick={() => { setCustomMode(false); setCustomInput(''); }}
                                    className="px-3 py-1 rounded-full border border-white/10 text-gray-400 text-xs hover:bg-white/5 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Circular timer */}
                    <div className="relative flex items-center justify-center">
                        <div className={clsx("rounded-full p-2", showSuccess && "drop-shadow-[0_0_24px_rgba(34,197,94,0.5)]")}>
                            <ProgressRing
                                radius={130}
                                strokeWidth={8}
                                progress={progress}
                                isComplete={isComplete || showSuccess}
                                isPaused={!isRunning && !isComplete && remaining < totalSeconds}
                            />
                            {/* Center display */}
                            <div className="absolute inset-2 flex flex-col items-center justify-center gap-1">
                                <span className={clsx(
                                    "text-5xl font-extrabold tracking-tight tabular-nums transition-colors duration-300",
                                    showSuccess ? "text-green-400" : "text-gray-100"
                                )}>
                                    {formatTime(remaining)}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">
                                    {isComplete ? '✓ Complete' : isRunning ? 'Focusing...' : remaining === totalSeconds ? 'Ready' : 'Paused'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Task name */}
                    <div className="w-full max-w-xs">
                        {editingTask ? (
                            <input
                                autoFocus
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                onBlur={() => setEditingTask(false)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingTask(false)}
                                placeholder="What are you working on?"
                                maxLength={80}
                                className="w-full bg-white/5 border border-green-500/50 rounded-xl px-4 py-3 text-gray-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500/30"
                            />
                        ) : (
                            <button
                                onClick={() => setEditingTask(true)}
                                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                {taskName || 'Click to set task name…'}
                                <span className="ml-2 text-gray-500 text-xs">✎</span>
                            </button>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {/* Reset */}
                        <button
                            onClick={handleReset}
                            className="w-12 h-12 rounded-full bg-surface border border-white/10 text-gray-400 text-lg hover:bg-white/5 hover:text-gray-200 transition-all flex items-center justify-center"
                            title="Reset"
                        >
                            ↺
                        </button>

                        {/* Start/Pause */}
                        <button
                            onClick={handleStartPause}
                            disabled={isComplete}
                            className={clsx(
                                "w-18 h-18 rounded-full text-2xl font-bold flex items-center justify-center transition-all shadow-lg",
                                isComplete
                                    ? "bg-green-500/20 text-green-400 cursor-default w-16 h-16"
                                    : "bg-green-500 text-gray-900 hover:bg-green-400 w-16 h-16",
                                isRunning && "shadow-[0_0_24px_rgba(34,197,94,0.4)]"
                            )}
                        >
                            {isComplete ? '✓' : isRunning ? '⏸' : '▶'}
                        </button>

                        {/* Points pill */}
                        <div
                            className="w-12 h-12 rounded-full bg-surface border border-white/10 text-green-400 text-sm font-bold flex items-center justify-center"
                            title={`${points} focus points`}
                        >
                            {points > 999 ? '1k+' : points}
                        </div>
                    </div>

                    {/* Status messages */}
                    <div className="min-h-[36px] text-center w-full">
                        {tabAwayMsg && (
                            <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-2 text-yellow-400 text-sm font-medium">
                                ⚠ Focus paused. Stay locked in.
                            </div>
                        )}
                        {showSuccess && pointsEarned !== null && (
                            <div className="inline-block bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-2 text-green-400 text-sm font-semibold">
                                🎉 Session complete! +{pointsEarned} focus points
                            </div>
                        )}
                    </div>
                </div>

                {/* Points Badge Panel */}
                <div className="w-full lg:w-72 flex flex-col gap-4">
                    <PointsBadge points={points} />

                    {/* Tips */}
                    <div className="bg-card border border-white/5 rounded-2xl p-5 space-y-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tips</p>
                        {[
                            { icon: '🎯', text: 'Set a clear task before starting' },
                            { icon: '📵', text: 'Put your phone face-down' },
                            { icon: '🌊', text: 'Take a break after each session' },
                        ].map((tip) => (
                            <div key={tip.text} className="flex items-start gap-3">
                                <span className="text-base">{tip.icon}</span>
                                <p className="text-gray-400 text-sm">{tip.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
