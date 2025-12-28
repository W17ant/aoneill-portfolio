/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   TIMELINE COMPONENT - Simple, Safari-safe design    ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TimelineEntry } from '@/lib/content';

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      {entries.map((entry, index) => {
        const isExpanded = expandedId === entry.id;
        const isLast = index === entries.length - 1;
        const isCurrent = entry.tone === 'current';

        return (
          <div key={entry.id} className="flex" style={{ marginBottom: isLast ? 0 : 16 }}>
            {/* Left column: dot and line */}
            <div className="relative" style={{ width: 24 }}>
              <div
                className="rounded-full"
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 20,
                  width: 12,
                  height: 12,
                  backgroundColor:
                    entry.tone === 'current'
                      ? 'var(--accent-green)'
                      : entry.tone === 'growth'
                      ? 'var(--accent-blue)'
                      : 'var(--primary)',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(34, 197, 94, 0.2)' : undefined,
                }}
              />
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    left: 11,
                    top: 40,
                    bottom: -16,
                    width: 2,
                    background: 'var(--card-border)',
                  }}
                />
              )}
            </div>

            {/* Right column: card */}
            <div style={{ flex: 1, paddingLeft: 12 }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                style={{
                  background: 'var(--card)',
                  borderColor: isExpanded ? 'var(--primary)' : 'var(--card-border)',
                }}
                aria-expanded={isExpanded}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--foreground-subtle)' }}
                      >
                        {entry.date}
                      </span>
                      {entry.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-medium rounded-full"
                          style={{
                            background: 'var(--background-secondary)',
                            color: 'var(--foreground-subtle)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3
                      className="text-base md:text-lg font-bold mb-1"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {entry.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                      {entry.subtitle}
                    </p>
                  </div>

                  <span
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-200"
                    style={{
                      background: 'var(--background-secondary)',
                      color: 'var(--foreground-subtle)',
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

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                    <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                      {entry.description}
                    </p>

                    <ul className="space-y-2 mb-4">
                      {entry.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: 'var(--foreground-muted)' }}
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
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:bg-[var(--primary-light)]"
                              style={{ color: 'var(--primary)' }}
                            >
                              {link.label}
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d={isExternal ? 'M4 2H2V10H10V8M6 6L10 2M10 2H7M10 2V5' : 'M2 6H10M10 6L6 2M10 6L6 10'}
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
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
