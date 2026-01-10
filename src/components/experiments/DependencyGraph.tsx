/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   DEPENDENCY GRAPH - Interactive dependency visualizer###
   ###   Force-directed graph of npm package dependencies   ###
   ###   Last Updated: 30-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, AlertCircle, Maximize2, Minimize2, RotateCcw, Github } from 'lucide-react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface PackageJson {
  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'root' | 'dependency' | 'devDependency';
  radius: number;
  isDragging?: boolean;
}

interface Edge {
  source: string;
  target: string;
  type: 'dependency' | 'devDependency';
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
  packageName: string;
}

/* ###########################################################
   ###   2. Demo Data                                       ###
   ########################################################### */

const QUICK_REPOS = [
  { name: 'Express', url: 'github.com/expressjs/express' },
  { name: 'Axios', url: 'github.com/axios/axios' },
  { name: 'TypeScript', url: 'github.com/microsoft/TypeScript' },
  { name: 'This Site', url: 'github.com/W17ANT/aoneill-portfolio' },
];

const DEMO_PACKAGE: PackageJson = {
  name: 'demo-project',
  version: '1.0.0',
  dependencies: {
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'next': '^14.0.0',
    'typescript': '^5.0.0',
    'lucide-react': '^0.300.0',
    'tailwindcss': '^3.4.0',
  },
  devDependencies: {
    'eslint': '^8.0.0',
    '@types/react': '^18.0.0',
    '@types/node': '^20.0.0',
    'prettier': '^3.0.0',
  },
};

/* ###########################################################
   ###   3. Physics Constants                               ###
   ########################################################### */

const REPULSION = 8000;
const ATTRACTION = 0.03;
const DAMPING = 0.85;
const CENTER_GRAVITY = 0.01;
const MIN_DISTANCE = 60;

/* ###########################################################
   ###   4. Utility: Throttle                               ###
   ########################################################### */

function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ###########################################################
   ###   5. Component                                       ###
   ########################################################### */

