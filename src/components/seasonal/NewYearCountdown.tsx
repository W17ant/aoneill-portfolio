/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   NEW YEAR COUNTDOWN - Timer for Dec 31st            ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';

export default function NewYearCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    // Only show on Dec 30-31
    if (month !== 11 || day < 30) {
      // Check for debug override
      try {
        const stored = localStorage.getItem('__seasonalDebug');
        if (stored) {
          const override = JSON.parse(stored);
          if (override.holiday === 'newyear') {
            setShow(true);
          }
        }
      } catch {}
      if (!show) return;
    } else {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const newYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
      const diff = newYear.getTime() - now.getTime();

      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [show]);

  if (!show || !timeLeft) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono"
      style={{
        background: 'rgba(37, 99, 235, 0.15)',
        color: 'var(--primary)',
      }}
    >
      <span className="text-[10px] opacity-70">NYE</span>
      <span className="font-semibold tracking-tight">
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </div>
  );
}
