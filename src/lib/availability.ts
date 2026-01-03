/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   AVAILABILITY CONFIG - Status management            ###
   ###   Single source of truth for availability status     ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

interface AvailabilityConfig {
  status: AvailabilityStatus;
  responseTime: string;
  nextStart: string;
  headline: string;
  description: string;
  ctaText: string;
}

/* ###########################################################
   ###   2. Status Configuration                            ###
   ########################################################### */

const config: Record<AvailabilityStatus, Omit<AvailabilityConfig, 'status'>> = {
  available: {
    responseTime: 'Within 24 hours',
    nextStart: 'January 2026',
    headline: 'Open to opportunities',
    description:
      "I'm completing my MSc in AI and actively exploring data science, ML engineering, and software roles. Open to graduate schemes, contracts, or interesting projects.",
    ctaText: 'Get in touch',
  },
  limited: {
    responseTime: '2-3 days',
    nextStart: 'February 2026',
    headline: 'Limited availability',
    description:
      "Currently focused on coursework but open to discussing opportunities. Reach out with details and I'll respond within a few days.",
    ctaText: 'Discuss availability',
  },
  unavailable: {
    responseTime: '1 week',
    nextStart: 'March 2026',
    headline: 'Focused on studies',
    description:
      "Deep in exam season or project deadlines. I'll still read messages — just might take a bit longer to reply.",
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
        bg: 'rgba(34, 197, 94, 0.15)',
        text: '#22c55e',
        border: 'rgba(34, 197, 94, 0.25)',
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
