/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   EASTER EGG - Hidden clickable Easter egg           ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import { isEaster } from '@/lib/seasonal';

export default function EasterEgg() {
  const [show, setShow] = useState(false);
  const [found, setFound] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isEaster()) return;
    setShow(true);

    // Position near edges so it peeks out from behind containers
    const positions = [
      { x: 5, y: 85 },   // Bottom left
      { x: 92, y: 70 },  // Right side
      { x: 3, y: 45 },   // Left side middle
      { x: 88, y: 30 },  // Right side upper
      { x: 50, y: 92 },  // Bottom center
    ];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    setPosition(randomPos);

    // Check if already found this session
    const wasFound = sessionStorage.getItem('easterEggFound');
    if (wasFound) setFound(true);
  }, []);

  const handleClick = () => {
    if (found) return;
    setFound(true);
    sessionStorage.setItem('easterEggFound', 'true');
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes egg-wobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes egg-found {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>
      <div
        className={`fixed z-0 cursor-pointer transition-all ${found ? 'pointer-events-none' : ''}`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          animation: found ? 'egg-found 0.6s ease-out forwards' : 'egg-wobble 2s ease-in-out infinite',
        }}
        onClick={handleClick}
        title={found ? '' : 'Click me!'}
      >
        <svg width="40" height="50" viewBox="0 0 40 50">
          {/* Egg shape */}
          <ellipse
            cx="20"
            cy="28"
            rx="18"
            ry="22"
            fill="url(#eggGradient)"
          />
          {/* Decorative stripes */}
          <path
            d="M5 20 Q20 15 35 20"
            fill="none"
            stroke="#E1BEE7"
            strokeWidth="3"
          />
          <path
            d="M4 30 Q20 35 36 30"
            fill="none"
            stroke="#B2EBF2"
            strokeWidth="3"
          />
          <path
            d="M6 40 Q20 45 34 40"
            fill="none"
            stroke="#FFF9C4"
            strokeWidth="3"
          />
          {/* Dots */}
          <circle cx="12" cy="25" r="3" fill="#F8BBD9" />
          <circle cx="28" cy="25" r="3" fill="#B3E5FC" />
          <circle cx="20" cy="35" r="3" fill="#DCEDC8" />
          <defs>
            <linearGradient id="eggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="50%" stopColor="#F8BBD9" />
              <stop offset="100%" stopColor="#B2EBF2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Found message */}
      {found && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          style={{ animation: 'egg-found 2s ease-out forwards' }}
        >
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl text-center">
            <div className="text-3xl mb-2">🐰</div>
            <div className="text-lg font-bold text-gray-800">You found the Easter egg!</div>
            <div className="text-sm text-gray-600">Happy Easter!</div>
          </div>
        </div>
      )}
    </>
  );
}
