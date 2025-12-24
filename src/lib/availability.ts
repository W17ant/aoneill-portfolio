/**
 * Single source of truth for availability status.
 * Update this to change status across the entire site.
 */

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

interface AvailabilityConfig {
  status: AvailabilityStatus;
  responseTime: string;
  nextStart: string;
  headline: string;
  description: string;
  ctaText: string;
}

const config: Record<AvailabilityStatus, Omit<AvailabilityConfig, 'status'>> = {
  available: {
    responseTime: 'Within 24 hours',
    nextStart: 'January 2026',
    headline: 'Open for new projects',
    description:
      "I'm currently accepting freelance web development work. If you've got a build that needs polish and speed, let's chat.",
    ctaText: 'Get in touch',
  },
  limited: {
    responseTime: '2-3 days',
    nextStart: 'February 2026',
    headline: 'Limited capacity',
    description:
      "I can take on small scoped work or advisory. If it's urgent, email with timeline and budget.",
    ctaText: 'Discuss availability',
  },
  unavailable: {
    responseTime: '1 week',
    nextStart: 'March 2026',
    headline: 'Booked up',
    description:
      "I'm not taking new work at the moment. Feel free to reach out and I'll suggest a timeline.",
    ctaText: 'Join waitlist',
  },
};

// ========================================
// SET YOUR CURRENT STATUS HERE
// ========================================
const CURRENT_STATUS: AvailabilityStatus = 'available';
// ========================================

export const availability: AvailabilityConfig = {
  status: CURRENT_STATUS,
  ...config[CURRENT_STATUS],
};

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
