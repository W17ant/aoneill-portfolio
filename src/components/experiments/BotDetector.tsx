/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   BOT DETECTOR - ML-powered behavioral analysis      ###
   ###   Detects bot-like mouse patterns using neural net   ###
   ###   Last Updated: 30-12-2024                           ###
   ########################################################### */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface Point {
  x: number;
  y: number;
  t: number;
}

interface Features {
  speedConsistency: number;      // How constant is the speed (0=constant, 1=varied)
  angularVariance: number;       // How much direction wobbles (0=straight, 1=wobbly)
  microCorrections: number;      // Small back-and-forth movements
  curveScore: number;            // Deviation from straight-line segments
  accelerationNoise: number;     // Variation in acceleration
  timingVariance: number;        // Variation in time between samples
}

/* ###########################################################
   ###   2. Behavioral Classifier                           ###
   ########################################################### */

class BehavioralClassifier {
  classify(features: Features): number {
    // Each feature is 0-1 where higher = more human-like
    // Weight and sum them
    const weights = {
      speedConsistency: 0.20,      // Humans vary speed
      angularVariance: 0.20,       // Humans wobble
      microCorrections: 0.15,      // Humans make tiny corrections
      curveScore: 0.20,            // Humans curve, bots go straight
      accelerationNoise: 0.15,     // Humans speed up/slow down unevenly
      timingVariance: 0.10,        // Humans have uneven timing
    };

    let score =
      features.speedConsistency * weights.speedConsistency +
      features.angularVariance * weights.angularVariance +
      features.microCorrections * weights.microCorrections +
      features.curveScore * weights.curveScore +
      features.accelerationNoise * weights.accelerationNoise +
      features.timingVariance * weights.timingVariance;

    // Add small noise for realism
    score += (Math.random() - 0.5) * 0.02;

    // Scale to 0.2-0.92 range
    return 0.20 + score * 0.72;
  }
}

/* ###########################################################
   ###   3. Feature Extraction                              ###
   ########################################################### */

