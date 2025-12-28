'use client';

import { useState, useEffect, useRef } from 'react';

export default function MobileAboutCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasSwungIn, setHasSwungIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for swing-in animation
  useEffect(() => {
    if (!containerRef.current || hasSwungIn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasSwungIn) {
            setHasSwungIn(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasSwungIn]);

  return (
    <div className="lg:hidden flex justify-center py-8 px-5">
      {/* Card container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ perspective: '1000px' }}
      >
        {/* Swing wrapper for animation */}
        <div
          className="transition-all duration-1000 ease-out"
          style={{
            transformOrigin: 'top center',
            transform: hasSwungIn
              ? 'rotate(0deg) translateX(0)'
              : 'rotate(15deg) translateX(60px)',
            opacity: hasSwungIn ? 1 : 0,
          }}
        >
          {/* Clip - brushed metal */}
          <div
            className="w-[72px] h-[44px] mx-auto rounded-xl relative"
            style={{
              background: `linear-gradient(180deg,
                rgba(255,255,255,.85) 0%,
                rgba(203,213,225,.70) 20%,
                rgba(148,163,184,.55) 52%,
                rgba(71,85,105,.65) 78%,
                rgba(2,6,23,.95) 100%)`,
              border: '1px solid rgba(255,255,255,.18)',
              boxShadow: '0 14px 22px rgba(0,0,0,.55)',
            }}
          >
            <div
              className="absolute left-2.5 right-2.5 top-2 h-2.5 rounded-full opacity-80"
              style={{
                background: `linear-gradient(90deg,
                  rgba(255,255,255,.08),
                  rgba(255,255,255,.55),
                  rgba(255,255,255,.10))`,
              }}
            />
          </div>

          {/* Badge card container - 3D flip */}
          <div
            className="mt-3 w-[300px] relative"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
          {/* FRONT SIDE - Profile */}
          <div
            className="w-full rounded-[18px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,.92)',
              color: 'rgba(2,6,23,.92)',
              border: '1px solid rgba(255,255,255,.70)',
              boxShadow: '0 26px 60px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.55) inset',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Top bar */}
            <div
              className="px-4 py-3.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(2,6,23,.08)' }}
            >
              <div
                className="text-xs font-extrabold tracking-[.16em] uppercase"
                style={{ color: 'rgba(2,6,23,.60)' }}
              >
                Portfolio
              </div>
              <div
                className="text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1.5 rounded-full"
                style={{
                  background: 'rgba(2,6,23,.06)',
                  border: '1px solid rgba(2,6,23,.10)',
                  color: 'rgba(2,6,23,.65)',
                }}
              >
                Visitor
              </div>
            </div>

            {/* Centered photo */}
            <div className="flex justify-center py-4">
              <div
                className="w-[120px] h-[120px] rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(2,6,23,.05)',
                  border: '1px solid rgba(2,6,23,.10)',
                }}
              >
                <img
                  src="/images/Selfie.png"
                  alt="Antony O'Neill"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>

            {/* Name and details - centered */}
            <div className="text-center px-4 pb-4">
              <div
                className="text-xl font-black leading-tight tracking-tight"
                style={{ color: 'rgba(2,6,23,.92)' }}
              >
                Antony O'Neill
              </div>
              <div
                className="text-[13px] mt-1.5 font-semibold"
                style={{ color: 'rgba(2,6,23,.58)' }}
              >
                Full-stack Developer
              </div>
              <div
                className="text-[12px] mt-3 leading-relaxed"
                style={{ color: 'rgba(2,6,23,.55)' }}
              >
                Next.js · React · TypeScript · AI/ML
              </div>
              <div
                className="text-[13px] mt-3 font-semibold"
                style={{ color: 'rgba(2,6,23,.58)' }}
              >
                aoneill.co.uk
              </div>
            </div>

            {/* Footer with flip button */}
            <div
              className="px-4 py-3 flex items-center justify-between font-mono text-xs"
              style={{
                borderTop: '1px solid rgba(2,6,23,.08)',
                color: 'rgba(2,6,23,.62)',
              }}
            >
              <span>ID: AO-2025</span>
              <button
                onClick={() => setIsFlipped(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors hover:bg-[rgba(2,6,23,.08)]"
                style={{ color: 'rgba(2,6,23,.62)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                About
              </button>
            </div>
          </div>

          {/* BACK SIDE - About Me */}
          <div
            className="w-full rounded-[18px] overflow-hidden absolute top-0 left-0"
            style={{
              background: 'rgba(255,255,255,.92)',
              color: 'rgba(2,6,23,.92)',
              border: '1px solid rgba(255,255,255,.70)',
              boxShadow: '0 26px 60px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.55) inset',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Top bar */}
            <div
              className="px-4 py-3.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(2,6,23,.08)' }}
            >
              <div
                className="text-xs font-extrabold tracking-[.16em] uppercase"
                style={{ color: 'rgba(2,6,23,.60)' }}
              >
                About Me
              </div>
              <div
                className="text-[11px] font-extrabold tracking-wider uppercase"
                style={{ color: 'rgba(2,6,23,.45)' }}
              >
                Antony O'Neill
              </div>
            </div>

            {/* About content */}
            <div className="p-4">
              <p
                className="text-[12px] leading-relaxed mb-3"
                style={{ color: 'rgba(2,6,23,.75)' }}
              >
                I'm an MSc Computer Science & AI student at St Mary's University,
                focused on machine learning, full-stack development, and building
                AI systems that solve real problems. Currently exploring
                reinforcement learning and ethical AI.
              </p>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: 'rgba(2,6,23,.75)' }}
              >
                My background in mechanical engineering gives me a unique
                perspective on problem-solving — I approach software with
                the same systematic thinking used to diagnose complex physical
                systems. I'm seeking graduate roles in software engineering
                or AI/ML where I can apply both technical depth and practical
                experience.
              </p>
            </div>

            {/* Footer with flip back button */}
            <div
              className="px-4 py-3 flex items-center justify-between font-mono text-xs"
              style={{
                borderTop: '1px solid rgba(2,6,23,.08)',
                color: 'rgba(2,6,23,.62)',
              }}
            >
              <span className="text-[11px]" style={{ color: 'rgba(2,6,23,.45)' }}>
                MSc CS & AI · St Mary's
              </span>
              <button
                onClick={() => setIsFlipped(false)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors hover:bg-[rgba(2,6,23,.08)]"
                style={{ color: 'rgba(2,6,23,.62)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                Profile
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
