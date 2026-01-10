/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SUMMER SUNSHINE - Lens flare / sun effect          ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import { isSummer, getHoliday } from '@/lib/seasonal';

export default function SummerSunshine() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show in summer when no holiday is active
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional client-only state
    setShow(isSummer() && !getHoliday());
  }, []);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes rotate-rays {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
      <div className="fixed top-0 right-0 pointer-events-none z-20 overflow-hidden w-96 h-96">
        {/* Main sun glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 40%, transparent 70%)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}
        />
        {/* Lens flare streaks */}
        <div
          className="absolute top-10 right-10 w-48 h-48"
          style={{
            background: `
              linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%),
              linear-gradient(-45deg, transparent 40%, rgba(255,215,0,0.1) 50%, transparent 60%)
            `,
            animation: 'rotate-rays 20s linear infinite',
          }}
        />
        {/* Secondary flare */}
        <div
          className="absolute top-32 right-32 w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
            animation: 'pulse-glow 3s ease-in-out infinite 1s',
          }}
        />
      </div>
    </>
  );
}