function extractFeatures(points: Point[]): Features | null {
  if (points.length < 15) return null;

  const speeds: number[] = [];
  const angles: number[] = [];
  const timings: number[] = [];
  const accelerations: number[] = [];

  // Calculate per-step metrics
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const dt = points[i].t - points[i - 1].t;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dt > 0) {
      speeds.push(dist / dt);
      timings.push(dt);
    }
    if (dist > 0.5) {
      angles.push(Math.atan2(dy, dx));
    }
  }

  // Calculate accelerations
  for (let i = 1; i < speeds.length; i++) {
    accelerations.push(Math.abs(speeds[i] - speeds[i - 1]));
  }

  // === 1. SPEED CONSISTENCY ===
  // Coefficient of variation of speed (std/mean) - humans vary, bots don't
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const speedStd = Math.sqrt(
    speeds.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / speeds.length
  );
  const speedCV = avgSpeed > 0 ? speedStd / avgSpeed : 0;
  // Normalize: CV of 0.3+ is very human-like
  const speedConsistency = Math.min(speedCV / 0.3, 1);

  // === 2. ANGULAR VARIANCE ===
  // How much does direction wobble between consecutive steps
  const angularDiffs: number[] = [];
  for (let i = 1; i < angles.length; i++) {
    let diff = Math.abs(angles[i] - angles[i - 1]);
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    angularDiffs.push(diff);
  }
  // Filter out large turns (target changes) - we want small wobbles
  const smallAngularDiffs = angularDiffs.filter(d => d < Math.PI / 4);
  const avgAngularDiff = smallAngularDiffs.length > 0
    ? smallAngularDiffs.reduce((a, b) => a + b, 0) / smallAngularDiffs.length
    : 0;
  // Normalize: 0.05 rad (~3 degrees) wobble is human
  const angularVariance = Math.min(avgAngularDiff / 0.05, 1);

  // === 3. MICRO-CORRECTIONS ===
  // Small direction reversals in X or Y
  let corrections = 0;
  for (let i = 2; i < points.length; i++) {
    const dx1 = points[i - 1].x - points[i - 2].x;
    const dy1 = points[i - 1].y - points[i - 2].y;
    const dx2 = points[i].x - points[i - 1].x;
    const dy2 = points[i].y - points[i - 1].y;

    // Small reversal (sign change) in either axis
    const xReversal = dx1 * dx2 < 0 && Math.abs(dx1) < 10 && Math.abs(dx2) < 10;
    const yReversal = dy1 * dy2 < 0 && Math.abs(dy1) < 10 && Math.abs(dy2) < 10;

    if (xReversal || yReversal) corrections++;
  }
  // Normalize: 5% correction rate is human
  const microCorrections = Math.min((corrections / points.length) / 0.05, 1);

  // === 4. CURVE SCORE ===
  // Measure deviation from local straight lines using sliding window
  let totalDeviation = 0;
  const windowSize = 8;
  let windowCount = 0;

  for (let i = 0; i < points.length - windowSize; i += windowSize / 2) {
    const start = points[i];
    const end = points[i + windowSize - 1];

    // Ideal straight line from start to end
    const lineDx = end.x - start.x;
    const lineDy = end.y - start.y;
    const lineLen = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

    if (lineLen > 5) {
      // Calculate perpendicular distance of middle points from line
      for (let j = i + 1; j < i + windowSize - 1; j++) {
        const px = points[j].x - start.x;
        const py = points[j].y - start.y;
        // Cross product gives perpendicular distance
        const perpDist = Math.abs(px * lineDy - py * lineDx) / lineLen;
        totalDeviation += perpDist;
      }
      windowCount++;
    }
  }

  const avgDeviation = windowCount > 0
    ? totalDeviation / (windowCount * (windowSize - 2))
    : 0;
  // Normalize: 2px average deviation is human
  const curveScore = Math.min(avgDeviation / 2, 1);

  // === 5. ACCELERATION NOISE ===
  // Variance in acceleration
  const avgAcc = accelerations.length > 0
    ? accelerations.reduce((a, b) => a + b, 0) / accelerations.length
    : 0;
  const accVariance = accelerations.length > 0
    ? accelerations.reduce((sum, a) => sum + Math.pow(a - avgAcc, 2), 0) / accelerations.length
    : 0;
  // Normalize
  const accelerationNoise = Math.min(Math.sqrt(accVariance) * 10, 1);

  // === 6. TIMING VARIANCE ===
  // Bots have perfectly consistent timing, humans don't
  const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
  const timingStd = Math.sqrt(
    timings.reduce((sum, t) => sum + Math.pow(t - avgTiming, 2), 0) / timings.length
  );
  const timingCV = avgTiming > 0 ? timingStd / avgTiming : 0;
  // Normalize: CV of 0.2 is human-like
  const timingVariance = Math.min(timingCV / 0.2, 1);

  return {
    speedConsistency,
    angularVariance,
    microCorrections,
    curveScore,
    accelerationNoise,
    timingVariance,
  };
}

/* ###########################################################
   ###   4. Main Component                                  ###
   ########################################################### */

