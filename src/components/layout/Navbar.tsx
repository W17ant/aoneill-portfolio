/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   NAVBAR COMPONENT - Floating navigation with        ###
   ###   responsive mobile menu and theme toggle            ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';

/* ###########################################################
   ###   1. Navigation Configuration                        ###
   ########################################################### */

const navLinks = [
  { href: '/#timeline', label: 'Timeline' },
  { href: '/projects', label: 'Projects' },
  { href: '/lab', label: 'Lab' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-4 z-50 mx-4 md:mx-6 px-4 py-3 rounded-[14px] backdrop-blur-[20px] saturate-[1.2] border flex items-center justify-between gap-4"
      style={{
        background: 'var(--navbar-bg)',
        borderColor: 'var(--stroke)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Brand - Monogram */}
      <Link href="/" className="flex items-center">
        <img
          src="/images/monogram-transparent-background.png"
          alt="Antony O'Neill"
          className="h-8 w-auto"
          style={{ filter: 'var(--monogram-filter)' }}
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href.replace('/#', '/'));

          return (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-[13px] font-medium rounded-[var(--radius-sm)] transition-colors duration-150"
              style={{
                color: isActive ? 'var(--ink)' : 'var(--ink-secondary)',
                background: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right side: Social + Status + Theme */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/W17ant"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-[var(--radius-sm)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.04)]"
            aria-label="GitHub"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: 'var(--ink-secondary)' }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/antony-o-neill-96601a104/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-[var(--radius-sm)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.04)]"
            aria-label="LinkedIn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: 'var(--ink-secondary)' }}
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>

        {/* Status Badge */}
        <div className="status-badge">
          <span className="status-dot" />
          Available
        </div>

        <ThemeToggle />
      </div>

      {/* Mobile: Status + Theme + Hamburger */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="status-badge text-[11px] py-1.5 px-2.5">
          <span className="status-dot w-1.5 h-1.5" />
        </div>
        <ThemeToggle />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span
            className={`w-5 h-0.5 transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
            style={{ background: 'var(--ink)' }}
          />
          <span
            className={`w-5 h-0.5 transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
            style={{ background: 'var(--ink)' }}
          />
          <span
            className={`w-5 h-0.5 transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
            style={{ background: 'var(--ink)' }}
          />
        </button>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 mx-0 p-3 rounded-[14px] border backdrop-blur-[20px] md:hidden"
          style={{
            background: 'var(--navbar-bg)',
            borderColor: 'var(--stroke)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href.replace('/#', '/'));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-[13px] font-medium rounded-[var(--radius-sm)] transition-colors"
                  style={{
                    color: isActive ? 'var(--ink)' : 'var(--ink-secondary)',
                    background: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div
            className="flex justify-center gap-4 pt-3 mt-3 border-t"
            style={{ borderColor: 'var(--stroke)' }}
          >
            <a
              href="https://github.com/W17ant"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ color: 'var(--ink-secondary)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/antony-o-neill-96601a104/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: 'var(--ink-secondary)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
