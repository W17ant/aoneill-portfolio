/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   AVAILABILITY CONFIG - Status management            ###
   ###   Single source of truth for availability status     ###
   ###   Last Updated: 02-03-2026                           ###
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
    nextStart: 'Immediately',
    headline: 'Open to opportunities',
    description:
      "I'm finishing my MSc in AI and looking at data science, ML engineering, and software roles. Happy to talk about graduate schemes, contracts, or anything interesting.",
    ctaText: 'Get in touch',
  },
  limited: {
    responseTime: '2-3 days',
    nextStart: 'May 2026',
    headline: 'Limited availability',
    description:
      "Heads down on coursework right now, but still open to a conversation. Send the details and I'll get back within a few days.",
    ctaText: 'Discuss availability',
  },
  unavailable: {
    responseTime: '1 week',
    nextStart: 'July 2026',
    headline: 'Focused on studies',
    description:
      "Deep in exam season or project deadlines. I'll still read messages, just might take a bit longer to reply.",
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
