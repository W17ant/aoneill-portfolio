/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HERO LANYARD - Dynamic lanyard loader component    ###
   ###   Dynamically imports the ElasticLanyard component   ###
   ###   with client-side only rendering (no SSR)           ###
   ###   Last Updated: 28-12-2024                           ###
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
  // Render elastic lanyard without tension bar for hero section
  return <ElasticLanyard showTensionBar={false} />;
}