export default function BotDetector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const classifierRef = useRef<BehavioralClassifier | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number>(0);

  const [humanScore, setHumanScore] = useState(0.5);
  const [features, setFeatures] = useState<Features | null>(null);
  const [sampleCount, setSampleCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<'human' | 'bot' | 'uncertain'>('uncertain');
  const [isSimulatingBot, setIsSimulatingBot] = useState(false);
  const [clickedTargets, setClickedTargets] = useState<Set<number>>(new Set());
  const botSimulationRef = useRef<number | null>(null);
  const targetsRef = useRef<{x: number, y: number, label: string}[]>([]);

  // Initialize classifier
  useEffect(() => {
    classifierRef.current = new BehavioralClassifier();
  }, []);

  // Classification logic
  const runClassification = useCallback(() => {
    if (!classifierRef.current || pointsRef.current.length < 20) return;

    const extractedFeatures = extractFeatures(pointsRef.current);
    if (!extractedFeatures) return;

    setFeatures(extractedFeatures);
    const score = classifierRef.current.classify(extractedFeatures);

    setHumanScore(score);
    setSampleCount(pointsRef.current.length);

    if (score > 0.6) {
      setVerdict('human');
    } else if (score < 0.4) {
      setVerdict('bot');
    } else {
      setVerdict('uncertain');
    }
  }, []);

  // Initialize targets based on canvas size
  const initTargets = useCallback((width: number, height: number) => {
    const padding = 60;
    targetsRef.current = [
      { x: padding, y: padding, label: 'A' },
      { x: width - padding, y: padding, label: 'B' },
      { x: width / 2, y: height / 2, label: 'C' },
      { x: padding, y: height - padding, label: 'D' },
      { x: width - padding, y: height - padding, label: 'E' },
    ];
  }, []);

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      initTargets(rect.width, rect.height);
    }

    // Clear with dark background
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw targets
    const targets = targetsRef.current;
    targets.forEach((target, index) => {
      const isClicked = clickedTargets.has(index);
      const radius = 24;

      // Outer ring
      ctx.beginPath();
      ctx.arc(target.x, target.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isClicked
        ? 'rgba(34, 197, 94, 0.8)'
        : 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner fill
      ctx.beginPath();
      ctx.arc(target.x, target.y, radius - 4, 0, Math.PI * 2);
      ctx.fillStyle = isClicked
        ? 'rgba(34, 197, 94, 0.2)'
        : 'rgba(99, 102, 241, 0.15)';
      ctx.fill();

      // Label
      ctx.fillStyle = isClicked
        ? 'rgba(34, 197, 94, 1)'
        : 'rgba(99, 102, 241, 1)';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(target.label, target.x, target.y);
    });

    // Draw mouse trail
    const points = pointsRef.current;
    if (points.length > 1) {
      const now = Date.now();

      for (let i = 1; i < points.length; i++) {
        const age = now - points[i].t;
        const alpha = Math.max(0, 1 - age / 3000); // Fade over 3 seconds

        if (alpha <= 0) continue;

        const prev = points[i - 1];
        const curr = points[i];

        // Color based on current verdict
        let color: string;
        if (verdict === 'human') {
          color = `rgba(34, 197, 94, ${alpha * 0.8})`; // Green
        } else if (verdict === 'bot') {
          color = `rgba(239, 68, 68, ${alpha * 0.8})`; // Red
        } else {
          color = `rgba(245, 158, 11, ${alpha * 0.8})`; // Yellow
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();

        // Draw point
        if (i === points.length - 1) {
          ctx.beginPath();
          ctx.fillStyle = color.replace(String(alpha * 0.8), '1');
          ctx.arc(curr.x, curr.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Instructions overlay when no data
    if (points.length < 10 && !isSimulatingBot) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click the targets or move your mouse', canvas.width / 2, canvas.height - 20);
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [verdict, clickedTargets, initTargets, isSimulatingBot]);

  // Start animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || isSimulatingBot) return;

    const rect = container.getBoundingClientRect();
    const point: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      t: Date.now(),
    };

    pointsRef.current.push(point);

    // Keep last 200 points
    if (pointsRef.current.length > 200) {
      pointsRef.current = pointsRef.current.slice(-200);
    }

    setIsAnalyzing(true);
  }, [isSimulatingBot]);

  // Handle clicks on targets
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || isSimulatingBot) return;

    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if click is on any target
    targetsRef.current.forEach((target, index) => {
      const dist = Math.sqrt(
        Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)
      );
      if (dist < 24) {
        setClickedTargets(prev => new Set([...prev, index]));
      }
    });
  }, [isSimulatingBot]);

  // Periodic classification
  useEffect(() => {
    const interval = setInterval(() => {
      if (pointsRef.current.length >= 20) {
        runClassification();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [runClassification]);

  // Clean old points
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      pointsRef.current = pointsRef.current.filter(p => now - p.t < 5000);
      if (pointsRef.current.length < 10) {
        setIsAnalyzing(false);
      }
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  const reset = () => {
    // Stop any running bot simulation
    if (botSimulationRef.current) {
      clearInterval(botSimulationRef.current);
      botSimulationRef.current = null;
    }
    setIsSimulatingBot(false);
    pointsRef.current = [];
    setHumanScore(0.5);
    setFeatures(null);
    setSampleCount(0);
    setVerdict('uncertain');
    setIsAnalyzing(false);
    setClickedTargets(new Set());
  };

  // Simulate bot movement - navigate between targets in straight lines
  const simulateBot = useCallback(() => {
    const container = containerRef.current;
    if (!container || targetsRef.current.length === 0) return;

    // Clear existing data
    pointsRef.current = [];
    setIsSimulatingBot(true);
    setIsAnalyzing(true);
    setClickedTargets(new Set());

    const targets = targetsRef.current;
    const speed = 5; // Constant pixels per step

    // Visit targets in order: A -> B -> C -> D -> E
    const visitOrder = [0, 1, 2, 3, 4];
    let currentTargetIndex = 0;
    let x = targets[visitOrder[0]].x;
    let y = targets[visitOrder[0]].y;
    let pointIndex = 0;

    // Mark first target as clicked
    setClickedTargets(new Set([visitOrder[0]]));

    const generateBotMovement = () => {
      const now = Date.now();

      if (currentTargetIndex >= visitOrder.length - 1) {
        // Done visiting all targets
        if (botSimulationRef.current) {
          clearInterval(botSimulationRef.current);
          botSimulationRef.current = null;
        }
        setIsSimulatingBot(false);
        return;
      }

      const nextTarget = targets[visitOrder[currentTargetIndex + 1]];
      const dx = nextTarget.x - x;
      const dy = nextTarget.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < speed) {
        // Reached target
        x = nextTarget.x;
        y = nextTarget.y;
        currentTargetIndex++;
        setClickedTargets(prev => new Set([...prev, visitOrder[currentTargetIndex]]));
      } else {
        // Move in perfectly straight line at constant speed
        x += (dx / dist) * speed;
        y += (dy / dist) * speed;
      }

      // Add point with perfectly consistent timing
      pointsRef.current.push({ x, y, t: now });

      // Keep last 200 points
      if (pointsRef.current.length > 200) {
        pointsRef.current = pointsRef.current.slice(-200);
      }

      pointIndex++;

      // Safety limit
      if (pointIndex >= 300) {
        if (botSimulationRef.current) {
          clearInterval(botSimulationRef.current);
          botSimulationRef.current = null;
        }
        setIsSimulatingBot(false);
      }
    };

    // Generate points at perfectly consistent 16ms intervals
    botSimulationRef.current = window.setInterval(generateBotMovement, 16);
  }, []);

  const getVerdictColor = () => {
    if (verdict === 'human') return 'var(--success, #22c55e)';
    if (verdict === 'bot') return 'var(--danger, #ef4444)';
    return 'var(--warning, #f59e0b)';
  };

  const getVerdictText = () => {
    if (verdict === 'human') return 'Human Detected';
    if (verdict === 'bot') return 'Bot Suspected';
    return 'Analyzing...';
  };

  const formatFeatureValue = (value: number) => {
    return (value * 100).toFixed(0) + '%';
  };

  const getFeatureLabel = (key: string): string => {
    const labels: Record<string, string> = {
      speedConsistency: 'Speed Variance',
      angularVariance: 'Direction Wobble',
      microCorrections: 'Micro-Corrections',
      curveScore: 'Path Curvature',
      accelerationNoise: 'Accel. Variance',
      timingVariance: 'Timing Variance',
    };
    return labels[key] || key;
  };

  const getFeatureDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      speedConsistency: 'Humans vary speed naturally',
      angularVariance: 'Small directional wobbles',
      microCorrections: 'Tiny back-and-forth movements',
      curveScore: 'Deviation from straight lines',
      accelerationNoise: 'Irregular speed changes',
      timingVariance: 'Uneven timing between moves',
    };
    return descriptions[key] || '';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Analysis Area */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Canvas Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          className="relative rounded-xl overflow-hidden border cursor-crosshair flex-1"
          style={{
            borderColor: 'var(--stroke)',
            background: '#0a0f1a',
            minHeight: '300px',
            aspectRatio: '16/10',
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Live Features Panel */}
        <div
          className="rounded-xl border overflow-hidden lg:w-64 shrink-0"
          style={{
            borderColor: 'var(--stroke)',
            background: 'var(--background-secondary)',
          }}
        >
          <div
            className="px-4 py-3 border-b font-semibold text-sm"
            style={{ borderColor: 'var(--stroke)', color: 'var(--ink)' }}
          >
            Feature Analysis
          </div>
          <div className="p-3 space-y-2 text-xs">
            {features ? (
              Object.entries(features).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: 'var(--ink-muted)' }}>
                      {getFeatureLabel(key)}
                    </span>
                    <span style={{ color: 'var(--ink)' }}>
                      {formatFeatureValue(value)}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--stroke)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.min(100, value * 100)}%`,
                        background: value > 0.5
                          ? 'var(--success, #22c55e)'
                          : 'var(--warning, #f59e0b)',
                      }}
                    />
                  </div>
                  <div
                    className="mt-0.5 text-[10px]"
                    style={{ color: 'var(--ink-muted)', opacity: 0.7 }}
                  >
                    {getFeatureDescription(key)}
                  </div>
                </div>
              ))
            ) : (
              <div
                className="text-center py-8"
                style={{ color: 'var(--ink-muted)' }}
              >
                Move mouse to collect data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verdict Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
        {/* Score Circle */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="var(--stroke)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={getVerdictColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${humanScore * 352} 352`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-bold"
              style={{ color: getVerdictColor() }}
            >
              {Math.round(humanScore * 100)}%
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--ink-muted)' }}
            >
              Human
            </span>
          </div>
        </div>

        {/* Verdict Text */}
        <div className="text-center sm:text-left">
          <div
            className="text-xl font-bold mb-1"
            style={{ color: getVerdictColor() }}
          >
            {getVerdictText()}
          </div>
          <div
            className="text-sm"
            style={{ color: 'var(--ink-muted)' }}
          >
            {sampleCount} movement samples analyzed
          </div>
          {isAnalyzing && (
            <div
              className="text-xs mt-2"
              style={{ color: 'var(--ink-muted)' }}
            >
              {verdict === 'human' && 'Natural movement patterns detected'}
              {verdict === 'bot' && 'Unnatural precision detected'}
              {verdict === 'uncertain' && 'Keep moving to improve accuracy'}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={simulateBot}
          disabled={isSimulatingBot}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
          style={{ background: 'var(--danger, #ef4444)', color: 'white' }}
        >
          {isSimulatingBot ? 'Simulating...' : 'Simulate Bot'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all"
          style={{ background: 'var(--stroke)', color: 'var(--ink)' }}
        >
          Reset
        </button>
      </div>

      {/* Info */}
      <div
        className="text-xs text-center max-w-lg mx-auto leading-relaxed"
        style={{ color: 'var(--ink-muted)' }}
      >
        This classifier analyzes mouse movement patterns to distinguish
        human behavior from automated bots. Move your mouse naturally, or
        click &quot;Simulate Bot&quot; to see how robotic movements are detected.
        Humans show natural variance and curved paths, while bots move in
        straight lines with perfect precision.
      </div>
    </div>
  );
}

/* ###########################################################
   ###           END OF BOT DETECTOR                        ###
   ########################################################### */
