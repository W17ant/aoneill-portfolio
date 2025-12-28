/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   TIMELINE COMPONENT - Anime.js inspired design      ###
   ###   Staggered scroll animations with SVG line draw     ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { TimelineEntry } from '@/lib/content';

/* ###########################################################
   ###   1. Types & Interfaces                              ###
   ########################################################### */

interface TimelineProps {
  entries: TimelineEntry[];
}

/* ###########################################################
   ###   2. Timeline Component                              ###
   ########################################################### */

export default function Timeline({ entries }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [lineDrawn, setLineDrawn] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /* ----- Intersection Observer for staggered reveals ----- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (observerEntries) => {
        observerEntries.forEach((observerEntry) => {
          if (observerEntry.isIntersecting) {
            const id = observerEntry.target.getAttribute('data-id');
            if (id) {
              const index = entries.findIndex((e) => e.id === id);
              // Stagger: each item appears 150ms after the previous
              setTimeout(() => {
                setVisibleItems((prev) => new Set([...prev, id]));
              }, index * 150);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    // Trigger line draw when timeline enters viewport
    const lineObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineDrawn(true);
        }
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    if (timelineRef.current) {
      lineObserver.observe(timelineRef.current);
    }

    return () => {
      observer.disconnect();
      lineObserver.disconnect();
    };
  }, [entries]);

  /* ----- Ref callback for items ----- */
  const setItemRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) itemRefs.current.set(id, el);
    },
    []
  );

  return (
    <div ref={timelineRef} className="relative pl-6 md:pl-8">
      {/* SVG Line - draws on scroll */}
      <svg
        className="absolute left-[5px] md:left-[7px] top-0 w-[2px] h-full pointer-events-none overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--accent-blue)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <line
          x1="1"
          y1="20"
          x2="1"
          y2="calc(100% - 20px)"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: lineDrawn ? '0' : '1000',
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Timeline Items */}
      <div className="space-y-5 md:space-y-6">
        {entries.map((entry, index) => {
          const isExpanded = expandedId === entry.id;
          const isVisible = visibleItems.has(entry.id);
          const isCurrent = entry.tone === 'current';

          return (
            <div
              key={entry.id}
              ref={setItemRef(entry.id)}
              data-id={entry.id}
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Dot with pulse for current items */}
              <div
                className="absolute -left-6 md:-left-8 top-5 w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    entry.tone === 'current'
                      ? 'var(--accent-green)'
                      : entry.tone === 'growth'
                      ? 'var(--accent-blue)'
                      : 'var(--primary)',
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(34, 197, 94, 0.2)'
                    : undefined,
                  transform: isVisible ? 'scale(1)' : 'scale(0)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionDelay: `${index * 100 + 200}ms`,
                }}
              />

              {/* Pulse ring for current items */}
              {isCurrent && isVisible && (
                <div
                  className="absolute -left-6 md:-left-8 top-5 w-3 h-3 rounded-full animate-ping"
                  style={{
                    backgroundColor: 'var(--accent-green)',
                    opacity: 0.4,
                  }}
                />
              )}

              {/* Card */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 hover:border-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] group"
                style={{
                  background: 'var(--card)',
                  borderColor: isExpanded ? 'var(--primary)' : 'var(--card-border)',
                  boxShadow: isExpanded
                    ? '0 16px 40px var(--card-shadow)'
                    : '0 2px 8px var(--card-shadow)',
                }}
                aria-expanded={isExpanded}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Date and Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="text-sm font-semibold tracking-wide"
                        style={{ color: 'var(--foreground-subtle)' }}
                      >
                        {entry.date}
                      </span>
                      {entry.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200 group-hover:scale-105"
                          style={{
                            background: 'var(--background-secondary)',
                            color: 'var(--foreground-subtle)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base md:text-lg font-bold mb-1 transition-colors duration-200 group-hover:text-[var(--primary)]"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {entry.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      {entry.subtitle}
                    </p>
                  </div>

                  {/* Expand Indicator */}
                  <span
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: isExpanded ? 'var(--primary)' : 'var(--background-secondary)',
                      color: isExpanded ? 'white' : 'var(--foreground-subtle)',
                      transform: isExpanded ? 'rotate(180deg)' : undefined,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                {/* Expanded Content */}
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{
                    maxHeight: isExpanded ? '500px' : '0',
                    opacity: isExpanded ? 1 : 0,
                    marginTop: isExpanded ? '16px' : '0',
                  }}
                >
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                    <p
                      className="text-sm mb-4 leading-relaxed"
                      style={{ color: 'var(--foreground-muted)' }}
                    >
                      {entry.description}
                    </p>

                    <ul className="space-y-2 mb-4">
                      {entry.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm"
                          style={{
                            color: 'var(--foreground-muted)',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
                            transition: `opacity 0.3s ease ${i * 80}ms, transform 0.3s ease ${i * 80}ms`,
                          }}
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: 'var(--accent-green)' }}
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {entry.links && entry.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.links.map((link) => {
                          const isExternal = link.href.startsWith('http');
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={(e) => e.stopPropagation()}
                              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                              style={{
                                color: 'var(--primary)',
                                background: 'var(--background-secondary)',
                              }}
                            >
                              {link.label}
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d={
                                    isExternal
                                      ? 'M4 2H2V10H10V8M6 6L10 2M10 2H7M10 2V5'
                                      : 'M2 6H10M10 6L6 2M10 6L6 10'
                                  }
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
