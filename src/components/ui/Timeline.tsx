/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   TIMELINE COMPONENT - Expandable career journey     ###
   ###   with animated cards and external link handling     ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TimelineEntry } from '@/lib/content';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-3 md:left-6 top-0 bottom-0 w-0.5"
        style={{ background: 'var(--card-border)' }}
      />

      <div>
        {entries.map((entry, index) => {
          const isExpanded = expandedId === entry.id;

          return (
            <div
              key={entry.id}
              className="relative pl-8 md:pl-14"
              style={{ marginTop: index === 0 ? 0 : 8 }}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-1.5 md:left-4.5 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 transition-colors ${
                  entry.tone === 'current'
                    ? 'border-[var(--accent-green)] bg-[var(--accent-green)]'
                    : entry.tone === 'growth'
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                    : 'border-[var(--primary)] bg-[var(--primary)]'
                }`}
                style={{ top: '0.875rem' }}
              />

              {/* Card */}
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full text-left px-3 py-2.5 md:p-5 rounded-xl border transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                style={{
                  background: 'var(--card)',
                  borderColor: isExpanded ? 'var(--primary)' : 'var(--card-border)',
                  boxShadow: isExpanded ? '0 8px 24px var(--card-shadow)' : undefined,
                }}
                aria-expanded={isExpanded}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                      <span
                        className="text-xs md:text-sm font-semibold"
                        style={{ color: 'var(--foreground-subtle)' }}
                      >
                        {entry.date}
                      </span>
                      <div className="flex gap-1">
                        {entry.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-[10px] md:text-xs font-medium rounded-full"
                            style={{
                              background: 'var(--background-secondary)',
                              color: 'var(--foreground-subtle)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3
                      className="text-sm md:text-lg font-bold leading-tight"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {entry.title}
                    </h3>
                    <p
                      className="text-xs md:text-sm mt-0.5"
                      style={{ color: 'var(--foreground-muted)' }}
                    >
                      {entry.subtitle}
                    </p>
                  </div>

                  {/* Expand indicator */}
                  <span
                    className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    style={{
                      background: 'var(--background-secondary)',
                      color: 'var(--foreground-subtle)',
                    }}
                  >
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3" viewBox="0 0 12 12" fill="none">
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
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p
                    className="text-sm mb-4"
                    style={{ color: 'var(--foreground-muted)' }}
                  >
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
                                d={isExternal ? "M4 2H2V10H10V8M6 6L10 2M10 2H7M10 2V5" : "M2 6H10M10 6L6 2M10 6L6 10"}
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
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
