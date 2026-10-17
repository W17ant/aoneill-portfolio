/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HERO LANYARD - Dynamic lanyard loader component    ###
   ###   Dynamically imports the ElasticLanyard component   ###
   ###   with client-side only rendering (no SSR)           ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

'use client';

import dynamic from 'next/dynamic';

/* ###########################################################
   ###   1. Dynamic Import Configuration                    ###
   ########################################################### */

// Load ElasticLanyard component only on client-side
const ElasticLanyard = dynamic(() => import('@/components/experiments/ElasticLanyard'), {
  ssr: false,
  loading: () => null,
});

/* ###########################################################
   ###   2. Hero Lanyard Component                          ###
   ########################################################### */

export default function HeroLanyard() {
  // Render elastic lanyard without tension bar for hero section.
  // passThrough keeps the transparent scene from blocking the pitch beside it.
  return <ElasticLanyard showTensionBar={false} passThrough />;
}
