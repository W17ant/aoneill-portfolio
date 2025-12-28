'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

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

interface ElasticLanyardProps {
  onTensionChange?: (tension: number) => void;
  showTensionBar?: boolean;
}

const config = {
  segments: 16,
  segmentLength: 10,
  gravity: 0.35,
  damping: 0.97,
  stiffness: 0.85,
  elasticity: 0.4,
  iterations: 6,
  maxStretch: 2.2,
};

export default function ElasticLanyard({ onTensionChange, showTensionBar = true }: ElasticLanyardProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const tensionRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const isDraggingRef = useRef(false);
  const dragPointRef = useRef<Point | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const hasSwungInRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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
  const initRope = useCallback((swingIn = false) => {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();
    const anchorX = rect.width / 2;
    const anchorY = 50;

    const points: Point[] = [];
    const constraints: Constraint[] = [];

    for (let i = 0; i <= config.segments; i++) {
      // If swinging in, start points to the right
      const startOffsetX = swingIn ? 120 + i * 8 : 0;
      const point = createPoint(
        anchorX + startOffsetX,
        anchorY + i * config.segmentLength * 0.7,
        i === 0
      );
      if (i === config.segments) point.mass = 3;

      // Set oldX to create initial velocity swinging left
      if (swingIn && i > 0) {
        point.oldX = point.x + 15;
      }

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

    // Outer glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 20);
    glow.addColorStop(0, 'rgba(96, 165, 250, 0.3)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Pin
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

      // Edge highlights
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
    // Callback for external tension display
    if (onTensionChange) {
      onTensionChange(tensionPercent);
    }

    ctx.restore();
  }, [onTensionChange]);

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

    // Resize canvas
    const resizeCanvas = () => {
      const rect = scene.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    // Swing in on first mount
    if (!hasSwungInRef.current) {
      initRope(true);
      hasSwungInRef.current = true;
    } else {
      initRope(false);
    }

    const handleResize = () => {
      resizeCanvas();
      const points = pointsRef.current;
      if (points.length > 0 && sceneRef.current) {
        points[0].x = sceneRef.current.getBoundingClientRect().width / 2;
        points[0].oldX = points[0].x;
      }
    };

    window.addEventListener('resize', handleResize);

    // Animation
    const animate = () => {
      const points = pointsRef.current;
      const constraints = constraintsRef.current;

      // Update physics
      for (const point of points) {
        if (!isDraggingRef.current || point !== dragPointRef.current) {
          updatePoint(point);
        }
      }

      // Resolve constraints
      for (let i = 0; i < config.iterations; i++) {
        for (const constraint of constraints) {
          resolveConstraint(constraint);
        }
      }

      // Keep anchor fixed
      if (points.length > 0 && scene) {
        const rect = scene.getBoundingClientRect();
        points[0].x = rect.width / 2;
        points[0].y = 50;
      }

      // Render
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
      const pos = getEventPos(e.nativeEvent as MouseEvent | TouchEvent);
      dragPointRef.current.oldX = dragPointRef.current.x;
      dragPointRef.current.oldY = dragPointRef.current.y;
    }
  }, [getEventPos]);

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

  // Double click to flick
  const handleDoubleClick = useCallback(() => {
    const points = pointsRef.current;
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      lastPoint.oldX = lastPoint.x + (Math.random() - 0.5) * 150;
      lastPoint.oldY = lastPoint.y - Math.random() * 80 - 20;
    }
  }, []);

  // Reset on R key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        initRope();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initRope]);

  return (
    <div
      ref={sceneRef}
      className="relative w-full h-full"
      onDoubleClick={handleDoubleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[2]" />

      {/* Badge */}
      <div
        ref={badgeRef}
        className="absolute z-10 pointer-events-none"
        style={{ transformOrigin: 'center top', perspective: '1000px' }}
      >
        {/* Clip - brushed metal */}
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
            className="w-full rounded-[18px] overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{
              background: 'rgba(255,255,255,.92)',
              color: 'rgba(2,6,23,.92)',
              border: '1px solid rgba(255,255,255,.70)',
              boxShadow: '0 26px 60px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.55) inset',
              backfaceVisibility: 'hidden',
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
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
            className="w-full rounded-[18px] overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing absolute top-0 left-0"
            style={{
              background: 'rgba(255,255,255,.92)',
              color: 'rgba(2,6,23,.92)',
              border: '1px solid rgba(255,255,255,.70)',
              boxShadow: '0 26px 60px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.55) inset',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
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

      {/* Tension indicator - only show if showTensionBar is true */}
      {showTensionBar && (
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
      )}

    </div>
  );
}
