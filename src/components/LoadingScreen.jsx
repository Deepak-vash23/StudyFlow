import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DURATION = 6500;
const COMPLETE_DELAY = 400;

const cubicEase = [0.4, 0, 0.2, 1];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasCompleted = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Counter animation via requestAnimationFrame
  useEffect(() => {
    const start = performance.now();
    let rafId;

    const getCustomProgress = (elapsed) => {
      if (elapsed <= 1500) {
        // Fast from 0 to 70 in 1.5 seconds
        const t = elapsed / 1500;
        return 70 * Math.sin(t * (Math.PI / 2)); // Ease-out
      } else if (elapsed <= 4000) {
        // Slow from 70 to 90 from 1.5s to 4.0s
        const t = (elapsed - 1500) / 2500;
        return 70 + 20 * t; // Linear slow crawl
      } else {
        // Accelerate for the last 3 seconds (from 90 to 100)
        const t = (elapsed - 4000) / 3000;
        return 90 + 10 * (t * t); // Ease-in (increase speed)
      }
    };

    const tick = (now) => {
      const elapsed = now - start;
      const calculatedProgress = getCustomProgress(elapsed);
      const pct = Math.min(calculatedProgress, 100);
      setProgress(pct);

      if (elapsed < DURATION) {
        rafId = requestAnimationFrame(tick);
      } else if (!hasCompleted.current) {
        hasCompleted.current = true;
        setProgress(100); // Ensure it caps at exact 100
        setTimeout(() => {
          onCompleteRef.current?.();
        }, COMPLETE_DELAY);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
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
      </motion.div>

      {/* Video Content — Center */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: cubicEase }}
          className="w-full max-w-2xl px-8 md:max-w-4xl lg:max-w-6xl flex items-center justify-center"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/logo_code.mp4"
            className="w-full h-auto rounded-2xl object-cover mix-blend-screen opacity-90 shadow-2xl"
          />
        </motion.div>
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
