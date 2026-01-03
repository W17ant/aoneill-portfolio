/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   NAVBAR COMPONENT - Floating navigation with        ###
   ###   responsive mobile menu and theme toggle            ###
   ###   Last Updated: 28-12-2025                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Clock, FolderOpen, FlaskConical, Mail, User, type LucideIcon } from 'lucide-react';
import { getHoliday } from '@/lib/seasonal';
import NewYearCountdown from '@/components/seasonal/NewYearCountdown';

/* ###########################################################
   ###   1. Navigation Configuration                        ###
   ########################################################### */

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  mobileOnly?: boolean;
}

const navLinks: NavLink[] = [
  { href: '/#timeline', label: 'Timeline', icon: Clock },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/lab', label: 'Lab', icon: FlaskConical },
  { href: '/contact', label: 'Contact', icon: Mail },
];

// Mobile-only links (scroll to section)
const mobileOnlyLinks: NavLink[] = [
  { href: '/#about', label: 'About', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState('');
  const [holiday, setHoliday] = useState<string | null>(null);

  // Detect holiday for seasonal styling
  useEffect(() => {
    setHoliday(getHoliday());
  }, []);

  // Clear active hash when navigating to a different page
  useEffect(() => {
    if (pathname !== '/') {
      setActiveHash('');
    }
  }, [pathname]);

  // Handle hash link clicks
  const handleHashClick = (hash: string) => {
    setActiveHash(hash);
  };

  // St Patrick's Day green styling
  const isStPatrick = holiday === 'stpatrick';
  const navActiveColor = isStPatrick
    ? '#2E7D32' // Muted sage green for active nav items
    : 'var(--primary)';

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
        <Link href="/" className="flex items-center">
          <img
            src="/images/monogram.png"
            alt="Antony O'Neill"
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
      <div className="hidden md:flex items-center gap-1">
        {/* About button - triggers lanyard flip on homepage */}
        <button
          onClick={() => {
            setActiveHash('#about');
            if (pathname === '/') {
              window.dispatchEvent(new CustomEvent('flipLanyard'));
            } else {
              // Set flag to flip lanyard after page loads and swing-in completes
              sessionStorage.setItem('flipLanyardAfterLoad', 'true');
              window.location.href = '/';
            }
          }}
          aria-label="About me"
          className={`flex items-center gap-1.5 rounded-full transition-all duration-300 ${
            activeHash === '#about' ? 'px-3 py-2' : 'px-2.5 py-2'
          }`}
          style={{
            background: activeHash === '#about' ? navActiveColor : 'transparent',
            color: activeHash === '#about' ? 'white' : 'var(--ink-secondary)',
          }}
        >
          <User size={16} strokeWidth={2} />
          <span
            className={`text-[13px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
              activeHash === '#about' ? 'max-w-[80px] opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            About
          </span>
        </button>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isHashLink = link.href.startsWith('/#');
          const hash = isHashLink ? link.href.replace('/', '') : '';
          const isActive = isHashLink
            ? activeHash === hash
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setActiveHash(isHashLink ? hash : '')}
              className={`flex items-center gap-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'px-3 py-2' : 'px-2.5 py-2'
              }`}
              style={{
                background: isActive ? navActiveColor : 'transparent',
                color: isActive ? 'white' : 'var(--ink-secondary)',
              }}
            >
              <Icon size={16} strokeWidth={2} />
              <span
                className={`text-[13px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isActive ? 'max-w-[80px] opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Right side: Social + Status + Theme */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/W17ANT"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-[var(--radius-sm)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.04)]"
            aria-label="GitHub profile (opens in new tab)"
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
            aria-label="LinkedIn profile (opens in new tab)"
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

      {/* Mobile: Expanding Toggle Menu - Inside header */}
      <div className="flex items-center gap-1 md:hidden">
        {[...mobileOnlyLinks, ...navLinks].map((link) => {
          const Icon = link.icon;
          const isHashLink = link.href.startsWith('/#');
          const hash = isHashLink ? link.href.replace('/', '') : '';
          const isAboutLink = link.href === '/#about';
          // Hash links active when clicked, regular links active by pathname
          const isActive = isHashLink
            ? activeHash === hash
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (isHashLink) handleHashClick(hash);
                // Dispatch event for mobile card flip with delay
                if (isAboutLink && pathname === '/') {
                  window.dispatchEvent(new CustomEvent('flipMobileCard'));
                }
              }}
              className={`flex items-center gap-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'px-3 py-2' : 'px-2.5 py-2'
              }`}
              style={{
                background: isActive ? navActiveColor : 'transparent',
                color: isActive ? 'white' : 'var(--ink-secondary)',
              }}
            >
              <Icon size={16} strokeWidth={2} />
              <span
                className={`text-[12px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isActive ? 'max-w-[70px] opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Mobile: Theme Toggle - Under header, right side */}
      <div
        className="absolute top-full right-0 mt-3 z-50 md:hidden p-1 rounded-full backdrop-blur-[20px] saturate-[1.2] border"
        style={{
          background: 'var(--navbar-bg)',
          borderColor: 'var(--stroke)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <ThemeToggle />
      </div>

      {/* Mobile: NYE Countdown - Under header, left side */}
      <div
        className="absolute top-full left-0 mt-3 z-50 md:hidden px-2 py-1 rounded-full backdrop-blur-[20px] saturate-[1.2] border"
        style={{
          background: 'var(--navbar-bg)',
          borderColor: 'var(--stroke)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <NewYearCountdown />
      </div>
    </nav>
  );
}
