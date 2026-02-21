/**
 * useTimer.js - Core timer hook
 * Countdown, tab-visibility auto-pause, points awarding.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_DURATION_MINS = 25;

const useTimer = ({ onComplete, onTabAway }) => {
    const [totalSeconds, setTotalSeconds] = useState(DEFAULT_DURATION_MINS * 60);
    const [remaining, setRemaining] = useState(DEFAULT_DURATION_MINS * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);
    const remainingAtPauseRef = useRef(remaining);
    const hasCompletedRef = useRef(false);

    const clearTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const start = useCallback(() => {
        if (isComplete) return;
        setIsRunning(true);
        remainingAtPauseRef.current = remaining;
        startTimeRef.current = Date.now();
    }, [isComplete, remaining]);

    const pause = useCallback(() => {
        setIsRunning(false);
        remainingAtPauseRef.current = remaining;
        clearTimer();
    }, [remaining]);

    const reset = useCallback(() => {
        clearTimer();
        setIsRunning(false);
        setIsComplete(false);
        hasCompletedRef.current = false;
        setRemaining(totalSeconds);
        remainingAtPauseRef.current = totalSeconds;
    }, [totalSeconds]);

    const setDuration = useCallback((mins) => {
        const secs = mins * 60;
        setTotalSeconds(secs);
        setRemaining(secs);
        remainingAtPauseRef.current = secs;
        setIsRunning(false);
        setIsComplete(false);
        hasCompletedRef.current = false;
        clearTimer();
    }, []);

    // Tick
    useEffect(() => {
        if (!isRunning) return;
        clearTimer();
        startTimeRef.current = Date.now();
        const initialRemaining = remainingAtPauseRef.current;

        intervalRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const newRemaining = Math.max(0, initialRemaining - elapsed);
            setRemaining(newRemaining);

            if (newRemaining === 0 && !hasCompletedRef.current) {
                hasCompletedRef.current = true;
                clearTimer();
                setIsRunning(false);
                setIsComplete(true);
                const minutesCompleted = Math.floor(totalSeconds / 60);
                onComplete(minutesCompleted);
            }
        }, 200);

        return clearTimer;
    }, [isRunning, totalSeconds, onComplete]);

    // Tab visibility detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isRunning) {
                pause();
                onTabAway();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isRunning, pause, onTabAway]);

    const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
    return { remaining, totalSeconds, isRunning, isComplete, progress, start, pause, reset, setDuration };
};

export default useTimer;
