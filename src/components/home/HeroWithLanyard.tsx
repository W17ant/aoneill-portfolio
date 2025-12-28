/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HERO WITH LANYARD - Hero section wrapper component ###
   ###   Positions the elastic lanyard on desktop and       ###
   ###   displays interactive instructions for users        ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import HeroLanyard from './HeroLanyard';

/* ###########################################################
   ###   1. Hero With Lanyard Component                     ###
   ########################################################### */

export default function HeroWithLanyard() {
  return (
    <>
      {/* Fixed lanyard on right side - desktop only */}
      <div className="hidden lg:block fixed top-0 right-0 w-[520px] h-[100svh] z-40 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <HeroLanyard />
        </div>
      </div>

      {/* Instructions - bottom right of hero in a box */}
      <div
        className="hidden lg:block absolute bottom-6 right-6 text-sm text-white/70 px-4 py-2.5 rounded-xl z-50"
        style={{
          background: 'rgba(0,0,0,.22)',
          border: '1px solid rgba(255,255,255,.10)',
          backdropFilter: 'blur(6px)',
        }}
      >
        Drag to stretch &bull; Double-click to flick &bull; Click <span className="font-semibold">About</span> to flip &bull; <kbd className="font-mono px-1.5 py-0.5 rounded bg-white/10">R</kbd> to reset
      </div>
    </>
  );
}
