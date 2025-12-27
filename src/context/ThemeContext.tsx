/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   THEME CONTEXT - Light/dark mode state management   ###
   ###   with localStorage persistence and system detection ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

/* ###########################################################
   ###   2. Context Creation                                ###
   ########################################################### */

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
});

/* ###########################################################
   ###   3. Theme Provider Component                        ###
   ########################################################### */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setThemeState(stored);
      document.documentElement.setAttribute('data-theme', stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ###########################################################
   ###   4. Custom Hook                                     ###
   ########################################################### */

export function useTheme() {
  return useContext(ThemeContext);
}

/* ###########################################################
   ###           END OF THEME CONTEXT                       ###
   ########################################################### */
