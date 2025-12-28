/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SEASONAL DEBUG - Test all seasonal effects         ###
   ###   Remove after testing!                              ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import type { Holiday, Season } from '@/lib/seasonal';

const holidays: { value: Holiday; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'christmas', label: '🎄 Christmas' },
  { value: 'newyear', label: '🎉 New Year' },
  { value: 'valentine', label: '💕 Valentine' },
  { value: 'stpatrick', label: '☘️ St Patrick' },
  { value: 'easter', label: '🐰 Easter' },
  { value: 'halloween', label: '🎃 Halloween' },
];

const seasons: { value: Season; label: string }[] = [
  { value: 'winter', label: '❄️ Winter' },
  { value: 'spring', label: '🌸 Spring' },
  { value: 'summer', label: '☀️ Summer' },
  { value: 'autumn', label: '🍂 Autumn' },
];

export default function SeasonalDebug() {
  const [isOpen, setIsOpen] = useState(false);
  const [holiday, setHoliday] = useState<Holiday>(null);
  const [season, setSeason] = useState<Season>('winter');

  // Load current override on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('__seasonalDebug');
      if (stored) {
        const { holiday: h, season: s } = JSON.parse(stored);
        setHoliday(h);
        setSeason(s);
      }
    } catch {}
  }, []);

  const applyOverride = (newHoliday: Holiday, newSeason: Season) => {
    localStorage.setItem('__seasonalDebug', JSON.stringify({ holiday: newHoliday, season: newSeason }));
    window.location.reload();
  };

  const clearOverride = () => {
    localStorage.removeItem('__seasonalDebug');
    window.location.reload();
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-[100] bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono hover:bg-black/90 transition-colors"
      >
        🎨 Seasonal
      </button>

      {/* Control panel */}
      {isOpen && (
        <div className="fixed bottom-16 left-4 z-[100] bg-black/90 text-white p-4 rounded-xl text-sm font-mono w-64 shadow-2xl">
          <div className="text-xs text-gray-400 mb-3">SEASONAL DEBUG</div>

          {/* Holiday selector */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Holiday</label>
            <div className="grid grid-cols-2 gap-1">
              {holidays.map((h) => (
                <button
                  key={h.value ?? 'none'}
                  onClick={() => setHoliday(h.value)}
                  className={`px-2 py-1.5 rounded text-xs transition-colors ${
                    holiday === h.value
                      ? 'bg-white text-black'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Season selector */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Season</label>
            <div className="grid grid-cols-2 gap-1">
              {seasons.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSeason(s.value)}
                  className={`px-2 py-1.5 rounded text-xs transition-colors ${
                    season === s.value
                      ? 'bg-white text-black'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => applyOverride(holiday, season)}
              className="flex-1 bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-xs font-bold transition-colors"
            >
              Apply
            </button>
            <button
              onClick={clearOverride}
              className="flex-1 bg-red-600 hover:bg-red-500 px-3 py-2 rounded text-xs font-bold transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="text-[10px] text-gray-500 mt-3 text-center">
            Page will reload to apply
          </div>
        </div>
      )}
    </>
  );
}
