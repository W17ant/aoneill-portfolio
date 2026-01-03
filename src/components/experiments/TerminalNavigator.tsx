/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   TERMINAL NAVIGATOR - Interactive terminal nav      ###
   ###   Terminal-style navigation with command interface   ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface Route {
  key: string;
  label: string;
  path: string;
}

interface Line {
  kind: 'in' | 'out' | 'sys';
  text: string;
}

/* ###########################################################
   ###   2. Configuration                                   ###
   ########################################################### */

const routes: Route[] = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'projects', label: 'Projects', path: '/projects' },
  { key: 'lab', label: 'Lab', path: '/lab' },
  { key: 'lanyard', label: 'Lanyard demo', path: '/lab/lanyard' },
  { key: 'contact', label: 'Contact', path: '/contact' },
];

const commands = ['help', 'ls', 'menu', 'open', 'cd', 'cat', 'clear', 'whoami'];
const PROMPT = 'antony@aoneill:~/portfolio$';

// Demo script for typing animation
const demoScript: Line[] = [
  { kind: 'sys', text: 'booting...' },
  { kind: 'out', text: 'Welcome, Antony.' },
  { kind: 'in', text: `${PROMPT} menu` },
  { kind: 'out', text: '1) projects   2) lab   3) contact' },
  { kind: 'in', text: `${PROMPT} open lab` },
  { kind: 'out', text: 'Tip: type "open lanyard" to jump to the demo.' },
  { kind: 'sys', text: 'interactive mode ready — type "help"' },
];

/* ###########################################################
   ###   3. Component                                       ###
   ########################################################### */

