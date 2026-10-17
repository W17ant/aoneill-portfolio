/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HERO WITH LANYARD - Desktop lanyard column         ###
   ###   Holds the elastic lanyard in normal page flow,     ###
   ###   to the right of the hero pitch                     ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

import HeroLanyard from './HeroLanyard';

/* ###########################################################
   ###   1. Hero With Lanyard Component                     ###
   ########################################################### */

/**
 * Right-hand hero column that hosts the lanyard on large screens.
 *
 * Why in-flow rather than fixed: the previous version was a 520px fixed
 * overlay at z-40 that covered content at wide viewports and needed
 * scroll-driven hide/show logic. As a grid column it can never overlap the
 * pitch, and it scrolls away with the hero like any other content.
 *
 * Why no instruction toast: the interaction is a discovery, not a task.
 * ElasticLanyard exposes a screen-reader description and a hover title.
 *
 * @returns The lanyard column (hidden below the lg breakpoint)
 */
export default function HeroWithLanyard() {
  return (
    <div
      className="hidden lg:block relative"
      // Why 720px: pin (50px) + resting rope (~180px) + clip and badge
      // (~460px) with a little room to swing without clipping the card.
      style={{ height: 720 }}
    >
      <HeroLanyard />
    </div>
  );
}

/* ###########################################################
   ###           END OF HERO WITH LANYARD                   ###
   ########################################################### */
