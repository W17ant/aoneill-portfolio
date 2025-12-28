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

      {/* Fixed instructions - stays in place like header */}
      <div
        className="hidden lg:block fixed bottom-6 right-6 text-[11px] text-white/60 px-3 py-2 rounded-xl z-50"
        style={{
          background: 'rgba(0,0,0,.22)',
          border: '1px solid rgba(255,255,255,.10)',
          backdropFilter: 'blur(6px)',
        }}
      >
        Drag · Double-click to flick · <span className="font-semibold">About</span> to flip · <kbd className="font-mono px-1 py-0.5 rounded bg-white/10">R</kbd> reset
      </div>
    </>
  );
}
