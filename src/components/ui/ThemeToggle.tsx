/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   THEME TOGGLE - Light/dark theme toggle component   ###
   ###   Animated switch with sun/moon icons and decorative ###
   ###   elements (stars/clouds) for theme transitions      ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useTheme } from '@/context/ThemeContext';

/* ###########################################################
   ###   1. Theme Toggle Component                          ###
   ########################################################### */

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Show a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className="w-14 h-8 rounded-full"
        style={{ background: 'linear-gradient(135deg, #60a5fa, #dbeafe)' }}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1e3a8a, #0f172a)'
          : 'linear-gradient(135deg, #60a5fa, #dbeafe)',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Track decoration */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        {/* Stars (visible in dark mode) */}
        <span
          className={`absolute inset-0 transition-opacity duration-300 ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="absolute top-1.5 left-2 w-1 h-1 bg-white rounded-full opacity-60" />
          <span className="absolute top-3 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
          <span className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
        </span>

        {/* Clouds (visible in light mode) */}
        <span
          className={`absolute inset-0 transition-opacity duration-300 ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="absolute top-2 right-3 w-2 h-1.5 bg-white/60 rounded-full" />
          <span className="absolute bottom-2 right-2 w-1.5 h-1 bg-white/40 rounded-full" />
        </span>
      </span>

      {/* Toggle ball */}
      <span
        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #e2e8f0, #94a3b8)'
            : 'linear-gradient(135deg, #fef08a, #fbbf24)',
          boxShadow: theme === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(251, 191, 36, 0.4)',
        }}
      >
        {/* Sun icon */}
        <svg
          className={`absolute w-4 h-4 transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="#d97706"
          strokeWidth={2.5}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon icon */}
        <svg
          className={`absolute w-4 h-4 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`}
          fill="#475569"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
