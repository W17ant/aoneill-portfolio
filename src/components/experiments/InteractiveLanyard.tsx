/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   INTERACTIVE LANYARD - Lab experiment with live     ###
   ###   badge customization and downloadable HTML export   ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
  mass: number;
}

interface Constraint {
  p1: Point;
  p2: Point;
  length: number;
  originalLength: number;
  stretch: number;
}

interface BadgeConfig {
  name: string;
  title: string;
  website: string;
  eventName: string;
  badgeType: string;
}

/* ###########################################################
   ###   2. Physics Configuration                           ###
   ########################################################### */

const config = {
  segments: 19,       // Number of rope segments
  segmentLength: 10,  // Length of each segment in pixels
  gravity: 0.35,      // Gravity force applied each frame
  damping: 0.97,      // Velocity damping (0-1, higher = less friction)
  stiffness: 0.85,    // How rigid the rope is (0-1)
  elasticity: 0.4,    // How stretchy the rope is
  iterations: 6,      // Constraint solving iterations per frame
  maxStretch: 2.2,    // Maximum stretch before limiting
};

/* ###########################################################
   ###   3. Interactive Lanyard Component                   ###
   ########################################################### */

export default function InteractiveLanyard() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const tensionRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const isDraggingRef = useRef(false);
  const dragPointRef = useRef<Point | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Editable badge configuration
  const [badgeConfig, setBadgeConfig] = useState<BadgeConfig>({
    name: 'Your Name',
    title: 'Your Title',
    website: 'yoursite.com',
    eventName: 'Portfolio',
    badgeType: 'Visitor',
  });

  // Create a point
  const createPoint = useCallback((x: number, y: number, pinned = false): Point => ({
    x,
    y,
    oldX: x,
    oldY: y,
    pinned,
    mass: 1,
  }), []);

  // Create a constraint
  const createConstraint = useCallback((p1: Point, p2: Point, length: number): Constraint => ({
    p1,
    p2,
    length,
    originalLength: length,
    stretch: 1,
  }), []);

  // Initialize the rope
  const initRope = useCallback(() => {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();
    const anchorX = rect.width / 2;
    const anchorY = 40;

    const points: Point[] = [];
    const constraints: Constraint[] = [];

    for (let i = 0; i <= config.segments; i++) {
      const point = createPoint(
        anchorX,
        anchorY + i * config.segmentLength * 0.7,
        i === 0
      );
      if (i === config.segments) point.mass = 3;

      points.push(point);

      if (i > 0) {
        constraints.push(createConstraint(points[i - 1], points[i], config.segmentLength));
      }
    }

    pointsRef.current = points;
    constraintsRef.current = constraints;
  }, [createPoint, createConstraint]);

  // Update point physics
  const updatePoint = useCallback((point: Point) => {
    if (point.pinned) return;

    const vx = (point.x - point.oldX) * config.damping;
    const vy = (point.y - point.oldY) * config.damping;

    point.oldX = point.x;
    point.oldY = point.y;

    point.x += vx;
    point.y += vy + config.gravity;
  }, []);

  // Resolve constraint
  const resolveConstraint = useCallback((c: Constraint) => {
    const dx = c.p2.x - c.p1.x;
    const dy = c.p2.y - c.p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    c.stretch = dist / c.originalLength;

    const maxDist = c.originalLength * config.maxStretch;
    const targetDist = Math.min(dist, maxDist);

    const stretchFactor = Math.min(c.stretch, config.maxStretch);
    const stiffness = config.stiffness + (stretchFactor - 1) * 0.15;

    const diff = (c.length - targetDist) / targetDist;
    const elasticDiff = diff * Math.min(stiffness, 0.95);

    const offsetX = dx * elasticDiff * 0.5;
    const offsetY = dy * elasticDiff * 0.5;

    if (!c.p1.pinned) {
      c.p1.x -= offsetX;
      c.p1.y -= offsetY;
    }
    if (!c.p2.pinned) {
      c.p2.x += offsetX;
      c.p2.y += offsetY;
    }
  }, []);

  // Draw pin at anchor
  const drawPin = useCallback((ctx: CanvasRenderingContext2D) => {
    const points = pointsRef.current;
    if (points.length === 0) return;

    const x = points[0].x;
    const y = points[0].y;

    const glow = ctx.createRadialGradient(x, y, 0, x, y, 20);
    glow.addColorStop(0, 'rgba(96, 165, 250, 0.3)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const pinGrad = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, 12);
    pinGrad.addColorStop(0, '#ffffff');
    pinGrad.addColorStop(0.35, '#c7d2fe');
    pinGrad.addColorStop(0.7, '#64748b');
    pinGrad.addColorStop(1, '#0b1224');

    ctx.fillStyle = pinGrad;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Draw lanyard
  const drawLanyard = useCallback((ctx: CanvasRenderingContext2D) => {
    const constraints = constraintsRef.current;
    if (constraints.length === 0) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let totalStretch = 0;

    for (let i = 0; i < constraints.length; i++) {
      const c = constraints[i];
      const stretch = c.stretch || 1;
      totalStretch += stretch;

      const baseWidth = 28;
      const width = Math.max(10, baseWidth / Math.pow(stretch, 0.6));

      const stretchNorm = Math.min(1, (stretch - 1) / (config.maxStretch - 1));
      const r = Math.floor(17 + stretchNorm * 100);
      const g = Math.floor(24 + stretchNorm * 50 - stretchNorm * 70);
      const b = Math.floor(39 - stretchNorm * 30);

      const perpX = -(c.p2.y - c.p1.y);
      const perpY = c.p2.x - c.p1.x;
      const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
      const nx = (perpX / perpLen) * width / 2;
      const ny = (perpY / perpLen) * width / 2;

      const gradient = ctx.createLinearGradient(
        c.p1.x - nx, c.p1.y - ny,
        c.p1.x + nx, c.p1.y + ny
      );

      const baseColor = `rgb(${r}, ${g}, ${b})`;
      const darkColor = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 15)}, ${Math.max(0, b - 20)})`;
      const lightColor = `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 40)}, 0.7)`;

      gradient.addColorStop(0, darkColor);
      gradient.addColorStop(0.3, baseColor);
      gradient.addColorStop(0.5, lightColor);
      gradient.addColorStop(0.7, baseColor);
      gradient.addColorStop(1, darkColor);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(c.p1.x, c.p1.y);
      ctx.lineTo(c.p2.x, c.p2.y);
      ctx.stroke();

      ctx.strokeStyle = `rgba(96, 165, 250, ${0.25 - stretchNorm * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.p1.x - nx * 0.8, c.p1.y - ny * 0.8);
      ctx.lineTo(c.p2.x - nx * 0.8, c.p2.y - ny * 0.8);
      ctx.stroke();

      ctx.strokeStyle = `rgba(34, 197, 94, ${0.2 - stretchNorm * 0.15})`;
      ctx.beginPath();
      ctx.moveTo(c.p1.x + nx * 0.8, c.p1.y + ny * 0.8);
      ctx.lineTo(c.p2.x + nx * 0.8, c.p2.y + ny * 0.8);
      ctx.stroke();

      // AO text on segments
      if (i % 4 === 2) {
        const midX = (c.p1.x + c.p2.x) / 2;
        const midY = (c.p1.y + c.p2.y) / 2;
        const angle = Math.atan2(c.p2.y - c.p1.y, c.p2.x - c.p1.x);

        ctx.save();
        ctx.translate(midX, midY);
        ctx.rotate(angle + Math.PI / 2);

        const fontSize = Math.max(8, 14 / Math.pow(stretch, 0.4));
        ctx.font = `900 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillStyle = `rgba(233, 238, 252, ${Math.max(0.3, 0.88 - stretchNorm * 0.6)})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AO', 0, 0);
        ctx.restore();
      }
    }

    // Update tension indicator
    const avgStretch = totalStretch / constraints.length;
    const tensionPercent = Math.min(100, ((avgStretch - 1) / (config.maxStretch - 1)) * 100);
    if (tensionRef.current) {
      tensionRef.current.style.width = tensionPercent + '%';
    }

    ctx.restore();
  }, []);

  // Draw connector ring
  const drawConnector = useCallback((ctx: CanvasRenderingContext2D) => {
    const points = pointsRef.current;
    if (points.length < 2) return;

    const p = points[points.length - 1];
    const ringX = p.x;
    const ringY = p.y - 5;

    ctx.save();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.arc(ringX, ringY, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(ringX, ringY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  // Position badge
  const positionBadge = useCallback(() => {
    const points = pointsRef.current;
    if (points.length < 2 || !badgeRef.current) return;

    const lastPoint = points[points.length - 1];
    const prevPoint = points[points.length - 2];

    const angle = Math.atan2(lastPoint.y - prevPoint.y, lastPoint.x - prevPoint.x) - Math.PI / 2;
    const angleDeg = (angle * 180) / Math.PI;

    badgeRef.current.style.left = lastPoint.x + 'px';
    badgeRef.current.style.top = (lastPoint.y + 5) + 'px';
    badgeRef.current.style.transform = `translate(-50%, 0) rotate(${angleDeg}deg)`;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = scene.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    initRope();

    const handleResize = () => {
      resizeCanvas();
      const points = pointsRef.current;
      if (points.length > 0 && sceneRef.current) {
        points[0].x = sceneRef.current.getBoundingClientRect().width / 2;
        points[0].oldX = points[0].x;
      }
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      const points = pointsRef.current;
      const constraints = constraintsRef.current;

      for (const point of points) {
        if (!isDraggingRef.current || point !== dragPointRef.current) {
          updatePoint(point);
        }
      }

      for (let i = 0; i < config.iterations; i++) {
        for (const constraint of constraints) {
          resolveConstraint(constraint);
        }
      }

      if (points.length > 0 && scene) {
        const rect = scene.getBoundingClientRect();
        points[0].x = rect.width / 2;
        points[0].y = 40;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPin(ctx);
      drawLanyard(ctx);
      drawConnector(ctx);
      positionBadge();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, initRope, updatePoint, resolveConstraint, drawPin, drawLanyard, drawConnector, positionBadge]);

  // Event handlers
  const getEventPos = useCallback((e: MouseEvent | TouchEvent) => {
    if (!sceneRef.current) return { x: 0, y: 0 };
    const rect = sceneRef.current.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    const points = pointsRef.current;
    if (points.length > 0) {
      dragPointRef.current = points[points.length - 1];
    }
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !dragPointRef.current) return;
      const pos = getEventPos(e);
      dragPointRef.current.x = pos.x;
      dragPointRef.current.y = pos.y;
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      dragPointRef.current = null;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [getEventPos]);

  const handleDoubleClick = useCallback(() => {
    const points = pointsRef.current;
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      lastPoint.oldX = lastPoint.x + (Math.random() - 0.5) * 150;
      lastPoint.oldY = lastPoint.y - Math.random() * 80 - 20;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        initRope();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initRope]);

  const updateConfig = (key: keyof BadgeConfig, value: string) => {
    setBadgeConfig(prev => ({ ...prev, [key]: value }));
  };

  /* ###########################################################
     ###   4. Download as HTML Function                        ###
     ###   Generates a standalone HTML file with full physics  ###
     ########################################################### */

  const downloadAsHTML = () => {
    const initials = badgeConfig.name.split(' ').map(n => n[0] || '').join('').toUpperCase();
    const escapedName = badgeConfig.name.replace(/'/g, "\\'");
    const escapedTitle = badgeConfig.title.replace(/'/g, "\\'");
    const escapedWebsite = badgeConfig.website.replace(/'/g, "\\'");
    const escapedEventName = badgeConfig.eventName.replace(/'/g, "\\'");
    const escapedBadgeType = badgeConfig.badgeType.replace(/'/g, "\\'");

    const html = `<!DOCTYPE html>
<!--
  ============================================================
  INTERACTIVE LANYARD BADGE
  ============================================================

  A physics-based lanyard badge using Verlet integration.
  Created with the Lanyard Lab at aoneill.co.uk/lab/lanyard

  HOW TO CUSTOMIZE:
  - Search for "CUSTOMIZE" comments to find editable sections
  - Modify colors in the CSS section
  - Change badge content in the HTML section
  - Adjust physics in the config object

  PHYSICS OVERVIEW:
  - Uses Verlet integration for rope simulation
  - Each point stores current and previous position
  - Velocity is implicit (current - previous position)
  - Constraints maintain segment lengths

  ============================================================
-->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${badgeConfig.name} - Interactive Badge</title>

  <!-- ========================================================
       STYLES - Modify these to change appearance
       ======================================================== -->
  <style>
    /* ----- RESET & BASE STYLES ----- */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* CUSTOMIZE: Change background gradient colors here */
    body {
      min-height: 100svh;
      overflow: hidden;
      background: linear-gradient(135deg, #1e293b, #334155, #1e40af);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ----- SCENE CONTAINER ----- */
    /* The canvas and badge are positioned within this */
    #scene {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* ----- CANVAS ----- */
    /* The lanyard rope is drawn on this canvas */
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    /* ----- BADGE WRAPPER ----- */
    /* Container for clip + badge card, positioned by JavaScript */
    .badge-wrapper {
      position: absolute;
      z-index: 10;
      transform-origin: center top;
      pointer-events: none;
    }

    /* ----- METAL CLIP ----- */
    /* CUSTOMIZE: Adjust gradient colors for different metal effects */
    .clip {
      width: 72px;
      height: 44px;
      margin: 0 auto;
      border-radius: 12px;
      background: linear-gradient(180deg,
        rgba(255,255,255,.85) 0%,      /* Top highlight */
        rgba(203,213,225,.70) 20%,     /* Light metal */
        rgba(148,163,184,.55) 52%,     /* Mid metal */
        rgba(71,85,105,.65) 78%,       /* Dark metal */
        rgba(2,6,23,.95) 100%);        /* Bottom shadow */
      border: 1px solid rgba(255,255,255,.18);
      box-shadow: 0 14px 22px rgba(0,0,0,.55);
      position: relative;
      pointer-events: auto;
      cursor: grab;
    }
    .clip:active { cursor: grabbing; }

    /* Clip highlight bar */
    .clip-highlight {
      position: absolute;
      left: 10px;
      right: 10px;
      top: 8px;
      height: 10px;
      border-radius: 100px;
      background: linear-gradient(90deg,
        rgba(255,255,255,.08),
        rgba(255,255,255,.55),
        rgba(255,255,255,.10));
      opacity: 0.8;
    }

    /* ----- BADGE CARD ----- */
    /* CUSTOMIZE: Change card colors and shadow here */
    .badge {
      margin-top: 12px;
      width: 280px;
      border-radius: 18px;
      background: rgba(255,255,255,.92);
      border: 1px solid rgba(255,255,255,.70);
      box-shadow: 0 26px 60px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.55) inset;
      overflow: hidden;
      pointer-events: auto;
      cursor: grab;
    }
    .badge:active { cursor: grabbing; }

    /* Badge header with event name and type */
    .badge-header {
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(2,6,23,.08);
    }
    .event-name {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: rgba(2,6,23,.60);
    }
    .badge-type {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 6px 10px;
      border-radius: 100px;
      background: rgba(2,6,23,.06);
      border: 1px solid rgba(2,6,23,.10);
      color: rgba(2,6,23,.65);
    }
    .badge-body {
      display: grid;
      grid-template-columns: 72px 1fr;
      gap: 12px;
      padding: 16px;
      align-items: center;
    }
    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 12px;
      background: rgba(2,6,23,.05);
      border: 1px solid rgba(2,6,23,.10);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar svg { color: rgba(2,6,23,.25); }
    .info h2 {
      font-size: 18px;
      font-weight: 900;
      color: rgba(2,6,23,.92);
      line-height: 1.2;
    }
    .info .title, .info .website {
      font-size: 12px;
      font-weight: 600;
      color: rgba(2,6,23,.58);
    }
    .info .title { margin-top: 4px; }
    .info .website { margin-top: 8px; }
    .badge-footer {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(2,6,23,.08);
      font-family: ui-monospace, monospace;
      font-size: 12px;
      color: rgba(2,6,23,.62);
    }
    .status { display: flex; align-items: center; gap: 10px; }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(2,6,23,.25);
      box-shadow: 0 0 0 3px rgba(2,6,23,.08);
    }
    .instructions {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,.22);
      border: 1px solid rgba(255,255,255,.10);
      backdrop-filter: blur(6px);
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 13px;
      color: rgba(255,255,255,.7);
      z-index: 100;
    }
    .instructions kbd {
      background: rgba(255,255,255,.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ui-monospace, monospace;
    }
    .credit {
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-size: 12px;
      color: rgba(255,255,255,.5);
      z-index: 100;
    }
    .credit a { color: rgba(255,255,255,.7); }
  </style>
</head>
<body>
  <div id="scene">
    <canvas id="canvas"></canvas>
    <div class="badge-wrapper" id="badge">
      <div class="clip" id="dragHandle">
        <div class="clip-highlight"></div>
      </div>
      <div class="badge" id="dragHandle2">
        <div class="badge-header">
          <span class="event-name">${escapedEventName}</span>
          <span class="badge-type">${escapedBadgeType}</span>
        </div>
        <div class="badge-body">
          <div class="avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 21v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1"></path>
            </svg>
          </div>
          <div class="info">
            <h2>${escapedName}</h2>
            <div class="title">${escapedTitle}</div>
            <div class="website">${escapedWebsite}</div>
          </div>
        </div>
        <div class="badge-footer">
          <span>ID: ${initials}-2025</span>
          <span class="status">ACTIVE <span class="status-dot"></span></span>
        </div>
      </div>
    </div>
  </div>
  <div class="instructions">
    Drag badge to stretch &bull; Double-click to flick &bull; Press <kbd>R</kbd> to reset
  </div>
  <p class="credit">Created with <a href="https://aoneill.co.uk/lab/lanyard" target="_blank">Lanyard Lab</a></p>

  <!-- ========================================================
       JAVASCRIPT - Physics engine and interaction handlers
       ======================================================== -->
  <script>
    // ============================================================
    // CONFIGURATION - CUSTOMIZE THESE VALUES
    // ============================================================
    // Adjust these to change how the lanyard behaves
    const config = {
      segments: 19,       // Number of rope segments (more = smoother, but slower)
      segmentLength: 10,  // Length of each segment in pixels
      gravity: 0.35,      // Gravity force (higher = falls faster)
      damping: 0.97,      // Velocity damping 0-1 (lower = more friction)
      stiffness: 0.85,    // Rope stiffness 0-1 (higher = more rigid)
      maxStretch: 2.2,    // Maximum stretch before limiting
      iterations: 6       // Constraint solver iterations (more = more stable)
    };

    // ============================================================
    // INITIALIZATION
    // ============================================================
    const scene = document.getElementById('scene');
    const canvas = document.getElementById('canvas');
    const badge = document.getElementById('badge');
    const ctx = canvas.getContext('2d');

    // State: array of points and constraints between them
    let points = [];       // Each point has: x, y, oldX, oldY, pinned, mass
    let constraints = [];  // Each constraint connects two points
    let isDragging = false;
    let dragPoint = null;

    // Resize canvas to fill window
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Keep anchor point centered
      if (points.length > 0) {
        points[0].x = window.innerWidth / 2;
        points[0].oldX = points[0].x;
      }
    }

    // ============================================================
    // ROPE INITIALIZATION
    // ============================================================
    // Creates the rope as a series of connected points
    function initRope() {
      points = [];
      constraints = [];
      const anchorX = window.innerWidth / 2;
      const anchorY = 40;  // Distance from top

      // Create points from anchor down to badge
      for (let i = 0; i <= config.segments; i++) {
        points.push({
          x: anchorX,
          y: anchorY + i * config.segmentLength * 0.7,
          oldX: anchorX,  // Previous position for velocity
          oldY: anchorY + i * config.segmentLength * 0.7,
          pinned: i === 0,  // First point is fixed
          mass: i === config.segments ? 3 : 1  // Badge is heavier
        });

        // Connect each point to the previous one
        if (i > 0) {
          constraints.push({
            p1: points[i-1],
            p2: points[i],
            length: config.segmentLength,
            originalLength: config.segmentLength,
            stretch: 1
          });
        }
      }
    }

    // ============================================================
    // PHYSICS: VERLET INTEGRATION
    // ============================================================
    // Updates point position based on velocity (implicit from position change)
    function updatePoint(p) {
      if (p.pinned) return;  // Don't move pinned points

      // Velocity = current position - old position
      const vx = (p.x - p.oldX) * config.damping;
      const vy = (p.y - p.oldY) * config.damping;

      // Save current position as "old"
      p.oldX = p.x;
      p.oldY = p.y;

      // Apply velocity and gravity
      p.x += vx;
      p.y += vy + config.gravity;
    }

    // ============================================================
    // PHYSICS: CONSTRAINT SOLVING
    // ============================================================
    // Maintains distance between connected points
    function resolveConstraint(c) {
      const dx = c.p2.x - c.p1.x;
      const dy = c.p2.y - c.p1.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      // Track how much the segment is stretched
      c.stretch = dist / c.originalLength;

      // Limit maximum stretch
      const maxDist = c.originalLength * config.maxStretch;
      const targetDist = Math.min(dist, maxDist);

      // Calculate correction needed
      const stiffness = Math.min(
        config.stiffness + (Math.min(c.stretch, config.maxStretch) - 1) * 0.15,
        0.95
      );
      const diff = (c.length - targetDist) / targetDist * stiffness * 0.5;
      const ox = dx * diff;
      const oy = dy * diff;

      // Move points toward each other (or apart)
      if (!c.p1.pinned) { c.p1.x -= ox; c.p1.y -= oy; }
      if (!c.p2.pinned) { c.p2.x += ox; c.p2.y += oy; }
    }

    // ============================================================
    // RENDERING: ANCHOR PIN
    // ============================================================
    function drawPin() {
      const p = points[0];

      // Outer glow effect
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
      glow.addColorStop(0, 'rgba(96, 165, 250, 0.3)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Metal pin with gradient
      const pin = ctx.createRadialGradient(p.x - 3, p.y - 3, 0, p.x, p.y, 12);
      pin.addColorStop(0, '#fff');
      pin.addColorStop(0.35, '#c7d2fe');
      pin.addColorStop(0.7, '#64748b');
      pin.addColorStop(1, '#0b1224');
      ctx.fillStyle = pin;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // ============================================================
    // RENDERING: LANYARD ROPE
    // ============================================================
    // CUSTOMIZE: Change colors and text here
    function drawLanyard() {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < constraints.length; i++) {
        const c = constraints[i];
        const stretch = c.stretch || 1;

        // Width decreases as rope stretches
        const width = Math.max(10, 28 / Math.pow(stretch, 0.6));

        // Color shifts from dark blue to red as it stretches
        const sn = Math.min(1, (stretch - 1) / (config.maxStretch - 1));
        const r = Math.floor(17 + sn * 100);
        const g = Math.floor(24 + sn * 50 - sn * 70);
        const b = Math.floor(39 - sn * 30);

        // Calculate perpendicular for gradient
        const px = -(c.p2.y - c.p1.y);
        const py = c.p2.x - c.p1.x;
        const pl = Math.sqrt(px*px + py*py) || 1;
        const nx = (px / pl) * width / 2;
        const ny = (py / pl) * width / 2;

        // 3D ribbon effect with gradient
        const grad = ctx.createLinearGradient(
          c.p1.x - nx, c.p1.y - ny,
          c.p1.x + nx, c.p1.y + ny
        );
        grad.addColorStop(0, 'rgb('+(r-20)+','+(g-15)+','+(b-20)+')');
        grad.addColorStop(0.3, 'rgb('+r+','+g+','+b+')');
        grad.addColorStop(0.5, 'rgba('+(r+40)+','+(g+30)+','+(b+40)+',0.7)');
        grad.addColorStop(0.7, 'rgb('+r+','+g+','+b+')');
        grad.addColorStop(1, 'rgb('+(r-20)+','+(g-15)+','+(b-20)+')');

        ctx.strokeStyle = grad;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(c.p1.x, c.p1.y);
        ctx.lineTo(c.p2.x, c.p2.y);
        ctx.stroke();

        // CUSTOMIZE: Change 'AO' to your initials
        if (i % 4 === 2) {
          const mx = (c.p1.x + c.p2.x) / 2;
          const my = (c.p1.y + c.p2.y) / 2;
          const angle = Math.atan2(c.p2.y - c.p1.y, c.p2.x - c.p1.x);
          ctx.save();
          ctx.translate(mx, my);
          ctx.rotate(angle + Math.PI / 2);
          ctx.font = '900 ' + Math.max(8, 14 / Math.pow(stretch, 0.4)) + 'px system-ui';
          ctx.fillStyle = 'rgba(233,238,252,' + Math.max(0.3, 0.88 - sn * 0.6) + ')';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('AO', 0, 0);  // <-- CUSTOMIZE THIS
          ctx.restore();
        }
      }
      ctx.restore();
    }

    // ============================================================
    // RENDERING: CONNECTOR RING
    // ============================================================
    function drawConnector() {
      const p = points[points.length - 1];
      // Outer ring
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 5, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Inner hole
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 5, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // ============================================================
    // BADGE POSITIONING
    // ============================================================
    // Positions and rotates badge to match rope end
    function positionBadge() {
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      // Calculate angle from last two points
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x) - Math.PI / 2;
      badge.style.left = last.x + 'px';
      badge.style.top = (last.y + 5) + 'px';
      badge.style.transform = 'translate(-50%, 0) rotate(' + (angle * 180 / Math.PI) + 'deg)';
    }

    // ============================================================
    // ANIMATION LOOP
    // ============================================================
    function animate() {
      // Update physics for each point
      points.forEach(p => {
        if (!isDragging || p !== dragPoint) {
          updatePoint(p);
        }
      });

      // Solve constraints multiple times for stability
      for (let i = 0; i < config.iterations; i++) {
        constraints.forEach(resolveConstraint);
      }

      // Keep anchor fixed at top center
      points[0].x = window.innerWidth / 2;
      points[0].y = 40;

      // Clear and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPin();
      drawLanyard();
      drawConnector();
      positionBadge();

      requestAnimationFrame(animate);
    }

    // ============================================================
    // EVENT HANDLERS
    // ============================================================
    function getPos(e) {
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX, y: t.clientY };
    }

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      dragPoint = points[points.length - 1];
    }

    // Drag handlers for clip and badge
    document.getElementById('dragHandle').addEventListener('mousedown', startDrag);
    document.getElementById('dragHandle').addEventListener('touchstart', startDrag);
    document.getElementById('dragHandle2').addEventListener('mousedown', startDrag);
    document.getElementById('dragHandle2').addEventListener('touchstart', startDrag);

    // Mouse/touch move
    document.addEventListener('mousemove', e => {
      if (isDragging && dragPoint) {
        const p = getPos(e);
        dragPoint.x = p.x;
        dragPoint.y = p.y;
      }
    });
    document.addEventListener('touchmove', e => {
      if (isDragging && dragPoint) {
        const p = getPos(e);
        dragPoint.x = p.x;
        dragPoint.y = p.y;
      }
    });

    // Release drag
    document.addEventListener('mouseup', () => { isDragging = false; dragPoint = null; });
    document.addEventListener('touchend', () => { isDragging = false; dragPoint = null; });

    // Double-click to flick
    scene.addEventListener('dblclick', () => {
      const p = points[points.length - 1];
      // Apply random impulse by setting old position
      p.oldX = p.x + (Math.random() - 0.5) * 150;
      p.oldY = p.y - Math.random() * 80 - 20;
    });

    // Press R to reset
    document.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'r') initRope();
    });

    // ============================================================
    // START
    // ============================================================
    window.addEventListener('resize', resize);
    resize();
    initRope();
    animate();
  </script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${badgeConfig.name.toLowerCase().replace(/\s+/g, '-')}-badge.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Lanyard Demo */}
      <div
        className="relative min-h-[600px] rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--hero-start), var(--hero-mid), var(--hero-end))',
        }}
      >
        <div
          ref={sceneRef}
          className="absolute inset-0 w-full h-full"
          onDoubleClick={handleDoubleClick}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[2]" />

          {/* Badge */}
          <div
            ref={badgeRef}
            className="absolute z-10 pointer-events-none"
            style={{ transformOrigin: 'center top' }}
          >
            {/* Clip */}
            <div
              className="w-[72px] h-[44px] mx-auto rounded-xl relative pointer-events-auto cursor-grab active:cursor-grabbing"
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
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
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

            {/* Badge card */}
            <div
              className="mt-3 w-[280px] rounded-[18px] overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing"
              style={{
                background: 'rgba(255,255,255,.92)',
                color: 'rgba(2,6,23,.92)',
                border: '1px solid rgba(255,255,255,.70)',
                boxShadow: '0 26px 60px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.55) inset',
              }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {/* Top bar */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(2,6,23,.08)' }}
              >
                <div
                  className="text-xs font-extrabold tracking-[.16em] uppercase"
                  style={{ color: 'rgba(2,6,23,.60)' }}
                >
                  {badgeConfig.eventName}
                </div>
                <div
                  className="text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(2,6,23,.06)',
                    border: '1px solid rgba(2,6,23,.10)',
                    color: 'rgba(2,6,23,.65)',
                  }}
                >
                  {badgeConfig.badgeType}
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-[72px_1fr] gap-3 p-4 items-center">
                {/* SVG Person Placeholder */}
                <div
                  className="w-[72px] h-[72px] rounded-xl overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'rgba(2,6,23,.05)',
                    border: '1px solid rgba(2,6,23,.10)',
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'rgba(2,6,23,.25)' }}
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" />
                  </svg>
                </div>
                <div>
                  <div
                    className="text-lg font-black leading-tight tracking-tight"
                    style={{ color: 'rgba(2,6,23,.92)' }}
                  >
                    {badgeConfig.name}
                  </div>
                  <div
                    className="text-[12px] mt-1 font-semibold"
                    style={{ color: 'rgba(2,6,23,.58)' }}
                  >
                    {badgeConfig.title}
                  </div>
                  <div
                    className="text-[12px] mt-2 font-semibold"
                    style={{ color: 'rgba(2,6,23,.58)' }}
                  >
                    {badgeConfig.website}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-4 py-3 flex items-center justify-between font-mono text-xs"
                style={{
                  borderTop: '1px solid rgba(2,6,23,.08)',
                  color: 'rgba(2,6,23,.62)',
                }}
              >
                <span>ID: {badgeConfig.name.split(' ').map(n => n[0]).join('').toUpperCase()}-2025</span>
                <span className="flex items-center gap-2.5">
                  ACTIVE
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: 'rgba(2,6,23,.25)',
                      boxShadow: '0 0 0 3px rgba(2,6,23,.08)',
                    }}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Tension indicator */}
          <div
            className="absolute top-4 right-4 text-[11px] text-white/60 px-3 py-2 rounded-[10px] z-[100] font-mono"
            style={{
              background: 'rgba(0,0,0,.22)',
              border: '1px solid rgba(255,255,255,.10)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span>TENSION</span>
            <div
              className="w-20 h-1.5 mt-1.5 rounded-sm overflow-hidden"
              style={{ background: 'rgba(255,255,255,.1)' }}
            >
              <div
                ref={tensionRef}
                className="h-full rounded-sm transition-[width] duration-100"
                style={{
                  background: 'linear-gradient(90deg, #22c55e, #fbbf24, #ef4444)',
                  width: '0%',
                }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div
            className="absolute bottom-4 left-4 right-4 text-center text-sm text-white/70 px-4 py-2.5 rounded-xl z-50"
            style={{
              background: 'rgba(0,0,0,.22)',
              border: '1px solid rgba(255,255,255,.10)',
              backdropFilter: 'blur(6px)',
            }}
          >
            Drag badge to stretch &bull; Double-click to flick &bull; Press <kbd className="font-mono px-1.5 py-0.5 rounded bg-white/10">R</kbd> to reset
          </div>
        </div>
      </div>

      {/* Live Editor */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--ink)' }}>
          Customize Your Badge
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-secondary)' }}>
          Edit the values below and watch the badge update in real-time.
        </p>

        <div
          className="font-mono text-sm rounded-xl p-4 space-y-3"
          style={{
            background: 'var(--terminal-bg)',
            border: '1px solid var(--terminal-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--ink-muted)' }}>const</span>
            <span style={{ color: 'var(--link)' }}>badgeConfig</span>
            <span style={{ color: 'var(--ink-muted)' }}>=</span>
            <span style={{ color: 'var(--ink-muted)' }}>{'{'}</span>
          </div>

          {/* Name field */}
          <div className="flex items-center gap-2 pl-4">
            <span style={{ color: 'var(--accent)' }}>name:</span>
            <span style={{ color: 'var(--ink-muted)' }}>&quot;</span>
            <input
              type="text"
              value={badgeConfig.name}
              onChange={(e) => updateConfig('name', e.target.value)}
              className="bg-transparent border-none outline-none font-mono flex-1 min-w-0"
              style={{ color: 'var(--terminal-text)' }}
            />
            <span style={{ color: 'var(--ink-muted)' }}>&quot;,</span>
          </div>

          {/* Title field */}
          <div className="flex items-center gap-2 pl-4">
            <span style={{ color: 'var(--accent)' }}>title:</span>
            <span style={{ color: 'var(--ink-muted)' }}>&quot;</span>
            <input
              type="text"
              value={badgeConfig.title}
              onChange={(e) => updateConfig('title', e.target.value)}
              className="bg-transparent border-none outline-none font-mono flex-1 min-w-0"
              style={{ color: 'var(--terminal-text)' }}
            />
            <span style={{ color: 'var(--ink-muted)' }}>&quot;,</span>
          </div>

          {/* Website field */}
          <div className="flex items-center gap-2 pl-4">
            <span style={{ color: 'var(--accent)' }}>website:</span>
            <span style={{ color: 'var(--ink-muted)' }}>&quot;</span>
            <input
              type="text"
              value={badgeConfig.website}
              onChange={(e) => updateConfig('website', e.target.value)}
              className="bg-transparent border-none outline-none font-mono flex-1 min-w-0"
              style={{ color: 'var(--terminal-text)' }}
            />
            <span style={{ color: 'var(--ink-muted)' }}>&quot;,</span>
          </div>

          {/* Event name field */}
          <div className="flex items-center gap-2 pl-4">
            <span style={{ color: 'var(--accent)' }}>eventName:</span>
            <span style={{ color: 'var(--ink-muted)' }}>&quot;</span>
            <input
              type="text"
              value={badgeConfig.eventName}
              onChange={(e) => updateConfig('eventName', e.target.value)}
              className="bg-transparent border-none outline-none font-mono flex-1 min-w-0"
              style={{ color: 'var(--terminal-text)' }}
            />
            <span style={{ color: 'var(--ink-muted)' }}>&quot;,</span>
          </div>

          {/* Badge type field */}
          <div className="flex items-center gap-2 pl-4">
            <span style={{ color: 'var(--accent)' }}>badgeType:</span>
            <span style={{ color: 'var(--ink-muted)' }}>&quot;</span>
            <input
              type="text"
              value={badgeConfig.badgeType}
              onChange={(e) => updateConfig('badgeType', e.target.value)}
              className="bg-transparent border-none outline-none font-mono flex-1 min-w-0"
              style={{ color: 'var(--terminal-text)' }}
            />
            <span style={{ color: 'var(--ink-muted)' }}>&quot;</span>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--ink-muted)' }}>{'}'}</span>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadAsHTML}
          className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Badge as HTML
        </button>

        <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--stroke)' }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            How it works
          </h4>
          <ul className="text-sm space-y-1" style={{ color: 'var(--ink-secondary)' }}>
            <li>&bull; Verlet integration for physics simulation</li>
            <li>&bull; Elastic constraints between rope segments</li>
            <li>&bull; Canvas 2D for rendering the lanyard</li>
            <li>&bull; React state for real-time badge updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
