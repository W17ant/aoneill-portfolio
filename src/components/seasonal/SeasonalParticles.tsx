/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SEASONAL PARTICLES - Unified particle effects      ###
   ###   Snowfall, hearts, shamrocks, leaves, confetti      ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import {
  getSeason,
  getHoliday,
  type Season,
  type Holiday,
} from '@/lib/seasonal';

/* ###########################################################
   ###   Particle Types & Config                            ###
   ########################################################### */

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  rotation?: number;
  color?: string;
}

type ParticleType = 'snow' | 'hearts' | 'shamrocks' | 'leaves' | 'confetti' | 'none';

function getParticleType(holiday: Holiday, season: Season): ParticleType {
  // Holiday-specific particles
  switch (holiday) {
    case 'christmas':
    case 'newyear':
      return holiday === 'newyear' ? 'confetti' : 'snow';
    case 'valentine':
      return 'hearts';
    case 'stpatrick':
      return 'shamrocks';
    case 'halloween':
      return 'none'; // Halloween has different effects
    case 'easter':
      return 'none'; // Easter uses pastel theme instead
  }

  // Season-specific particles
  switch (season) {
    case 'winter':
      return 'snow';
    case 'autumn':
      return 'leaves';
    default:
      return 'none';
  }
}

/* ###########################################################
   ###   Particle Shapes                                    ###
   ########################################################### */

function SnowflakeShape({ size, opacity }: { size: number; opacity: number }) {
  return (
    <div
      className="rounded-full bg-white"
      style={{ width: size, height: size, opacity }}
    />
  );
}

function HeartShape({ size, opacity, color }: { size: number; opacity: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ opacity }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ShamrockShape({ size, opacity, color }: { size: number; opacity: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ opacity }}
    >
      <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.8 3.7C7.3 10.9 6 12.7 6 15c0 2.8 2.2 5 5 5h2c2.8 0 5-2.2 5-5 0-2.3-1.3-4.1-3.3-4.8 1.1-.9 1.8-2.2 1.8-3.7C16.5 4 14.5 2 12 2zm0 2c1.4 0 2.5 1.1 2.5 2.5S13.4 9 12 9 9.5 7.9 9.5 6.5 10.6 4 12 4zm-3 8c0-.6.1-1.1.3-1.6.8.4 1.7.6 2.7.6s1.9-.2 2.7-.6c.2.5.3 1 .3 1.6 0 1.7-1.3 3-3 3s-3-1.3-3-3z" />
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <circle cx="12" cy="6" r="3" />
      <rect x="11" y="14" width="2" height="8" rx="1" />
    </svg>
  );
}

function LeafShape({ size, opacity, color, rotation }: { size: number; opacity: number; color: string; rotation: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ opacity, transform: `rotate(${rotation}deg)` }}
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 8.4-2.52 10.14-7.27A11.52 11.52 0 0019 9.23 9.77 9.77 0 0017 8zm-4.5 5.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function ConfettiShape({ size, opacity, color, rotation }: { size: number; opacity: number; color: string; rotation: number }) {
  return (
    <div
      style={{
        width: size,
        height: size * 2.5,
        backgroundColor: color,
        opacity,
        transform: `rotate(${rotation}deg)`,
        borderRadius: 2,
      }}
    />
  );
}

/* ###########################################################
   ###   Main Component                                     ###
   ########################################################### */

export default function SeasonalParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleType, setParticleType] = useState<ParticleType>('none');

  useEffect(() => {
    const holiday = getHoliday();
    const season = getSeason();
    const type = getParticleType(holiday, season);
    setParticleType(type);

    if (type === 'none') return;

    const count = type === 'confetti' ? 80 : 50;
    const colors = getColors(type);

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: getSize(type),
      delay: Math.random() * 10,
      duration: getDuration(type),
      opacity: Math.random() * 0.6 + 0.3,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);
  }, []);

  if (particleType === 'none' || particles.length === 0) return null;

  const animation = getAnimation(particleType);

  return (
    <>
      <style>{animation}</style>
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="fixed pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: -20,
              animation: `${particleType}-fall ${particle.duration}s linear ${particle.delay}s infinite`,
            }}
          >
            {renderParticle(particleType, particle)}
          </div>
        ))}
      </div>
    </>
  );
}

/* ###########################################################
   ###   Helper Functions                                   ###
   ########################################################### */

function getSize(type: ParticleType): number {
  switch (type) {
    case 'snow': return Math.random() * 4 + 2;
    case 'hearts': return Math.random() * 12 + 10;
    case 'shamrocks': return Math.random() * 14 + 12;
    case 'leaves': return Math.random() * 16 + 14;
    case 'confetti': return Math.random() * 6 + 4;
    default: return 4;
  }
}

function getDuration(type: ParticleType): number {
  switch (type) {
    case 'snow': return Math.random() * 10 + 10;
    case 'hearts': return Math.random() * 8 + 8;
    case 'shamrocks': return Math.random() * 10 + 8;
    case 'leaves': return Math.random() * 12 + 10;
    case 'confetti': return Math.random() * 6 + 4;
    default: return 10;
  }
}

function getColors(type: ParticleType): string[] {
  switch (type) {
    case 'snow': return ['#ffffff'];
    case 'hearts': return ['#e91e63', '#ff6b9d', '#f48fb1', '#ec407a'];
    case 'shamrocks': return ['#009A44', '#2E7D32', '#4CAF50', '#81C784'];
    case 'leaves': return ['#FF8A65', '#FF7043', '#A1887F', '#FFB74D', '#D84315'];
    case 'confetti': return ['#FFD700', '#C0C0C0', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    default: return ['#ffffff'];
  }
}

function getAnimation(type: ParticleType): string {
  const sway = type === 'leaves' ? 'translateX(100px)' : 'translateX(20px)';
  const spin = type === 'leaves' || type === 'confetti' ? 'rotate(720deg)' : 'rotate(360deg)';

  return `
    @keyframes ${type}-fall {
      0% {
        transform: translateY(-20px) translateX(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: var(--particle-opacity, 0.6);
      }
      50% {
        transform: translateY(50vh) ${sway} ${spin};
      }
      90% {
        opacity: var(--particle-opacity, 0.6);
      }
      100% {
        transform: translateY(100vh) translateX(0) rotate(1080deg);
        opacity: 0;
      }
    }
  `;
}

function renderParticle(type: ParticleType, particle: Particle) {
  switch (type) {
    case 'snow':
      return <SnowflakeShape size={particle.size} opacity={particle.opacity} />;
    case 'hearts':
      return <HeartShape size={particle.size} opacity={particle.opacity} color={particle.color!} />;
    case 'shamrocks':
      return <ShamrockShape size={particle.size} opacity={particle.opacity} color={particle.color!} />;
    case 'leaves':
      return <LeafShape size={particle.size} opacity={particle.opacity} color={particle.color!} rotation={particle.rotation!} />;
    case 'confetti':
      return <ConfettiShape size={particle.size} opacity={particle.opacity} color={particle.color!} rotation={particle.rotation!} />;
    default:
      return null;
  }
}
