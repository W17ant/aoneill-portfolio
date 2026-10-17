/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   NAVBAR COMPONENT - Floating navigation with        ###
   ###   visible text labels, mobile menu and theme toggle  ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { getHoliday } from '@/lib/seasonal';
import NewYearCountdown from '@/components/seasonal/NewYearCountdown';

/* ###########################################################
   ###   1. Navigation Configuration                        ###
   ########################################################### */

interface NavLink {
  href: string;
  label: string;
}

// Why plain text labels: icon-only items with labels revealed on hover hid
// the site structure from first-time visitors and recruiters skimming.
const navLinks: NavLink[] = [
  { href: '/projects', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/lab', label: 'Lab' },
  { href: '/contact', label: 'Contact' },
];

const GITHUB_URL = 'https://github.com/W17ANT';
const LINKEDIN_URL = 'https://www.linkedin.com/in/AntonyONeillADL';

/* ###########################################################
   ###   2. Navbar Component                                ###
   ########################################################### */

export default function Navbar() {
  const pathname = usePathname();
  const [holiday, setHoliday] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Detect holiday for seasonal styling
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional client-only state
    setHoliday(getHoliday());
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional route sync
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes the mobile menu and returns focus to its toggle
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // St Patrick's Day green styling
  const navActiveColor = holiday === 'stpatrick' ? '#2E7D32' : 'var(--ink)';

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-4 left-4 right-4 md:sticky md:left-auto md:right-auto md:mx-6 z-50 px-4 py-3 rounded-[14px] backdrop-blur-[20px] saturate-[1.2] border flex items-center justify-between gap-4"
      style={{
        background: 'var(--navbar-bg)',
        borderColor: 'var(--stroke)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Brand - Monogram + NYE Countdown (desktop) */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center" aria-label="Antony O'Neill, home">
          <Image
            src="/images/monogram.png"
            alt=""
            width={128}
            height={71}
            className="h-8 w-auto"
            style={{ filter: 'var(--monogram-filter)' }}
          />
        </Link>
        <div className="hidden md:block">
          <NewYearCountdown />
        </div>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className="relative block px-3 py-2 text-sm font-medium rounded-full transition-colors hover:text-[var(--ink)]"
                style={{ color: active ? navActiveColor : 'var(--ink-secondary)' }}
              >
                {link.label}
                {/* Active marker: a short underline rather than a filled pill */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right side: Social + Theme */}
      <div className="hidden md:flex items-center gap-2">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-[var(--radius-sm)] transition-colors duration-150 hover:bg-[var(--stroke)]"
          aria-label="GitHub profile (opens in new tab)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--ink-secondary)' }} aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-[var(--radius-sm)] transition-colors duration-150 hover:bg-[var(--stroke)]"
          aria-label="LinkedIn profile (opens in new tab)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--ink-secondary)' }} aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <ThemeToggle />
      </div>

      {/* Mobile: theme toggle + menu button */}
      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium"
          style={{ color: 'var(--ink)', border: '1px solid var(--stroke)' }}
        >
          {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          Menu
        </button>
      </div>

      {/* Mobile: dropdown panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 mt-2 p-2 rounded-[14px] border"
          // Why opaque: backdrop-filter does not apply inside the nav's own
          // backdrop-filter, so a translucent panel let the hero text show through.
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--stroke-hover)', boxShadow: 'var(--shadow-lg)' }}
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className="block px-4 py-3 rounded-[var(--radius-sm)] text-base font-medium"
                    style={{
                      color: active ? 'var(--ink)' : 'var(--ink-secondary)',
                      background: active ? 'var(--accent-bg)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="flex gap-4 px-4 pt-3 pb-2 mt-1 border-t text-sm" style={{ borderColor: 'var(--stroke)' }}>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-secondary)' }}>
                GitHub
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-secondary)' }}>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Mobile: NYE Countdown - under header, left side (renders nothing outside NYE) */}
      {!menuOpen && (
        <div className="absolute top-full left-0 mt-3 z-50 md:hidden">
          <NewYearCountdown />
        </div>
      )}
    </nav>
  );
}
