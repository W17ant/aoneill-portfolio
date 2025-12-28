/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HALLOWEEN EFFECTS - Spooky decorations             ###
   ###   Spider web corners + floating bats                 ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import { isHalloween } from '@/lib/seasonal';

function SpiderWeb({ position }: { position: 'left' | 'right' }) {
  const isLeft = position === 'left';
  return (
    <svg
      className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} w-32 h-32 opacity-20`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      style={{ transform: isLeft ? 'none' : 'scaleX(-1)' }}
    >
      {/* Radial lines */}
      {[0, 15, 30, 45, 60, 75, 90].map((angle) => (
        <line
          key={angle}
          x1="0"
          y1="0"
          x2={Math.cos((angle * Math.PI) / 180) * 100}
          y2={Math.sin((angle * Math.PI) / 180) * 100}
          className="text-gray-400"
        />
      ))}
      {/* Concentric arcs */}
      {[20, 40, 60, 80].map((radius) => (
        <path
          key={radius}
          d={`M 0 ${radius} Q ${radius * 0.4} ${radius * 0.6} ${radius} 0`}
          className="text-gray-400"
        />
      ))}
    </svg>
  );
}

export default function HalloweenEffects() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isHalloween()) return;
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <SpiderWeb position="left" />
      <SpiderWeb position="right" />
    </div>
  );
}