export default function DependencyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const packageJsonRef = useRef<PackageJson>(DEMO_PACKAGE);
  const hasInteractedRef = useRef(false);

  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stats, setStats] = useState({ deps: 0, devDeps: 0, total: 0 });
  const [showInstructions, setShowInstructions] = useState(true);

  const dragRef = useRef<{ node: Node | null; offsetX: number; offsetY: number }>({
    node: null,
    offsetX: 0,
    offsetY: 0,
  });

  /* ###########################################################
     ###   Graph Building                                     ###
     ########################################################### */

  const buildGraph = useCallback((pkg: PackageJson, width: number, height: number): GraphData => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Root node
    nodes.push({
      id: pkg.name,
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      type: 'root',
      radius: 24,
    });

    // Dependencies
    const deps = Object.keys(pkg.dependencies || {});
    const devDeps = Object.keys(pkg.devDependencies || {});

    deps.forEach((dep, i) => {
      const angle = (i / deps.length) * Math.PI * 2;
      const distance = 120 + Math.random() * 40;
      nodes.push({
        id: dep,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        type: 'dependency',
        radius: 16,
      });
      edges.push({ source: pkg.name, target: dep, type: 'dependency' });
    });

    devDeps.forEach((dep, i) => {
      const angle = (i / devDeps.length) * Math.PI * 2 + Math.PI / devDeps.length;
      const distance = 180 + Math.random() * 40;
      nodes.push({
        id: dep,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        type: 'devDependency',
        radius: 14,
      });
      edges.push({ source: pkg.name, target: dep, type: 'devDependency' });
    });

    return { nodes, edges, packageName: pkg.name };
  }, []);

  /* ###########################################################
     ###   Physics Simulation                                 ###
     ########################################################### */

  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Apply forces
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.isDragging) continue;

      // Center gravity
      node.vx += (centerX - node.x) * CENTER_GRAVITY;
      node.vy += (centerY - node.y) * CENTER_GRAVITY;

      // Repulsion from other nodes
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        if (distance < MIN_DISTANCE * 3) {
          const force = REPULSION / (distance * distance);
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (distance - 100) * ATTRACTION;

      if (!source.isDragging) {
        source.vx += (dx / distance) * force;
        source.vy += (dy / distance) * force;
      }
      if (!target.isDragging) {
        target.vx -= (dx / distance) * force;
        target.vy -= (dy / distance) * force;
      }
    }

    // Update positions
    for (const node of nodes) {
      if (node.isDragging) continue;
      node.vx *= DAMPING;
      node.vy *= DAMPING;
      node.x += node.vx;
      node.y += node.vy;

      // Boundary constraints
      const padding = node.radius + 10;
      node.x = Math.max(padding, Math.min(width - padding, node.x));
      node.y = Math.max(padding, Math.min(height - padding, node.y));
    }

    // Render
    render(ctx, nodes, edges, width, height);

    animationRef.current = requestAnimationFrame(simulate);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- render is stable, defined outside component
  }, []);

  /* ###########################################################
     ###   Rendering                                          ###
     ########################################################### */

  const render = (
    ctx: CanvasRenderingContext2D,
    nodes: Node[],
    edges: Edge[],
    width: number,
    height: number
  ) => {
    // Clear
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, width, height);

    // Draw edges
    for (const edge of edges) {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle =
        edge.type === 'dependency'
          ? 'rgba(139, 92, 246, 0.4)'
          : 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = edge.type === 'dependency' ? 2 : 1.5;
      ctx.stroke();
    }

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredNode?.id === node.id;
      const displayRadius = isHovered ? node.radius * 1.15 : node.radius;

      // Glow effect - stronger for hovered nodes
      if (isHovered || node.type === 'root') {
        const glowRadius = isHovered ? node.radius * 3 : node.radius * 2;
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          glowRadius
        );
        const color =
          node.type === 'root'
            ? 'rgba(59, 130, 246, 0.4)'
            : node.type === 'dependency'
              ? 'rgba(139, 92, 246, 0.5)'
              : 'rgba(251, 191, 36, 0.5)';
        gradient.addColorStop(0, isHovered ? color.replace('0.5', '0.7').replace('0.4', '0.6') : color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node circle - slightly larger when hovered
      ctx.beginPath();
      ctx.arc(node.x, node.y, displayRadius, 0, Math.PI * 2);
      ctx.fillStyle =
        node.type === 'root'
          ? '#3b82f6'
          : node.type === 'dependency'
            ? isHovered ? '#a78bfa' : '#8b5cf6'
            : isHovered ? '#fcd34d' : '#fbbf24';
      ctx.fill();

      // Border - thicker and brighter on hover
      ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = isHovered ? 3 : 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = `${node.type === 'root' ? '12px' : '10px'} system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const label = node.id.length > 12 ? node.id.slice(0, 10) + '...' : node.id;
      ctx.fillText(label, node.x, node.y + node.radius + 14);
    }
  };

  /* ###########################################################
     ###   GitHub API                                         ###
     ########################################################### */

  const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
    // Support various formats:
    // github.com/owner/repo
    // github.com/owner/repo/
    // github.com/owner/repo.git
    // https://github.com/owner/repo
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
    if (!match) return null;

    const [, owner, repo] = match;
    // Clean up repo name - remove .git suffix and trailing slashes
    const cleanRepo = repo.replace(/\.git$/, '').replace(/\/$/, '');
    return { owner, repo: cleanRepo };
  };

  const fetchFromGitHub = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const parsed = parseGitHubUrl(url);
      if (!parsed) {
        throw new Error('Invalid GitHub URL. Use format: github.com/owner/repo');
      }

      const { owner, repo } = parsed;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/package.json`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('package.json not found in this repository');
        }
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Try again later.');
        }
        throw new Error('Failed to fetch from GitHub');
      }

      const data = await response.json();
      const content = atob(data.content);
      const packageJson: PackageJson = JSON.parse(content);

      if (!packageJson.name) {
        packageJson.name = repo;
      }

      initializeGraph(packageJson);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch package.json');
    } finally {
      setLoading(false);
    }
  };

  const initializeGraph = useCallback(
    (pkg: PackageJson) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Store the current package for resize handling
      packageJsonRef.current = pkg;

      const width = canvas.width;
      const height = canvas.height;
      const data = buildGraph(pkg, width, height);

      nodesRef.current = data.nodes;
      edgesRef.current = data.edges;
      setGraphData(data);

      // Start simulation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      simulate();
    },
    [buildGraph, simulate]
  );

  const loadDemo = useCallback(() => {
    setRepoUrl('');
    setError(null);
    initializeGraph(DEMO_PACKAGE);
  }, [initializeGraph]);

  const handleReset = () => {
    setRepoUrl('');
    setError(null);
    setShowInstructions(true);
    hasInteractedRef.current = false;
    loadDemo();
  };

  /* ###########################################################
     ###   Mouse Interaction                                  ###
     ########################################################### */

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const findNodeAtPosition = (x: number, y: number): Node | null => {
    for (const node of nodesRef.current) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < node.radius * node.radius) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Hide instructions on first interaction
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setShowInstructions(false);
    }

    const pos = getMousePos(e);
    const node = findNodeAtPosition(pos.x, pos.y);
    if (node) {
      node.isDragging = true;
      dragRef.current = {
        node,
        offsetX: pos.x - node.x,
        offsetY: pos.y - node.y,
      };
    }
  };

  // Throttled mouse move handler (~60fps)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- throttle returns a stable function
  const handleMouseMoveThrottled = useCallback(
    throttle((e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePos(e);

      // Handle dragging
      if (dragRef.current.node) {
        dragRef.current.node.x = pos.x - dragRef.current.offsetX;
        dragRef.current.node.y = pos.y - dragRef.current.offsetY;
        dragRef.current.node.vx = 0;
        dragRef.current.node.vy = 0;
      }

      // Handle hover
      const node = findNodeAtPosition(pos.x, pos.y);
      setHoveredNode(node);
    }, 16),
    []
  );

  const handleMouseUp = () => {
    if (dragRef.current.node) {
      dragRef.current.node.isDragging = false;
      dragRef.current.node = null;
    }
  };

  const handleMouseLeave = () => {
    handleMouseUp();
    setHoveredNode(null);
  };

  /* ###########################################################
     ###   Effects                                            ###
     ########################################################### */

  // Calculate stats when graphData changes
  useEffect(() => {
    if (graphData) {
      const deps = graphData.edges.filter((e) => e.type === 'dependency').length;
      const devDeps = graphData.edges.filter((e) => e.type === 'devDependency').length;
      setStats({ deps, devDeps, total: deps + devDeps });
    }
  }, [graphData]);

  // Initialize canvas and load demo
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Rebuild graph with current package data (not always demo)
      if (packageJsonRef.current) {
        const data = buildGraph(packageJsonRef.current, canvas.width, canvas.height);
        nodesRef.current = data.nodes;
        edgesRef.current = data.edges;
        setGraphData(data);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load demo immediately on mount
    loadDemo();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [buildGraph, loadDemo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      fetchFromGitHub(repoUrl.trim());
    }
  };

  /* ###########################################################
     ###   Render                                             ###
     ########################################################### */

  return (
    <div
      className={`w-full mx-auto rounded-xl overflow-hidden font-sans text-sm ${
        isFullscreen ? 'fixed inset-4 z-50 max-w-none' : 'max-w-2xl'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0f0f1a, #1a1a2e)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Dependency Graph
            </h2>
            <p className="text-white/40 text-xs mt-0.5">Visualize npm package dependencies</p>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/15 transition"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-b border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="github.com/owner/repo"
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repoUrl.trim()}
            className="px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wide bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Fetch
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-lg font-semibold text-xs uppercase tracking-wide bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 transition"
            title="Reset to demo"
          >
            <RotateCcw size={14} />
          </button>
        </form>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Quick repo links */}
        <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
          <span className="text-white/40">Try:</span>
          {QUICK_REPOS.map((repo, i) => (
            <span key={repo.name} className="flex items-center gap-2">
              <button
                onClick={() => setRepoUrl(repo.url)}
                className="text-white/50 hover:text-white/90 underline underline-offset-2 transition-colors"
              >
                {repo.name}
              </button>
              {i < QUICK_REPOS.length - 1 && <span className="text-white/20">·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Graph Canvas */}
      <div
        ref={containerRef}
        className={`relative ${isFullscreen ? 'h-[calc(100%-200px)]' : 'aspect-[4/3]'}`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveThrottled}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Instructions overlay - fades after first interaction */}
        {graphData && showInstructions && !hoveredNode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white/20 text-sm bg-black/20 px-4 py-2 rounded-lg">
              Drag nodes to reposition • Hover to inspect
            </p>
          </div>
        )}

        {/* Hover tooltip */}
        {hoveredNode && (
          <div
            className="absolute px-2 py-1 rounded bg-black/90 text-white text-xs pointer-events-none whitespace-nowrap z-10"
            style={{
              left: hoveredNode.x,
              top: hoveredNode.y - 40,
              transform: 'translateX(-50%)',
            }}
          >
            {hoveredNode.id}
            <span
              className="ml-2 opacity-60"
              style={{
                color:
                  hoveredNode.type === 'root'
                    ? '#3b82f6'
                    : hoveredNode.type === 'dependency'
                      ? '#8b5cf6'
                      : '#fbbf24',
              }}
            >
              {hoveredNode.type === 'root'
                ? 'root'
                : hoveredNode.type === 'dependency'
                  ? 'dep'
                  : 'dev'}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span className="text-white/60">Dependencies: {stats.deps}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#fbbf24]" />
              <span className="text-white/60">Dev Dependencies: {stats.devDeps}</span>
            </div>
          </div>
          <div className="text-white/40">
            Total: {stats.total} packages
          </div>
        </div>
      </div>
    </div>
  );
}

/* ###########################################################
   ###           END OF DEPENDENCY GRAPH                    ###
   ########################################################### */
