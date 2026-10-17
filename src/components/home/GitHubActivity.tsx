/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   GITHUB ACTIVITY - Compact contribution strip       ###
   ###   A small supporting detail: recent contribution     ###
   ###   heatmap plus a link to the GitHub profile          ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

'use client';

import { useEffect, useState } from 'react';

/* ###########################################################
   ###   1. Types & Configuration                           ###
   ########################################################### */

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionsData {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
  year: number;
}

const GITHUB_USERNAME = 'W17ANT';

// Why 20 weeks: roughly the last five months reads as "recent" and keeps the
// strip under ~200px wide so it sits on one line even at phone widths.
const WEEKS_SHOWN = 20;

/** Map a day's count to an intensity bucket (same thresholds as GitHub-ish scales) */
function level(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

// Accent mixed into the surface at increasing strength; level 0 is a faint stroke
const LEVEL_BG = [
  'var(--stroke-hover)',
  'color-mix(in srgb, var(--accent) 30%, transparent)',
  'color-mix(in srgb, var(--accent) 55%, transparent)',
  'color-mix(in srgb, var(--accent) 80%, transparent)',
  'var(--accent)',
];

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

/**
 * Compact GitHub activity line for the homepage.
 * Falls back to a plain profile link if the contributions API is unavailable.
 */
export default function GitHubActivity() {
  const [data, setData] = useState<ContributionsData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/github/contributions?year=${new Date().getFullYear()}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: ContributionsData | null) => {
        if (json && Array.isArray(json.weeks)) setData(json);
      })
      .catch(() => {
        // Why: silent fallback; the profile link below still works without data
      });
    return () => controller.abort();
  }, []);

  const weeks = data?.weeks.slice(-WEEKS_SHOWN) ?? [];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
      {weeks.length > 0 && (
        <div
          className="flex gap-[3px]"
          role="img"
          aria-label={`GitHub contribution heatmap for the last ${WEEKS_SHOWN} weeks`}
        >
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {week.contributionDays.map((day) => (
                <span
                  key={day.date}
                  className="block w-[7px] h-[7px] rounded-[2px]"
                  style={{ background: LEVEL_BG[level(day.contributionCount)] }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      <p>
        {data && (
          <>
            {data.totalContributions.toLocaleString('en-GB')} contributions on GitHub in {data.year}.{' '}
          </>
        )}
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-[var(--stroke-hover)] hover:decoration-current"
          style={{ color: 'var(--ink-secondary)' }}
        >
          See my GitHub profile
        </a>
      </p>
    </div>
  );
}

/* ###########################################################
   ###           END OF GITHUB ACTIVITY                     ###
   ########################################################### */
