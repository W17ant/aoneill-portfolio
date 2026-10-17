/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   AVAILABILITY CONFIG - Status management            ###
   ###   Single source of truth for availability status     ###
   ###   Last Updated: 17-10-2026                           ###
   ########################################################### */

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

interface AvailabilityConfig {
  status: AvailabilityStatus;
  /** Short badge text shown in the hero */
  label: string;
  responseTime: string;
  nextStart: string;
  headline: string;
  description: string;
  ctaText: string;
}

/* ###########################################################
   ###   2. Status Configuration                            ###
   ########################################################### */

// Why: the primary goal is a graduate ML / data / software role; freelance work
// is secondary, so every status leads with employment rather than "projects".
// nextStart avoids hard-coded months because dated values go stale silently.
const config: Record<AvailabilityStatus, Omit<AvailabilityConfig, 'status'>> = {
  available: {
    label: 'Open to graduate roles',
    responseTime: 'Within 24 hours',
    nextStart: 'Immediately',
    headline: 'Open to graduate roles',
    description:
      "I'm looking for graduate roles in ML engineering, data science and software engineering. Happy to talk about graduate schemes, junior positions, or a well-scoped contract.",
    ctaText: 'Get in touch',
  },
  limited: {
    label: 'Limited availability',
    responseTime: '2-3 days',
    nextStart: 'By arrangement',
    headline: 'Limited availability',
    description:
      "Busy right now, but still interested in graduate ML and software roles. Send the details and I'll reply within a few days.",
    ctaText: 'Discuss availability',
  },
  unavailable: {
    label: 'Not looking right now',
    responseTime: '1 week',
    nextStart: 'By arrangement',
    headline: 'Not looking right now',
    description:
      "I'm not taking on new roles or projects at the moment. I still read every message, it may just take a little longer to reply.",
    ctaText: 'Send a message',
  },
};

/* ###########################################################
   ###   3. Current Status Setting                          ###
   ########################################################### */

// SET YOUR CURRENT STATUS HERE
const CURRENT_STATUS: AvailabilityStatus = 'available';

export const availability: AvailabilityConfig = {
  status: CURRENT_STATUS,
  ...config[CURRENT_STATUS],
};

/* ###########################################################
   ###   4. Helper Functions                                ###
   ########################################################### */

export function getStatusColor(status: AvailabilityStatus) {
  switch (status) {
    case 'available':
      return {
        bg: 'rgba(16, 185, 129, 0.15)',
        text: '#10b981',
        border: 'rgba(16, 185, 129, 0.25)',
      };
    case 'limited':
      return {
        bg: 'rgba(245, 158, 11, 0.15)',
        text: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.25)',
      };
    case 'unavailable':
      return {
        bg: 'rgba(239, 68, 68, 0.15)',
        text: '#ef4444',
        border: 'rgba(239, 68, 68, 0.25)',
      };
  }
}
