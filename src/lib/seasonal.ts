/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SEASONAL HELPER - Detect current season/holiday    ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
export type Holiday = 'christmas' | 'halloween' | 'newyear' | null;

export function getSeason(): Season {
  const month = new Date().getMonth(); // 0-11

  if (month >= 2 && month <= 4) return 'spring';   // Mar-May
  if (month >= 5 && month <= 7) return 'summer';   // Jun-Aug
  if (month >= 8 && month <= 10) return 'autumn';  // Sep-Nov
  return 'winter'; // Dec-Feb
}

export function getHoliday(): Holiday {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // Christmas: Dec 1 - Jan 6
  if ((month === 11) || (month === 0 && day <= 6)) {
    return 'christmas';
  }

  // Halloween: Oct 20 - Nov 1
  if ((month === 9 && day >= 20) || (month === 10 && day <= 1)) {
    return 'halloween';
  }

  // New Year: Dec 31 - Jan 2
  if ((month === 11 && day === 31) || (month === 0 && day <= 2)) {
    return 'newyear';
  }

  return null;
}

export function isChristmasSeason(): boolean {
  return getHoliday() === 'christmas';
}

export function isWinter(): boolean {
  return getSeason() === 'winter';
}
