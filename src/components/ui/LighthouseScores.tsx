/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   LIGHTHOUSE SCORES - Displays live PageSpeed        ###
   ###   Insights scores with circular gauges               ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

'use client';

import { useEffect, useState } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface Scores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  fetchedAt: string;
  cached?: boolean;
  fallback?: boolean;
}

/* ###########################################################
   ###   2. Score Gauge Component                           ###
   ########################################################### */

function ScoreGauge({ score, label }: { score: number; label: string }) {
  // Color based on score (green 90+, orange 50-89, red <50)
  const getColor = (s: number) => {
    if (s >= 90) return '#22c55e'; // green
    if (s >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 16; // radius = 16
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-10 h-10">
        {/* Background circle */}
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        </svg>
        {/* Score number */}
        <div
          className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
          style={{ color }}
        >
          {score}
        </div>
      </div>
      <span className="text-[10px] opacity-60 whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ###########################################################
   ###   3. Loading Skeleton                                ###
   ########################################################### */

function ScoreSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-white/10" />
      <div className="w-12 h-2 rounded bg-white/10" />
    </div>
  );
}

/* ###########################################################
   ###   4. Main Component                                  ###
   ########################################################### */

export default function LighthouseScores() {
  const [scores, setScores] = useState<Scores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch('/api/lighthouse');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setScores(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  // Don't render anything if error
  if (error) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] uppercase tracking-wider opacity-50 font-medium">
        Live Lighthouse Scores
      </div>
      <div className="flex items-center gap-4">
        {loading ? (
          <>
            <ScoreSkeleton />
            <ScoreSkeleton />
            <ScoreSkeleton />
            <ScoreSkeleton />
          </>
        ) : scores ? (
          <>
            <ScoreGauge score={scores.performance} label="Perf" />
            <ScoreGauge score={scores.accessibility} label="A11y" />
            <ScoreGauge score={scores.bestPractices} label="BP" />
            <ScoreGauge score={scores.seo} label="SEO" />
          </>
        ) : null}
      </div>
      {scores && !scores.fallback && (
        <div className="text-[9px] opacity-30">
          Updated {new Date(scores.fetchedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

/* ###########################################################
   ###           END OF LIGHTHOUSE SCORES                   ###
   ########################################################### */
