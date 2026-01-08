/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   HERO WITH LANYARD - Hero section wrapper component ###
   ###   Positions the elastic lanyard on desktop and       ###
   ###   displays interactive instructions for users        ###
   ###   Last Updated: 08-01-2026                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import HeroLanyard from './HeroLanyard';

/* ###########################################################
   ###   1. Hero With Lanyard Component                     ###
   ########################################################### */

export default function HeroWithLanyard() {
  const [isOffScreen, setIsOffScreen] = useState(false);
  const [isHeld, setIsHeld] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If held (About button was clicked), release on scroll and reset
      if (isHeld) {
        setIsHeld(false);
        return;
      }

      // Only bounce on narrower screens (under 1670px width)
      if (window.innerWidth >= 1670) {
        setIsOffScreen(false);
        return;
      }
      // Check if scrolled past 70% of hero
      const triggerPoint = window.innerHeight * 0.7;
      setIsOffScreen(window.scrollY > triggerPoint);
    };

    // Handle About button click on narrow screens - show lanyard and flip
    const handleShowAndFlip = () => {
      setIsOffScreen(false);
      setIsHeld(true);
      // Small delay to let lanyard animate back, then flip
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('flipLanyard'));
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    window.addEventListener('showLanyardAndFlip', handleShowAndFlip);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('showLanyardAndFlip', handleShowAndFlip);
    };
  }, [isHeld]);

  return (
    <>
      {/* Fixed lanyard on right side - desktop only */}
      {/* Scale down on shorter viewports to prevent overflow */}
      {/* Swings off screen on scroll when width < 1670px - like pin is being dragged */}
      <div
        className="hidden lg:block fixed top-0 right-0 w-[520px] h-[100svh] z-40 pointer-events-none"
        style={{
          transformOrigin: 'calc(50% + 50px) 50px', // Origin at the pin position
          transform: `scale(var(--lanyard-scale, 1)) ${isOffScreen ? 'translateX(110%) rotate(12deg)' : 'translateX(0) rotate(0deg)'}`,
          transition: isOffScreen
            ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s' // Delay on exit for tension effect
            : 'transform 0.8s ease-out', // No delay on return
        }}
      >
        <style>{`
          @media (max-height: 800px) {
            :root { --lanyard-scale: 0.85; }
          }
          @media (max-height: 700px) {
            :root { --lanyard-scale: 0.75; }
          }
          @media (max-height: 600px) {
            :root { --lanyard-scale: 0.65; }
          }
        `}</style>
        <div className="relative w-full h-full pointer-events-auto">
          <HeroLanyard />
        </div>
      </div>

      {/* Fixed instructions - stays in place like header */}
      <div
        className="hidden lg:block fixed bottom-6 right-6 text-sm text-white/70 px-4 py-2.5 rounded-xl z-50"
        style={{
          background: 'rgba(0,0,0,.22)',
          border: '1px solid rgba(255,255,255,.10)',
          backdropFilter: 'blur(6px)',
          opacity: isOffScreen ? 0 : 1,
          transform: `translateX(${isOffScreen ? '20px' : '0'})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        Drag to stretch &bull; Double-click to flick &bull; Click <span className="font-semibold">About</span> to flip
      </div>
    </>
  );
}
