import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['Design', 'Create', 'Inspire'];
const DURATION = 2700;
const WORD_INTERVAL = 900;
const COMPLETE_DELAY = 400;

const cubicEase = [0.4, 0, 0.2, 1];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasCompleted = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Counter animation via requestAnimationFrame
  useEffect(() => {
    const start = performance.now();
    let rafId;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else if (!hasCompleted.current) {
        hasCompleted.current = true;
        setTimeout(() => {
          onCompleteRef.current?.();
        }, COMPLETE_DELAY);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, WORD_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: '#0a0a0a' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: cubicEase }}
    >
      {/* "Portfolio" Label — Top Left */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span
          className="text-xs md:text-sm uppercase"
          style={{ color: '#888888', letterSpacing: '0.3em' }}
        >
          StudyFlow
        </span>
      </motion.div>

      {/* Rotating Words — Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-4xl md:text-6xl lg:text-7xl italic"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: 'rgba(245, 245, 245, 0.8)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: cubicEase }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Counter — Bottom Right */}
      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span
          className="text-6xl md:text-8xl lg:text-9xl"
          style={{
            fontFamily: "'Instrument Serif', serif",
            color: '#f5f5f5',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(progress).toString().padStart(3, '0')}
        </span>
      </motion.div>

      {/* Progress Bar — Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '3px', backgroundColor: 'rgba(31, 31, 31, 0.5)' }}>
        <motion.div
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
            boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
