/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   AVAILABILITY BADGE - Status availability indicator ###
   ###   Displays current project availability with         ###
   ###   animated status indicator and color coding         ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { availability, getStatusColor } from '@/lib/availability';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface AvailabilityBadgeProps {
  compact?: boolean;
}

/* ###########################################################
   ###   2. Availability Badge Component                    ###
   ########################################################### */

export default function AvailabilityBadge({ compact = false }: AvailabilityBadgeProps) {
  const { status } = availability;
  const colors = getStatusColor(status);

  // Determine status label based on current availability
  const label =
    status === 'available'
      ? 'Available'
      : status === 'limited'
      ? 'Limited'
      : 'Unavailable';

  // Compact version for smaller spaces
  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
        style={{
          background: colors.bg,
          color: colors.text,
        }}
        title={`Currently ${label.toLowerCase()} for projects`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: colors.text }}
        />
        <span className="hidden sm:inline">{label}</span>
      </div>
    );
  }

  // Full version with ping animation
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold cursor-default"
      style={{
        background: colors.bg,
        color: colors.text,
      }}
      title={`Currently ${label.toLowerCase()} for projects`}
    >
      <span
        className="relative w-2 h-2 rounded-full"
        style={{ background: colors.text }}
      >
        {status !== 'unavailable' && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: colors.text, opacity: 0.4 }}
          />
        )}
      </span>
      {label}
    </div>
  );
}
