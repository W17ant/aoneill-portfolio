/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HALLOWEEN EFFECTS - Spooky decorations             ###
   ###   Spider web corners + floating bats                 ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import { isHalloween } from '@/lib/seasonal';

interface Bat {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function BatShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
      <path d="M12 2C10.5 2 9.25 2.75 8.5 3.88C7.58 3.35 6.5 3 5.38 3C4.5 3 3 3.5 2 5C1 6.5 1 8 2 9.5C1.5 10 1 11 1 12C1 14.21 2.79 16 5 16H6.5C6.18 16.58 6 17.27 6 18C6 19.1 6.9 20 8 20C8.55 20 9.05 19.78 9.41 19.41L12 17L14.59 19.41C14.95 19.78 15.45 20 16 20C17.1 20 18 19.1 18 18C18 17.27 17.82 16.58 17.5 16H19C21.21 16 23 14.21 23 12C23 11 22.5 10 22 9.5C23 8 23 6.5 22 5C21 3.5 19.5 3 18.62 3C17.5 3 16.42 3.35 15.5 3.88C14.75 2.75 13.5 2 12 2Z" />
    </svg>
  );
}

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
  const [bats, setBats] = useState<Bat[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isHalloween()) return;
    setShow(true);

    const newBats = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 30 + 5,
      size: Math.random() * 16 + 16,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 20,
    }));

    setBats(newBats);
  }, []);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes bat-fly {
          0%, 100% {
            transform: translateX(0) translateY(0) scaleX(1);
          }
          25% {
            transform: translateX(100px) translateY(-20px) scaleX(1);
          }
          50% {
            transform: translateX(0) translateY(-10px) scaleX(-1);
          }
          75% {
            transform: translateX(-100px) translateY(-30px) scaleX(-1);
          }
        }
        @keyframes bat-wings {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.8); }
        }
      `}</style>

      {/* Spider webs in corners */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <SpiderWeb position="left" />
        <SpiderWeb position="right" />
      </div>

      {/* Flying bats */}
      <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden">
        {bats.map((bat) => (
          <div
            key={bat.id}
            className="absolute"
            style={{
              left: `${bat.x}%`,
              top: `${bat.y}%`,
              animation: `bat-fly ${bat.duration}s ease-in-out ${bat.delay}s infinite`,
            }}
          >
            <div style={{ animation: 'bat-wings 0.3s ease-in-out infinite' }}>
              <BatShape size={bat.size} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
