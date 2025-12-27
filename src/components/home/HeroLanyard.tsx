'use client';

import dynamic from 'next/dynamic';

const ElasticLanyard = dynamic(() => import('@/components/experiments/ElasticLanyard'), {
  ssr: false,
  loading: () => null,
});

export default function HeroLanyard() {
  return <ElasticLanyard showTensionBar={false} />;
}
