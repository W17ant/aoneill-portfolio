/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CHRISTMAS HAT - Santa hat overlay image            ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { isChristmasSeason } from '@/lib/seasonal';

interface ChristmasHatProps {
  size?: number;
  className?: string;
}

export default function ChristmasHat({ size = 60, className = '' }: ChristmasHatProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only check season on client to avoid hydration mismatch
    setShow(isChristmasSeason());
  }, []);

  if (!show) return null;

  return (
    <Image
      src="/images/christmas-hat.png"
      alt="Christmas hat"
      width={size}
      height={size}
      className={className}
      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
    />
  );
}
