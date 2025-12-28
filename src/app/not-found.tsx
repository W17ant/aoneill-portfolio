/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   404 PAGE - Epic "lost in the void" experience      ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Terminal, Home, FolderOpen, FlaskConical, Mail } from 'lucide-react';

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

interface Line {
  kind: 'in' | 'out' | 'sys' | 'err';
  text: string;
}

interface Route {
  key: string;
  path: string;
}

const routes: Route[] = [
  { key: 'home', path: '/' },
  { key: 'projects', path: '/projects' },
  { key: 'lab', path: '/lab' },
  { key: 'contact', path: '/contact' },
];

const PROMPT = 'visitor@void:~$';

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [ready, setReady] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Generate particles on mount
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 5 + Math.random() * 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  // Glitch effect on 404
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789';
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const glitched = '404'.split('').map(char =>
          Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join('');
        setGlitchText(glitched);
        setTimeout(() => setGlitchText('404'), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence
  useEffect(() => {
    const bootSequence = async () => {
      const boot: Line[] = [
        { kind: 'sys', text: 'ERROR 404: Page not found' },
        { kind: 'err', text: 'The requested resource has drifted into the void.' },
        { kind: 'sys', text: '' },
        { kind: 'out', text: 'Available escape routes:' },
        { kind: 'out', text: '  home      → /           (back to safety)' },
        { kind: 'out', text: '  projects  → /projects   (view my work)' },
        { kind: 'out', text: '  lab       → /lab        (experiments)' },
        { kind: 'out', text: '  contact   → /contact    (get in touch)' },
        { kind: 'sys', text: '' },
        { kind: 'sys', text: 'Type "help" for commands or click a suggestion below.' },
      ];

      for (let i = 0; i < boot.length; i++) {
        await new Promise(r => setTimeout(r, 80));
        setLines(prev => [...prev, boot[i]]);
      }
      setReady(true);
    };

    bootSequence();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when ready
  useEffect(() => {
    if (ready && inputRef.current) {
      inputRef.current.focus();
    }
  }, [ready]);

  const push = useCallback((...newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    push({ kind: 'in', text: `${PROMPT} ${raw.trim()}` });

    const parts = cmd.split(' ');
    const head = parts[0];
    const arg = parts.slice(1).join(' ');

    switch (head) {
      case 'help':
        push(
          { kind: 'out', text: 'Commands:' },
          { kind: 'out', text: '  ls / menu      list escape routes' },
          { kind: 'out', text: '  open <dest>    navigate somewhere' },
          { kind: 'out', text: '  cd <dest>      alias for open' },
          { kind: 'out', text: '  clear          clear terminal' },
          { kind: 'out', text: '  matrix         ???' },
        );
        break;

      case 'ls':
      case 'menu':
        push(
          { kind: 'out', text: 'Escape routes:' },
          { kind: 'out', text: routes.map(r => `  ${r.key.padEnd(10)} → ${r.path}`).join('\n') },
        );
        break;

      case 'open':
      case 'cd':
      case 'goto':
        if (!arg) {
          push({ kind: 'err', text: 'Usage: open <destination>' });
        } else {
          const found = routes.find(r => r.key === arg || r.key.startsWith(arg));
          if (found) {
            push({ kind: 'sys', text: `Navigating to ${found.path}...` });
            setTimeout(() => { window.location.href = found.path; }, 500);
          } else {
            push({ kind: 'err', text: `Unknown destination: "${arg}". Type "ls" for options.` });
          }
        }
        break;

      case 'clear':
        setLines([{ kind: 'sys', text: 'Terminal cleared. Type "help" for commands.' }]);
        break;

      case 'matrix':
        push(
          { kind: 'sys', text: 'Initiating matrix protocol...' },
          { kind: 'out', text: '01001000 01100101 01101100 01101100 01101111' },
          { kind: 'out', text: 'Just kidding. Type "open home" to escape.' },
        );
        break;

      case 'home':
      case 'projects':
      case 'lab':
      case 'contact':
        const direct = routes.find(r => r.key === head);
        if (direct) {
          push({ kind: 'sys', text: `Navigating to ${direct.path}...` });
          setTimeout(() => { window.location.href = direct.path; }, 500);
        }
        break;

      default:
        push({ kind: 'err', text: `Command not found: "${head}". Type "help" for options.` });
    }
  }, [push]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ready) {
      e.preventDefault();
      const v = inputValue;
      setInputValue('');
      runCommand(v);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37, 99, 235, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-30"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-100px) translateX(20px); opacity: 0.6; }
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes glitch-1 {
          0%, 100% { clip-path: inset(0 0 95% 0); transform: translateX(0); }
          20% { clip-path: inset(20% 0 60% 0); transform: translateX(-5px); }
          40% { clip-path: inset(50% 0 30% 0); transform: translateX(5px); }
          60% { clip-path: inset(70% 0 10% 0); transform: translateX(-3px); }
          80% { clip-path: inset(10% 0 80% 0); transform: translateX(3px); }
        }
      `}</style>

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Giant 404 */}
        <div className="relative mb-8">
          <h1
            className="text-[150px] md:text-[200px] font-bold leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 80px rgba(37, 99, 235, 0.5)',
            }}
          >
            {glitchText}
          </h1>
          {/* Glitch overlay */}
          <h1
            className="absolute inset-0 text-[150px] md:text-[200px] font-bold leading-none select-none opacity-50"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'glitch-1 3s infinite',
            }}
          >
            {glitchText}
          </h1>
        </div>

        {/* Functional Terminal */}
        <div
          className="rounded-xl overflow-hidden text-left w-full max-w-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            boxShadow: '0 0 60px rgba(37, 99, 235, 0.15)',
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(248, 113, 113, 0.8)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(250, 204, 21, 0.8)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(74, 222, 128, 0.8)' }} />
            <Terminal size={14} className="ml-2 text-white/50" />
            <span className="text-xs text-white/50">void://lost</span>
            <span className="ml-auto text-[11px] text-white/40">
              {ready ? 'READY' : 'BOOTING...'}
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={bodyRef}
            className="max-h-[200px] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
          >
            {lines.map((line, i) => (
              <pre
                key={i}
                className={`whitespace-pre-wrap break-words mb-1 ${
                  line.kind === 'in' ? 'text-blue-400' :
                  line.kind === 'err' ? 'text-red-400' :
                  line.kind === 'sys' ? 'text-white/50' :
                  'text-white/80'
                }`}
              >
                {line.text}
              </pre>
            ))}
          </div>

          {/* Terminal input */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-green-400">{PROMPT}</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!ready}
                placeholder={ready ? 'type a command...' : 'booting...'}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent border-none text-white text-sm font-mono outline-none placeholder:text-white/30 disabled:opacity-50"
              />
            </div>

            {/* Quick suggestions */}
            {ready && (
              <div className="flex flex-wrap gap-2 mt-3">
                {['home', 'projects', 'lab', 'contact'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => runCommand(cmd)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-mono text-white/70 transition-all hover:bg-white/10 hover:text-white"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick navigation buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--primary)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
            }}
          >
            <Home size={18} />
            Go Home
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--panel)',
              color: 'var(--ink)',
              border: '1px solid var(--stroke)',
            }}
          >
            <FolderOpen size={18} />
            Projects
          </Link>
          <Link
            href="/lab"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--panel)',
              color: 'var(--ink)',
              border: '1px solid var(--stroke)',
            }}
          >
            <FlaskConical size={18} />
            Lab
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--panel)',
              color: 'var(--ink)',
              border: '1px solid var(--stroke)',
            }}
          >
            <Mail size={18} />
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
