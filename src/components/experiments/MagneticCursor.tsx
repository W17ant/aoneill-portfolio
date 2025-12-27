'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

export default function MagneticCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Smooth cursor follow
  useEffect(() => {
    const animate = () => {
      setCursorPos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.15,
        y: prev.y + (targetPos.y - prev.y) * 0.15,
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targetPos]);

  // Track mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTargetPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Magnetic button effect
  const handleButtonMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  }, []);

  const handleButtonMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
  }, []);

  // Card tilt effect
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;

    // Update glow position
    const glow = card.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(96, 165, 250, 0.15), transparent 50%)`;
    }

    setActiveCard(index);
  }, []);

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    const glow = e.currentTarget.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.background = 'transparent';
    }
    setActiveCard(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full max-w-4xl mx-auto p-10 rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 138, 0.4))',
        minHeight: '500px',
      }}
    >
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className={`pointer-events-none absolute z-50 transition-transform duration-100 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            activeCard !== null ? 'w-16 h-16 bg-white/10' : 'w-8 h-8 bg-white/20'
          }`}
          style={{ backdropFilter: 'blur(4px)' }}
        />
      </div>
      <div
        ref={cursorDotRef}
        className={`pointer-events-none absolute z-50 w-2 h-2 bg-white rounded-full transition-opacity duration-200 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-3">Magnetic Interactions</h2>
        <p className="text-white/70 mb-8 max-w-lg">
          Hover over buttons and cards to see magnetic pull and 3D tilt effects.
          The custom cursor follows your mouse with smooth interpolation.
        </p>

        {/* Magnetic buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          {['Primary Action', 'Secondary', 'Outline'].map((label, i) => (
            <button
              key={label}
              onMouseMove={handleButtonMouseMove}
              onMouseLeave={handleButtonMouseLeave}
              onMouseEnter={() => setIsHovering(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                i === 0
                  ? 'bg-white text-slate-900'
                  : i === 1
                  ? 'bg-blue-500 text-white'
                  : 'border-2 border-white/30 text-white'
              }`}
              style={{ cursor: 'none' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 3D Tilt cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Physics', desc: 'Smooth interpolation and magnetic pull calculations', icon: '⚡' },
            { title: '3D Transform', desc: 'Perspective-based rotation on mouse position', icon: '🎯' },
            { title: 'Glow Effect', desc: 'Dynamic radial gradient follows cursor', icon: '✨' },
          ].map((card, i) => (
            <div
              key={card.title}
              onMouseMove={(e) => handleCardMouseMove(e, i)}
              onMouseLeave={handleCardMouseLeave}
              className="relative p-6 rounded-2xl transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'none',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glow overlay */}
              <div className="card-glow absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200" />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{
                  background: 'rgba(96, 165, 250, 0.2)',
                  transform: 'translateZ(20px)',
                }}
              >
                {card.icon}
              </div>
              <h3
                className="text-lg font-bold text-white mb-2"
                style={{ transform: 'translateZ(30px)' }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm text-white/60"
                style={{ transform: 'translateZ(10px)' }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3), transparent)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent)' }}
      />
    </div>
  );
}