export default function TerminalNavigator() {
  /* ###########################################################
     ###   State & Refs                                       ###
     ########################################################### */
  const [lines, setLines] = useState<Line[]>([{ kind: 'sys', text: 'Scroll to start...' }]);
  const [rendered, setRendered] = useState<string[]>(['Scroll to start...']);
  const [interactive, setInteractive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hint, setHint] = useState('Type "menu" or "help"');
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ###########################################################
     ###   Helper Functions                                  ###
     ########################################################### */

  // Scroll to bottom of terminal
  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, []);

  // Add output lines to terminal
  const push = useCallback((...newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines]);
    setRendered((prev) => [...prev, ...newLines.map((l) => l.text)]);
  }, []);

  /* ###########################################################
     ###   Typing Animation                                  ###
     ########################################################### */

  // Run typing animation demo
  const runTypingDemo = useCallback(async () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setRendered(demoScript.map((l) => l.text));
      setLines([...demoScript]);
      setInteractive(true);
      return;
    }

    setRendered([]);
    setLines([]);

    for (const line of demoScript) {
      const full = line.text;
      let current = '';

      setRendered((prev) => [...prev, current]);
      setLines((prev) => [...prev, line]);

      const baseDelay = line.kind === 'in' ? 18 : 8;

      for (let i = 0; i < full.length; i++) {
        current += full[i];
        setRendered((prev) => {
          const newRendered = [...prev];
          newRendered[newRendered.length - 1] = current;
          return newRendered;
        });
        await new Promise((resolve) => setTimeout(resolve, baseDelay));
      }

      await new Promise((resolve) => setTimeout(resolve, 140));
    }

    setInteractive(true);
  }, []);

  /* ###########################################################
     ###   Initialization & Effects                          ###
     ########################################################### */

  // Intersection observer to trigger animation on scroll
  useEffect(() => {
    if (!containerRef.current || started) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            runTypingDemo();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [started, runTypingDemo]);

  // Focus input when interactive
  useEffect(() => {
    if (interactive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [interactive]);

  // Scroll on render update
  useEffect(() => {
    scrollToBottom();
  }, [rendered, scrollToBottom]);

  /* ###########################################################
     ###   Command Processing                                ###
     ########################################################### */

  // Parse and execute terminal command
  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().replace(/\s+/g, ' ');
      if (!cmd) return;

      push({ kind: 'in', text: `${PROMPT} ${cmd}` });

      const parts = cmd.split(' ');
      const head = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      switch (head) {
        case 'help':
          push(
            { kind: 'out', text: 'Commands:' },
            { kind: 'out', text: '  menu             show numbered options' },
            { kind: 'out', text: '  ls               list locations' },
            { kind: 'out', text: '  open <x>         open by name or number' },
            { kind: 'out', text: '  cd <x>           alias for open' },
            { kind: 'out', text: '  cat <file>       cat about | cat contact' },
            { kind: 'out', text: '  clear            clear terminal output' },
            { kind: 'out', text: '  whoami           you already know' }
          );
          setHint('Try: menu');
          break;

        case 'menu':
          setMenuOpen(true);
          setSelected(0);
          push(
            { kind: 'out', text: 'Choose one:' },
            {
              kind: 'out',
              text: routes.map((r, i) => `${i + 1}) ${r.key.padEnd(10)} → ${r.path}`).join('\n'),
            },
            { kind: 'out', text: 'Type: open <name> or open <number>' }
          );
          setHint('Use open <name> or open <number>');
          break;

        case 'ls':
          push({ kind: 'out', text: routes.map((r) => r.key).join('  ') });
          setHint('Try: open lab');
          break;

        case 'open':
        case 'cd':
          if (!arg) {
            push({ kind: 'out', text: 'Usage: open <name|number>' });
          } else {
            const t = arg.toLowerCase();
            const num = Number(t);
            let found = null;

            if (!isNaN(num) && num >= 1 && num <= routes.length) {
              found = routes[num - 1];
            } else {
              found = routes.find((r) => r.key === t) || routes.find((r) => r.key.startsWith(t));
            }

            if (found) {
              push({ kind: 'out', text: `Opening ${found.path}...` });
              setTimeout(() => {
                window.location.href = found!.path;
              }, 500);
            } else {
              push({ kind: 'out', text: `Not found: "${arg}". Type "menu" to see options.` });
            }
          }
          break;

        case 'cat':
          if (!arg) {
            push({ kind: 'out', text: 'Usage: cat about | cat contact' });
          } else if (arg === 'about' || arg === 'about.txt') {
            push({ kind: 'out', text: 'Frontend + product-focused builds. Fast, polished, accessible.' });
          } else if (arg === 'contact' || arg === 'contact.txt') {
            push(
              { kind: 'out', text: 'Email: Antony@aoneill.co.uk' },
              { kind: 'out', text: 'LinkedIn: /in/antony-o-neill-96601a104' }
            );
          } else {
            push({ kind: 'out', text: `No such file: ${arg}` });
          }
          break;

        case 'whoami':
          push({ kind: 'out', text: 'antony (owner)' });
          break;

        case 'clear':
          setLines([{ kind: 'sys', text: 'interactive mode — type "help"' }]);
          setRendered(['interactive mode — type "help"']);
          break;

        default:
          push({ kind: 'out', text: `Unknown command: "${head}". Type "help".` });
          setHint('Type: help');
      }
    },
    [push]
  );

  // Get command suggestions based on input
  const getSuggestions = useCallback(() => {
    const v = inputValue.trim().toLowerCase();
    if (!v) return ['menu', 'help', 'open projects', 'open lab', 'open lanyard'];

    const parts = v.split(' ');
    const head = parts[0];

    if (parts.length === 1) {
      return commands.filter((c) => c.startsWith(head)).slice(0, 5);
    }

    if (head === 'open' || head === 'cd') {
      const q = parts.slice(1).join(' ');
      const opts = routes.map((r) => r.key).filter((k) => k.startsWith(q)).slice(0, 6);
      const nums = routes.map((_, i) => String(i + 1)).filter((n) => n.startsWith(q)).slice(0, 6);
      return [...opts, ...nums].slice(0, 6).map((x) => `${head} ${x}`);
    }

    if (head === 'cat') {
      return ['cat about', 'cat contact'].filter((s) => s.includes(v)).slice(0, 5);
    }

    return [];
  }, [inputValue]);

  /* ###########################################################
     ###   Event Handlers                                    ###
     ########################################################### */

  // Handle keyboard input and navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return;

    if (!menuOpen) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = inputValue;
        setInputValue('');
        runCommand(v);
      }
      return;
    }

    // Menu navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(routes.length - 1, s + 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(0, s - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const r = routes[selected];
      setInputValue('');
      push({ kind: 'out', text: `Opening ${r.path}...` });
      setMenuOpen(false);
      setTimeout(() => {
        window.location.href = r.path;
      }, 500);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setMenuOpen(false);
      setHint('Menu closed. Type: open <name>');
      return;
    }
  };

  const suggestions = getSuggestions();

  return (
    <div
      ref={containerRef}
      className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(248, 113, 113, 0.8)' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(250, 204, 21, 0.8)' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(74, 222, 128, 0.8)' }} />
        <span className="ml-2 text-xs font-semibold tracking-wide text-white/70">TERMINAL</span>
        <span className="ml-auto text-[11px] text-white/45">
          {interactive ? 'READY' : started ? 'TYPING...' : 'SCROLL TO START'}
        </span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="max-h-[340px] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-white/85"
      >
        {rendered.length === 0 ? (
          <div className="text-white/40">...</div>
        ) : (
          rendered.map((text, i) => {
            const kind = lines[i]?.kind || 'out';
            const isLast = i === rendered.length - 1;
            return (
              <pre
                key={i}
                className={`whitespace-pre-wrap break-words mb-0.5 ${
                  kind === 'in' ? 'text-white/90' : kind === 'out' ? 'text-white/75' : 'text-white/50'
                }`}
              >
                {text}
                {isLast && !interactive && <span className="animate-pulse">▍</span>}
              </pre>
            );
          })
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 text-xs font-mono text-white/65">{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!interactive}
            placeholder={interactive ? hint : '...'}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent border-none text-white text-sm font-mono outline-none placeholder:text-white/35 disabled:opacity-50"
          />
          <button
            onClick={() => {
              const v = inputValue;
              setInputValue('');
              runCommand(v);
            }}
            disabled={!interactive}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/85 transition-colors hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            Enter
          </button>
        </div>

        {/* Suggestions */}
        {interactive && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInputValue(s);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1 rounded-full text-[11px] text-white/70 transition-colors hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Menu hint */}
        {interactive && menuOpen && (
          <div className="mt-2 text-[11px] text-white/45">
            Menu mode: use ↑/↓ then Enter. Esc to close. Selected:{' '}
            <span className="text-white/70">{routes[selected].key}</span>
          </div>
        )}
      </div>
    </div>
  );
}
