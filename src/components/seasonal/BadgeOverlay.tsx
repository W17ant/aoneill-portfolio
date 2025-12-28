/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   BADGE OVERLAY - Seasonal badge decorations         ###
   ###   Christmas hat, party hat, bunny ears, etc          ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getHoliday, type Holiday } from '@/lib/seasonal';

// Per-holiday positioning
const holidayStyles: Record<string, { top: string; right: string; rotate: string; size: number }> = {
  christmas: { top: '-30px', right: '-50px', rotate: '17deg', size: 95 },
  newyear: { top: '-80px', right: '-46px', rotate: '20deg', size: 105 },
  stpatrick: { top: '-64px', right: '-33px', rotate: '17deg', size: 95 },
  halloween: { top: '-66px', right: '-35px', rotate: '24deg', size: 100 },
};

export default function BadgeOverlay() {
  const [holiday, setHoliday] = useState<Holiday>(null);

  useEffect(() => {
    setHoliday(getHoliday());
  }, []);

  if (!holiday || !holidayStyles[holiday]) return null;

  const style = holidayStyles[holiday];
  const wrapperStyle = {
    position: 'absolute' as const,
    top: style.top,
    right: style.right,
    transform: `rotate(${style.rotate})`,
    zIndex: 20,
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
  };

  // Render the appropriate overlay based on holiday
  switch (holiday) {
    case 'christmas':
      return (
        <div style={wrapperStyle}>
          <Image
            src="/images/christmas-hat.png"
            alt="Christmas hat"
            width={style.size}
            height={style.size}
          />
        </div>
      );

    case 'newyear':
      return (
        <div style={wrapperStyle}>
          <PartyHat size={style.size} />
        </div>
      );

    case 'stpatrick':
      return (
        <div style={wrapperStyle}>
          <LeprechaunHat size={style.size} />
        </div>
      );

    case 'halloween':
      return (
        <div style={wrapperStyle}>
          <WitchHat size={style.size} />
        </div>
      );

    default:
      return null;
  }
}

/* ###########################################################
   ###   SVG Accessories                                    ###
   ########################################################### */

function PartyHat({ size }: { size: number }) {
  const newYear = new Date().getFullYear() + 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      {/* Party hat cone */}
      <path
        d="M50 5 L75 85 L25 85 Z"
        fill="#2563eb"
      />
      {/* Highlight stripe */}
      <path
        d="M50 5 L58 45 L42 45 Z"
        fill="#3b82f6"
      />
      {/* Year text */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="16"
        fontWeight="bold"
        fill="#FFD700"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        {newYear}
      </text>
      {/* Pom pom */}
      <circle cx="50" cy="8" r="8" fill="#FFD700" />
      <circle cx="48" cy="6" r="3" fill="#FFF8DC" opacity="0.6" />
      {/* Brim */}
      <ellipse cx="50" cy="85" rx="28" ry="6" fill="#1d4ed8" />
    </svg>
  );
}

function HeartAccessory({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
    >
      {/* Headband */}
      <path
        d="M10 70 Q50 50 90 70"
        fill="none"
        stroke="#e91e63"
        strokeWidth="4"
      />
      {/* Hearts on springs */}
      <path d="M30 70 Q30 40 35 30" fill="none" stroke="#ff6b9d" strokeWidth="2" />
      <path d="M70 70 Q70 45 65 35" fill="none" stroke="#ff6b9d" strokeWidth="2" />
      {/* Left heart */}
      <path
        d="M35 30 C35 25 30 20 25 20 C15 20 15 30 15 30 C15 45 35 50 35 50 C35 50 55 45 55 30 C55 30 55 20 45 20 C40 20 35 25 35 30"
        fill="#e91e63"
        transform="translate(-5, -15) scale(0.6)"
      />
      {/* Right heart */}
      <path
        d="M35 30 C35 25 30 20 25 20 C15 20 15 30 15 30 C15 45 35 50 35 50 C35 50 55 45 55 30 C55 30 55 20 45 20 C40 20 35 25 35 30"
        fill="#ec407a"
        transform="translate(45, -10) scale(0.5)"
      />
    </svg>
  );
}

function LeprechaunHat({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      {/* Hat brim */}
      <ellipse cx="50" cy="78" rx="45" ry="10" fill="#1B5E20" />
      <ellipse cx="50" cy="76" rx="42" ry="8" fill="#2E7D32" />
      {/* Hat body */}
      <rect x="25" y="25" width="50" height="53" rx="3" fill="#2E7D32" />
      <rect x="27" y="27" width="15" height="51" fill="#388E3C" opacity="0.4" />
      {/* Hat top */}
      <ellipse cx="50" cy="25" rx="25" ry="6" fill="#1B5E20" />
      {/* Black band */}
      <rect x="25" y="60" width="50" height="12" fill="#1a1a1a" />
      {/* Gold buckle */}
      <rect x="40" y="58" width="20" height="16" rx="2" fill="#FFD700" />
      <rect x="44" y="62" width="12" height="8" rx="1" fill="#1a1a1a" />
    </svg>
  );
}

function BunnyEars({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
    >
      {/* Headband */}
      <path
        d="M15 85 Q50 70 85 85"
        fill="none"
        stroke="#F8BBD9"
        strokeWidth="6"
      />
      {/* Left ear outer */}
      <ellipse cx="30" cy="40" rx="12" ry="35" fill="#FFFFFF" />
      {/* Left ear inner */}
      <ellipse cx="30" cy="42" rx="6" ry="25" fill="#FFCDD2" />
      {/* Right ear outer */}
      <ellipse cx="70" cy="35" rx="12" ry="35" fill="#FFFFFF" transform="rotate(10, 70, 35)" />
      {/* Right ear inner */}
      <ellipse cx="70" cy="37" rx="6" ry="25" fill="#FFCDD2" transform="rotate(10, 70, 37)" />
    </svg>
  );
}

function WitchHat({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      {/* Hat cone */}
      <path
        d="M50 2 Q55 30 70 50 L75 80 L25 80 L30 50 Q45 30 50 2"
        fill="#1a1a1a"
      />
      {/* Hat tip bend */}
      <path
        d="M50 2 Q70 5 75 25"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Highlight */}
      <path
        d="M40 25 Q45 40 42 55"
        fill="none"
        stroke="#333"
        strokeWidth="3"
        opacity="0.5"
      />
      {/* Brim */}
      <ellipse cx="50" cy="80" rx="45" ry="12" fill="#1a1a1a" />
      <ellipse cx="50" cy="78" rx="42" ry="10" fill="#2d2d2d" />
      {/* Purple band */}
      <rect x="28" y="68" width="44" height="8" fill="#7B1FA2" />
      {/* Buckle */}
      <rect x="42" y="66" width="16" height="12" rx="2" fill="#FF6D00" />
      <rect x="45" y="69" width="10" height="6" rx="1" fill="#1a1a1a" />
    </svg>
  );
}
