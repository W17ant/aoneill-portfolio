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

    </>
  );
}
