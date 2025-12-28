/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SEASONAL HELPER - Detect current season/holiday    ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
export type Holiday =
  | 'christmas'
  | 'newyear'
  | 'valentine'
  | 'stpatrick'
  | 'easter'
  | 'halloween'
  | null;

/* ###########################################################
   ###   Debug Override (for testing)                       ###
   ########################################################### */

function getOverride(): { holiday: Holiday; season: Season } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('__seasonalDebug');
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

/* ###########################################################
   ###   Season Detection                                   ###
   ########################################################### */

export function getSeason(): Season {
  // Check for debug override
  const override = getOverride();
  if (override) return override.season;

  const month = new Date().getMonth(); // 0-11

  if (month >= 2 && month <= 4) return 'spring';   // Mar-May
  if (month >= 5 && month <= 7) return 'summer';   // Jun-Aug
  if (month >= 8 && month <= 10) return 'autumn';  // Sep-Nov
  return 'winter'; // Dec-Feb
}

/* ###########################################################
   ###   Holiday Detection                                  ###
   ########################################################### */

// Easter calculation (Computus algorithm)
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

export function getHoliday(): Holiday {
  // Check for debug override
  const override = getOverride();
  if (override) return override.holiday;

  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const year = now.getFullYear();

  // New Year: Dec 31 - Jan 2
  if ((month === 11 && day === 31) || (month === 0 && day <= 2)) {
    return 'newyear';
  }

  // Christmas: Dec 1 - Dec 30 (excluding Dec 31 for New Year)
  if (month === 11 && day <= 30) {
    return 'christmas';
  }

  // Valentine's Day: Feb 10 - Feb 15
  if (month === 1 && day >= 10 && day <= 15) {
    return 'valentine';
  }

  // St Patrick's Day: Mar 14 - Mar 18
  if (month === 2 && day >= 14 && day <= 18) {
    return 'stpatrick';
  }


  // Halloween: Oct 20 - Nov 1
  if ((month === 9 && day >= 20) || (month === 10 && day <= 1)) {
    return 'halloween';
  }

  return null;
}

/* ###########################################################
   ###   Convenience Functions                              ###
   ########################################################### */

export function isChristmasSeason(): boolean {
  return getHoliday() === 'christmas';
}

export function isNewYear(): boolean {
  return getHoliday() === 'newyear';
}

export function isValentine(): boolean {
  return getHoliday() === 'valentine';
}

export function isStPatrick(): boolean {
  return getHoliday() === 'stpatrick';
}

export function isEaster(): boolean {
  return getHoliday() === 'easter';
}

export function isHalloween(): boolean {
  return getHoliday() === 'halloween';
}

export function isWinter(): boolean {
  return getSeason() === 'winter';
}

export function isSpring(): boolean {
  return getSeason() === 'spring';
}

export function isSummer(): boolean {
  return getSeason() === 'summer';
}

export function isAutumn(): boolean {
  return getSeason() === 'autumn';
}

/* ###########################################################
   ###   Get Current Theme Colors                           ###
   ########################################################### */

export function getSeasonalColors(): { primary: string; secondary: string; accent: string } {
  const holiday = getHoliday();
  const season = getSeason();

  // Holiday-specific colors take priority
  switch (holiday) {
    case 'christmas':
      return { primary: '#c41e3a', secondary: '#165B33', accent: '#FFD700' };
    case 'newyear':
      return { primary: '#FFD700', secondary: '#C0C0C0', accent: '#1a1a2e' };
    case 'valentine':
      return { primary: '#e91e63', secondary: '#ff6b9d', accent: '#ffcdd2' };
    case 'stpatrick':
      return { primary: '#009A44', secondary: '#FFD700', accent: '#2E7D32' };
    case 'easter':
      return { primary: '#E1BEE7', secondary: '#B2EBF2', accent: '#FFF9C4' };
    case 'halloween':
      return { primary: '#FF6D00', secondary: '#7B1FA2', accent: '#1a1a1a' };
  }

  // Season colors as fallback
  switch (season) {
    case 'spring':
      return { primary: '#81C784', secondary: '#F8BBD9', accent: '#FFF59D' };
    case 'summer':
      return { primary: '#FFB74D', secondary: '#4FC3F7', accent: '#FFF176' };
    case 'autumn':
      return { primary: '#FF8A65', secondary: '#A1887F', accent: '#FFD54F' };
    case 'winter':
      return { primary: '#90CAF9', secondary: '#B0BEC5', accent: '#FFFFFF' };
  }
}
