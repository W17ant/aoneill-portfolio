/** ResultsChart - accessible model-comparison bar charts (accuracy and training time) built from Project.results */

import type { ProjectResult } from '@/lib/content';

/* ###########################################################
   ###   1. Helpers                                         ###
   ########################################################### */

/** Formats seconds as "54 s", "20 min" or "> 60 min". */
function formatDuration(seconds: number, isLowerBound?: boolean): string {
  const text = seconds < 120 ? `${seconds} s` : `${Math.round(seconds / 60)} min`;
  return isLowerBound ? `> ${text}` : text;
}

// Why: accuracies cluster between 88% and 99%. On a 0-100 axis every bar looks
// identical, so the axis starts at 85% and says so in the caption.
const ACCURACY_AXIS_MIN = 85;
const ACCURACY_AXIS_MAX = 100;

interface BarRowProps {
  label: string;
  sublabel: string;
  value: string;
  /** Bar length as a 0-1 fraction of the track. */
  fraction: number;
  /** Dashed open end for lower-bound values. */
  open?: boolean;
}

function BarRow({ label, sublabel, value, fraction, open }: BarRowProps) {
  return (
    <tr>
      <th scope="row" className="py-2 pr-4 text-left align-middle font-medium whitespace-nowrap" style={{ color: 'var(--ink)' }}>
        {label}
        <span className="block text-xs font-normal" style={{ color: 'var(--ink-muted)' }}>
          {sublabel}
        </span>
      </th>
      <td className="py-2 w-full align-middle">
        <div className="flex items-center gap-3">
          {/* Why: the bar is decorative; the value text in the same cell carries the data for screen readers. */}
          <div className="flex-1 h-3" aria-hidden="true">
            <div
              className="h-full"
              style={{
                width: `${Math.max(fraction, 0.01) * 100}%`,
                background: 'var(--accent)',
                borderRadius: open ? '0' : '0 4px 4px 0',
                // Lower bounds fade out instead of ending, so they don't read as an exact value.
                maskImage: open ? 'linear-gradient(to right, black 80%, transparent)' : undefined,
                WebkitMaskImage: open ? 'linear-gradient(to right, black 80%, transparent)' : undefined,
              }}
            />
          </div>
          <span className="text-sm tabular-nums whitespace-nowrap" style={{ color: 'var(--ink-secondary)' }}>
            {value}
          </span>
        </div>
      </td>
    </tr>
  );
}

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

/**
 * Renders two single-measure bar charts from recorded results.
 * Why two charts rather than one: accuracy and time have different scales,
 * and a shared dual axis would invite false comparisons.
 *
 * @param results - rows from Project.results; rows missing a metric are skipped for that chart
 * @returns a figure with accuracy and training-time tables, or null when no data exists
 */
export default function ResultsChart({ results }: { results: ProjectResult[] }) {
  const withAccuracy = results.filter((r) => r.accuracy !== undefined);
  const withTime = results.filter((r) => r.trainingSeconds !== undefined);
  if (withAccuracy.length === 0 && withTime.length === 0) return null;

  const maxSeconds = Math.max(...withTime.map((r) => r.trainingSeconds as number));
  const withF1 = results.filter((r) => r.macroF1 !== undefined);

  return (
    <figure className="card p-5 sm:p-6">
      {withAccuracy.length > 0 && (
        <table className="w-full text-sm mb-6">
          <caption className="text-left mb-2">
            <span className="block font-semibold" style={{ color: 'var(--ink)' }}>
              Accuracy
            </span>
            <span className="block text-xs" style={{ color: 'var(--ink-muted)' }}>
              Bars start at {ACCURACY_AXIS_MIN}%, not 0, so small gaps are visible.
            </span>
          </caption>
          <tbody>
            {withAccuracy.map((r) => (
              <BarRow
                key={`acc-${r.model}-${r.config}`}
                label={r.model}
                sublabel={r.config}
                value={`${(r.accuracy as number).toFixed(1)}%`}
                fraction={((r.accuracy as number) - ACCURACY_AXIS_MIN) / (ACCURACY_AXIS_MAX - ACCURACY_AXIS_MIN)}
              />
            ))}
          </tbody>
        </table>
      )}

      {withTime.length > 0 && (
        <table className="w-full text-sm">
          <caption className="text-left mb-2">
            <span className="block font-semibold" style={{ color: 'var(--ink)' }}>
              Wall-clock training time
            </span>
            <span className="block text-xs" style={{ color: 'var(--ink-muted)' }}>
              Linear scale from 0. A fading bar is a lower bound.
            </span>
          </caption>
          <tbody>
            {withTime.map((r) => (
              <BarRow
                key={`time-${r.model}-${r.config}`}
                label={r.model}
                sublabel={r.config}
                value={formatDuration(r.trainingSeconds as number, r.trainingSecondsIsLowerBound)}
                fraction={(r.trainingSeconds as number) / maxSeconds}
                open={r.trainingSecondsIsLowerBound}
              />
            ))}
          </tbody>
        </table>
      )}

      {withF1.length > 0 && (
        <figcaption className="mt-5 text-xs leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          Macro F1 recorded:{' '}
          {withF1.map((r) => `${r.model} ${r.config} ${r.macroF1?.toFixed(3)}`).join(', ')}.
        </figcaption>
      )}
    </figure>
  );
}
