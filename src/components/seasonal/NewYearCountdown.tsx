/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   NEW YEAR COUNTDOWN - Timer for Dec 31st            ###
   ###   Happy New Year banner for Jan 1st                  ###
   ###   Last Updated: 01-01-2026                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';

export default function NewYearCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [show, setShow] = useState(false);
  const [isNewYearsDay, setIsNewYearsDay] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    // Show on Jan 1 (Happy New Year)
    if (month === 0 && day === 1) {
      setShow(true);
      setIsNewYearsDay(true);
      setYear(now.getFullYear());
      return;
    }

    // Show on Dec 30-31 (countdown)
    if (month === 11 && day >= 30) {
      setShow(true);
      setIsNewYearsDay(false);
      return;
    }

    // Check for debug override
    try {
      const stored = localStorage.getItem('__seasonalDebug');
      if (stored) {
        const override = JSON.parse(stored);
        if (override.holiday === 'newyear') {
          setShow(true);
          setIsNewYearsDay(override.isNewYearsDay || false);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!show || isNewYearsDay) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const newYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
      const diff = newYear.getTime() - now.getTime();

      if (diff <= 0) {
        // Countdown finished - switch to Happy New Year
        setIsNewYearsDay(true);
        setYear(now.getFullYear() + 1);
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
  }, [show, isNewYearsDay]);

  if (!show) return null;

  // Happy New Year banner
  if (isNewYearsDay) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
          color: '#f59e0b',
        }}
      >
        <span className="font-semibold">Happy New Year {year}!</span>
      </div>
    );
  }

  // Countdown timer
  if (!timeLeft) return null;

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
