/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   MAGNETIC CURSOR - Custom cursor with magnetic      ###
   ###   pull effects and 3D card transforms                ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Zap, Target, Sparkles, Download } from 'lucide-react';

/* ###########################################################
   ###   1. Main Component                                  ###
   ########################################################### */

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

  /* ###########################################################
     ###   2. Download as HTML Function                       ###
     ###   Generates a standalone HTML file with full effects ###
     ########################################################### */

  const downloadAsHTML = () => {
    const html = `<!DOCTYPE html>
<!--
  ============================================================
  MAGNETIC CURSOR & 3D CARD EFFECTS
  ============================================================

  A collection of interactive UI effects including:
  - Custom cursor with smooth interpolation
  - Magnetic pull effect on buttons
  - 3D perspective tilt on cards
  - Dynamic glow that follows cursor

  Created with the Magnetic Cursor Lab at aoneill.co.uk/lab/magnetic-cursor

  HOW TO CUSTOMIZE:
  - Search for "CUSTOMIZE" comments to find editable sections
  - Modify colors in the CSS variables section
  - Adjust physics values (interpolation speed, tilt amount, etc.)
  - Add your own magnetic elements

  KEY CONCEPTS:
  - Linear interpolation (lerp) for smooth cursor following
  - CSS transforms for magnetic pull and 3D effects
  - Perspective and rotateX/Y for 3D tilt illusion
  - Radial gradients for cursor-following glow

  ============================================================
-->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magnetic Cursor Effects</title>

  <!-- ========================================================
       STYLES - Modify these to change appearance
       ======================================================== -->
  <style>
    /* ----- CSS VARIABLES ----- */
    /* CUSTOMIZE: Change these to adjust colors throughout */
    :root {
      --cursor-size: 32px;
      --cursor-size-hover: 64px;
      --cursor-color: rgba(255, 255, 255, 0.2);
      --cursor-color-hover: rgba(255, 255, 255, 0.1);
      --accent-blue: rgba(96, 165, 250, 1);
      --accent-blue-dim: rgba(96, 165, 250, 0.2);
      --card-bg: rgba(255, 255, 255, 0.05);
      --card-border: rgba(255, 255, 255, 0.1);
    }

    /* ----- RESET & BASE ----- */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
    }

    /* ----- CONTAINER ----- */
    .container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      padding: 60px 40px;
      overflow: hidden;
    }

    /* ----- CUSTOM CURSOR ----- */
    /* The cursor consists of two elements: outer ring and center dot */
    .cursor {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: opacity 0.2s;
    }

    .cursor-ring {
      width: var(--cursor-size);
      height: var(--cursor-size);
      border-radius: 50%;
      background: var(--cursor-color);
      backdrop-filter: blur(4px);
      transition: width 0.2s, height 0.2s, background 0.2s;
    }

    .cursor-ring.expanded {
      width: var(--cursor-size-hover);
      height: var(--cursor-size-hover);
      background: var(--cursor-color-hover);
    }

    .cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
    }

    /* ----- CONTENT ----- */
    .content {
      position: relative;
      z-index: 10;
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 12px;
    }

    .subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 40px;
      max-width: 500px;
      line-height: 1.6;
    }

    /* ----- MAGNETIC BUTTONS ----- */
    /* CUSTOMIZE: Adjust button styles here */
    .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 48px;
    }

    .magnetic-btn {
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      border: none;
      cursor: none; /* Hide default cursor */
      transition: transform 0.15s ease-out, box-shadow 0.2s;
    }

    .magnetic-btn.primary {
      background: white;
      color: #0f172a;
    }

    .magnetic-btn.secondary {
      background: #3b82f6;
      color: white;
    }

    .magnetic-btn.outline {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .magnetic-btn:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    /* ----- 3D TILT CARDS ----- */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .tilt-card {
      position: relative;
      padding: 28px;
      border-radius: 16px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      cursor: none;
      transform-style: preserve-3d;
      transition: transform 0.15s ease-out;
    }

    /* Glow overlay that follows cursor */
    .card-glow {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      pointer-events: none;
      transition: background 0.2s;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--accent-blue-dim);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      transform: translateZ(20px);
    }

    .card-icon svg {
      width: 24px;
      height: 24px;
      color: var(--accent-blue);
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
      transform: translateZ(30px);
    }

    .card-desc {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.5;
      transform: translateZ(10px);
    }

    /* ----- BACKGROUND DECORATIONS ----- */
    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }

    .bg-blob.blue {
      top: -100px;
      left: -100px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(96, 165, 250, 0.3), transparent);
      opacity: 0.5;
    }

    .bg-blob.green {
      bottom: -80px;
      right: -80px;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent);
      opacity: 0.4;
    }

    /* ----- CREDIT ----- */
    .credit {
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    .credit a { color: rgba(255, 255, 255, 0.7); }
  </style>
</head>
<body>
  <!-- Custom cursor elements -->
  <div class="cursor" id="cursor">
    <div class="cursor-ring" id="cursorRing"></div>
  </div>
  <div class="cursor-dot" id="cursorDot"></div>

  <div class="container" id="container">
    <!-- Background decoration -->
    <div class="bg-blob blue"></div>
    <div class="bg-blob green"></div>

    <div class="content">
      <h1>Magnetic Interactions</h1>
      <p class="subtitle">
        Hover over buttons and cards to see magnetic pull and 3D tilt effects.
        The custom cursor follows your mouse with smooth interpolation.
      </p>

      <!-- CUSTOMIZE: Add or modify buttons here -->
      <div class="buttons">
        <button class="magnetic-btn primary">Primary Action</button>
        <button class="magnetic-btn secondary">Secondary</button>
        <button class="magnetic-btn outline">Outline</button>
      </div>

      <!-- CUSTOMIZE: Add or modify cards here -->
      <div class="cards">
        <div class="tilt-card">
          <div class="card-glow"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h3 class="card-title">Physics</h3>
          <p class="card-desc">Smooth interpolation and magnetic pull calculations</p>
        </div>

        <div class="tilt-card">
          <div class="card-glow"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <h3 class="card-title">3D Transform</h3>
          <p class="card-desc">Perspective-based rotation on mouse position</p>
        </div>

        <div class="tilt-card">
          <div class="card-glow"></div>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"></path>
              <path d="M5 19l1 3 3-1-1-3-3 1z"></path>
              <path d="M19 19l-1 3-3-1 1-3 3 1z"></path>
            </svg>
          </div>
          <h3 class="card-title">Glow Effect</h3>
          <p class="card-desc">Dynamic radial gradient follows cursor</p>
        </div>
      </div>
    </div>
  </div>

  <p class="credit">Created with <a href="https://aoneill.co.uk/lab/magnetic-cursor" target="_blank">Magnetic Cursor Lab</a></p>

  <!-- ========================================================
       JAVASCRIPT - Interaction handlers and animations
       ======================================================== -->
  <script>
    // ============================================================
    // CONFIGURATION - CUSTOMIZE THESE VALUES
    // ============================================================
    const config = {
      // Cursor interpolation speed (0-1, higher = faster follow)
      cursorLerp: 0.15,

      // Magnetic button pull strength (0-1)
      magneticStrength: 0.3,

      // Card tilt amount in degrees
      tiltAmount: 10,

      // Card scale on hover
      hoverScale: 1.02
    };

    // ============================================================
    // STATE
    // ============================================================
    let cursorX = 0, cursorY = 0;     // Actual cursor position
    let targetX = 0, targetY = 0;     // Target position (raw mouse)
    let isHovering = false;
    let isOverCard = false;

    // ============================================================
    // DOM ELEMENTS
    // ============================================================
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    const cursorDot = document.getElementById('cursorDot');
    const container = document.getElementById('container');
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    const tiltCards = document.querySelectorAll('.tilt-card');

    // ============================================================
    // CURSOR ANIMATION
    // ============================================================
    // Uses linear interpolation (lerp) for smooth following
    // Formula: current += (target - current) * speed
    function animateCursor() {
      // Lerp towards target position
      cursorX += (targetX - cursorX) * config.cursorLerp;
      cursorY += (targetY - cursorY) * config.cursorLerp;

      // Apply position to cursor elements
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    }

    // Start animation loop
    animateCursor();

    // ============================================================
    // MOUSE TRACKING
    // ============================================================
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Show/hide cursor in container
    container.addEventListener('mouseenter', () => {
      isHovering = true;
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });

    container.addEventListener('mouseleave', () => {
      isHovering = false;
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });

    // ============================================================
    // MAGNETIC BUTTON EFFECT
    // ============================================================
    // Buttons are pulled towards the cursor when hovering
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();

        // Calculate distance from button center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Apply magnetic pull (button moves toward cursor)
        const pullX = deltaX * config.magneticStrength;
        const pullY = deltaY * config.magneticStrength;

        btn.style.transform = \`translate(\${pullX}px, \${pullY}px)\`;
      });

      btn.addEventListener('mouseleave', () => {
        // Reset position when mouse leaves
        btn.style.transform = 'translate(0, 0)';
      });
    });

    // ============================================================
    // 3D CARD TILT EFFECT
    // ============================================================
    // Cards rotate based on cursor position relative to their center
    tiltCards.forEach(card => {
      const glow = card.querySelector('.card-glow');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        // Calculate position as -0.5 to 0.5 (center is 0)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Apply 3D rotation
        // rotateY: horizontal tilt (positive x = right side up)
        // rotateX: vertical tilt (negative y = top side toward viewer)
        const rotateY = x * config.tiltAmount;
        const rotateX = -y * config.tiltAmount;

        card.style.transform = \`
          perspective(1000px)
          rotateY(\${rotateY}deg)
          rotateX(\${rotateX}deg)
          scale(\${config.hoverScale})
        \`;

        // Update glow position to follow cursor
        if (glow) {
          const glowX = (x + 0.5) * 100;
          const glowY = (y + 0.5) * 100;
          glow.style.background = \`
            radial-gradient(
              circle at \${glowX}% \${glowY}%,
              rgba(96, 165, 250, 0.15),
              transparent 50%
            )
          \`;
        }

        // Expand cursor ring
        cursorRing.classList.add('expanded');
        isOverCard = true;
      });

      card.addEventListener('mouseleave', () => {
        // Reset card transform
        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';

        // Clear glow
        if (glow) {
          glow.style.background = 'transparent';
        }

        // Contract cursor ring
        cursorRing.classList.remove('expanded');
        isOverCard = false;
      });
    });

    // ============================================================
    // CURSOR RING SIZE CHANGE FOR BUTTONS
    // ============================================================
    magneticBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        cursorRing.classList.add('expanded');
      });
      btn.addEventListener('mouseleave', () => {
        if (!isOverCard) {
          cursorRing.classList.remove('expanded');
        }
      });
    });
  </script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'magnetic-cursor-effects.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      {/* Demo Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative w-full p-10 rounded-3xl overflow-hidden"
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
              { title: 'Physics', desc: 'Smooth interpolation and magnetic pull calculations', Icon: Zap },
              { title: '3D Transform', desc: 'Perspective-based rotation on mouse position', Icon: Target },
              { title: 'Glow Effect', desc: 'Dynamic radial gradient follows cursor', Icon: Sparkles },
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(96, 165, 250, 0.2)',
                    transform: 'translateZ(20px)',
                  }}
                >
                  <card.Icon size={24} className="text-blue-400" />
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

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Download Button */}
        <div className="card p-5">
          <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--ink)' }}>
            Use in Your Project
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--ink-secondary)' }}>
            Download a standalone HTML file with all effects and comprehensive comments.
          </p>
          <button
            onClick={downloadAsHTML}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download HTML
          </button>
        </div>

        {/* How it works */}
        <div className="card p-5">
          <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--ink)' }}>
            How it works
          </h3>
          <ul className="text-sm space-y-2" style={{ color: 'var(--ink-secondary)' }}>
            <li className="flex gap-2">
              <span style={{ color: 'var(--accent)' }}>•</span>
              Linear interpolation for smooth cursor follow
            </li>
            <li className="flex gap-2">
              <span style={{ color: 'var(--accent)' }}>•</span>
              CSS transform translate for magnetic pull
            </li>
            <li className="flex gap-2">
              <span style={{ color: 'var(--accent)' }}>•</span>
              perspective() + rotateX/Y for 3D tilt
            </li>
            <li className="flex gap-2">
              <span style={{ color: 'var(--accent)' }}>•</span>
              Radial gradient at cursor position for glow
            </li>
          </ul>
        </div>

        {/* Config values */}
        <div className="card p-5">
          <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--ink)' }}>
            Key Values
          </h3>
          <div className="font-mono text-xs space-y-1" style={{ color: 'var(--ink-muted)' }}>
            <div><span style={{ color: 'var(--accent)' }}>cursorLerp:</span> 0.15</div>
            <div><span style={{ color: 'var(--accent)' }}>magneticStrength:</span> 0.3</div>
            <div><span style={{ color: 'var(--accent)' }}>tiltAmount:</span> 10°</div>
            <div><span style={{ color: 'var(--accent)' }}>hoverScale:</span> 1.02</div>
          </div>
        </div>
      </div>
    </div>
  );
}
