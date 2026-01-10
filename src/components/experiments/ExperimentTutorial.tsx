/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   EXPERIMENT TUTORIAL - Step-by-step tutorial UI     ###
   ###   Renders tutorial steps with code blocks & tips     ###
   ###   Last Updated: 02-01-2026                           ###
   ########################################################### */

'use client';

import { useState } from 'react';
import type { Tutorial } from '@/lib/content';

/* ###########################################################
   ###   1. Props Interface                                ###
   ########################################################### */

interface ExperimentTutorialProps {
  tutorial: Tutorial;
  experimentTitle: string;
}

/* ###########################################################
   ###   2. Main Component                                 ###
   ########################################################### */

export default function ExperimentTutorial({ tutorial, experimentTitle: _experimentTitle }: ExperimentTutorialProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const copyCode = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const difficultyColors = {
    Beginner: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    Intermediate: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
    Advanced: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
  };

  const colors = difficultyColors[tutorial.difficulty];

  return (
    <section className="mt-16 pt-12" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2 tracking-[-0.02em]" style={{ color: 'var(--ink)' }}>
            Build It Yourself
          </h2>
          <p className="text-sm" style={{ color: 'var(--ink-secondary)' }}>
            Step-by-step guide to recreate this experiment
          </p>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {tutorial.difficulty}
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--ink-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {tutorial.duration}
          </span>
        </div>
      </div>

      {/* Prerequisites */}
      {tutorial.prerequisites.length > 0 && (
        <div
          className="mb-8 p-4 rounded-xl"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Prerequisites
          </h3>
          <ul className="flex flex-wrap gap-2">
            {tutorial.prerequisites.map((prereq, i) => (
              <li
                key={i}
                className="px-2.5 py-1 rounded-md text-xs"
                style={{
                  background: 'var(--bg-base)',
                  color: 'var(--ink-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        {tutorial.steps.map((step, index) => {
          const isExpanded = expandedSteps.has(index);

          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Step header */}
              <button
                onClick={() => toggleStep(index)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left transition-colors hover:bg-[var(--bg-hover)]"
              >
                {/* Step number */}
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: isExpanded ? 'var(--accent)' : 'var(--bg-base)',
                    color: isExpanded ? 'white' : 'var(--ink-secondary)',
                    border: isExpanded ? 'none' : '1px solid var(--border)',
                  }}
                >
                  {index + 1}
                </span>

                {/* Title */}
                <span
                  className="flex-1 font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  {step.title}
                </span>

                {/* Expand icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform"
                  style={{
                    color: 'var(--ink-muted)',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Step content */}
              {isExpanded && (
                <div className="px-5 pb-5">
                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4 ml-12"
                    style={{ color: 'var(--ink-secondary)' }}
                  >
                    {step.description}
                  </p>

                  {/* Code block */}
                  {step.code && (
                    <div
                      className="relative ml-12 rounded-lg overflow-hidden"
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {/* Code header */}
                      <div
                        className="flex items-center justify-between px-4 py-2"
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                      >
                        <span className="text-xs font-mono text-white/50">
                          {step.language || 'code'}
                        </span>
                        <button
                          onClick={() => copyCode(step.code!, index)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-white/60 transition-colors hover:text-white hover:bg-white/10"
                        >
                          {copiedIndex === index ? (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              Copied
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code content */}
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-[13px] leading-relaxed font-mono text-white/85">
                          {step.code}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Tip */}
                  {step.tip && (
                    <div
                      className="mt-4 ml-12 p-3 rounded-lg flex gap-3"
                      style={{
                        background: 'rgba(96, 165, 250, 0.1)',
                        border: '1px solid rgba(96, 165, 250, 0.2)',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      <p className="text-sm" style={{ color: '#93c5fd' }}>
                        {step.tip}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resources */}
      {tutorial.resources && tutorial.resources.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>
            Resources
          </h3>
          <div className="flex flex-wrap gap-2">
            {tutorial.resources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-[var(--bg-hover)]"
                style={{
                  color: 'var(--link)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                }}
              >
                {resource.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
