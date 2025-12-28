/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SEASONAL PARTICLES - Unified particle effects      ###
   ###   Snowfall, hearts, shamrocks, leaves, confetti      ###
   ###   Last Updated: 28-12-2025                           ###
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

type ParticleType = 'snow' | 'hearts' | 'shamrocks' | 'leaves' | 'confetti' | 'ghosts' | 'none';

function getParticleType(holiday: Holiday, season: Season): ParticleType {
  // Holiday-specific particles
  switch (holiday) {
    case 'christmas':
    case 'newyear':
      return holiday === 'newyear' ? 'confetti' : 'snow';
    case 'valentine':
      return 'none';
    case 'stpatrick':
      return 'none'; // Just hat, no particles
    case 'halloween':
      return 'none'; // Just hat + spider webs/bats
    case 'easter':
      return 'none'; // Easter uses pastel theme instead
  }

  // No season-specific particles (winter snow handled by christmas holiday)
  return 'none';
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

function FourLeafClover({ size, opacity, color }: { size: number; opacity: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={color}
      style={{ opacity }}
    >
      {/* Four heart-shaped leaves */}
      {/* Top leaf */}
      <path d="M50 10 C50 10 35 10 35 25 C35 35 50 45 50 45 C50 45 65 35 65 25 C65 10 50 10 50 10" />
      {/* Bottom leaf */}
      <path d="M50 90 C50 90 35 90 35 75 C35 65 50 55 50 55 C50 55 65 65 65 75 C65 90 50 90 50 90" />
      {/* Left leaf */}
      <path d="M10 50 C10 50 10 35 25 35 C35 35 45 50 45 50 C45 50 35 65 25 65 C10 65 10 50 10 50" />
      {/* Right leaf */}
      <path d="M90 50 C90 50 90 35 75 35 C65 35 55 50 55 50 C55 50 65 65 75 65 C90 65 90 50 90 50" />
      {/* Stem */}
      <rect x="47" y="55" width="6" height="30" rx="3" fill={color} />
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

function GhostShape({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity }}
    >
      {/* Ghost body */}
      <path
        d="M50 10 C25 10 15 35 15 55 L15 85 L25 75 L35 85 L45 75 L55 85 L65 75 L75 85 L85 75 L85 55 C85 35 75 10 50 10"
        fill="rgba(255,255,255,0.9)"
      />
      {/* Eyes */}
      <ellipse cx="38" cy="45" rx="8" ry="10" fill="#1a1a1a" />
      <ellipse cx="62" cy="45" rx="8" ry="10" fill="#1a1a1a" />
      {/* Mouth */}
      <ellipse cx="50" cy="65" rx="10" ry="8" fill="#1a1a1a" />
    </svg>
  );
}

/* ###########################################################
   ###   Main Component                                     ###
   ########################################################### */

export default function SeasonalParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleType, setParticleType] = useState<ParticleType>('none');
  const [visible, setVisible] = useState(true);

  // Track scroll position to hide particles past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      // Fade out by 80% of hero height
      setVisible(scrollY < heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const holiday = getHoliday();
    const season = getSeason();
    const type = getParticleType(holiday, season);
    setParticleType(type);

    if (type === 'none') return;

    const count = type === 'confetti' ? 80 : type === 'ghosts' ? 25 : 50;
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
      <div
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden transition-opacity duration-700"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="fixed pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: -20,
              animationName: `${particleType}-fall`,
              animationDuration: `${particle.duration}s`,
              animationTimingFunction: 'linear',
              animationDelay: `${particle.delay}s`,
              animationIterationCount: 'infinite',
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
    case 'ghosts': return Math.random() * 20 + 20;
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
    case 'ghosts': return Math.random() * 12 + 12;
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
    case 'ghosts': return ['#ffffff'];
    default: return ['#ffffff'];
  }
}

function getAnimation(type: ParticleType): string {
  if (type === 'ghosts') {
    return `
      @keyframes ghosts-fall {
        0% {
          transform: translateY(-20px) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: var(--particle-opacity, 0.6);
        }
        25% {
          transform: translateY(25vh) translateX(30px);
        }
        50% {
          transform: translateY(50vh) translateX(-30px);
        }
        75% {
          transform: translateY(75vh) translateX(30px);
        }
        90% {
          opacity: var(--particle-opacity, 0.6);
        }
        100% {
          transform: translateY(100vh) translateX(0);
          opacity: 0;
        }
      }
    `;
  }

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
      return <FourLeafClover size={particle.size} opacity={particle.opacity} color={particle.color!} />;
    case 'leaves':
      return <LeafShape size={particle.size} opacity={particle.opacity} color={particle.color!} rotation={particle.rotation!} />;
    case 'confetti':
      return <ConfettiShape size={particle.size} opacity={particle.opacity} color={particle.color!} rotation={particle.rotation!} />;
    case 'ghosts':
      return <GhostShape size={particle.size} opacity={particle.opacity} />;
    default:
      return null;
  }
}
