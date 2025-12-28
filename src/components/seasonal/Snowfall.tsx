/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SNOWFALL - Animated falling snow effect            ###
   ###   CSS-based for performance                          ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import { isWinter } from '@/lib/seasonal';

interface SnowflakeData {
  id: number;
  style: React.CSSProperties;
}

function Snowflake({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="fixed pointer-events-none rounded-full bg-white"
      style={style}
    />
  );
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<SnowflakeData[]>([]);

  useEffect(() => {
    // Only generate snowflakes on client and in winter
    if (!isWinter()) return;

    const flakes = Array.from({ length: 50 }, (_, i) => {
      const size = Math.random() * 4 + 2; // 2-6px
      const left = Math.random() * 100; // 0-100%
      const delay = Math.random() * 10; // 0-10s
      const duration = Math.random() * 10 + 10; // 10-20s
      const opacity = Math.random() * 0.6 + 0.2; // 0.2-0.8

      return {
        id: i,
        style: {
          width: size,
          height: size,
          left: `${left}%`,
          top: -10,
          opacity,
          animation: `snowfall ${duration}s linear ${delay}s infinite`,
        } as React.CSSProperties,
      };
    });

    setSnowflakes(flakes);
  }, []);

  // Don't render anything until we have snowflakes (client-side only)
  if (snowflakes.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--snow-opacity, 0.5);
          }
          90% {
            opacity: var(--snow-opacity, 0.5);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {snowflakes.map((flake) => (
          <Snowflake key={flake.id} style={flake.style} />
        ))}
      </div>
    </>
  );
}
