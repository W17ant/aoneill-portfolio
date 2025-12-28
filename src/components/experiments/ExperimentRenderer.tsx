/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   EXPERIMENT RENDERER - Dynamic component loader     ###
   ###   Handles lazy loading of experiment components      ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import dynamic from 'next/dynamic';

/* ###########################################################
   ###   1. Dynamic Imports                                 ###
   ########################################################### */

// Dynamically import experiment components with loading states
const InteractiveLanyard = dynamic(() => import('./InteractiveLanyard'), {
  ssr: false,
  loading: () => <ExperimentPlaceholder name="Interactive Lanyard" />,
});

const TerminalNavigator = dynamic(() => import('./TerminalNavigator'), {
  ssr: false,
  loading: () => <ExperimentPlaceholder name="Terminal Navigator" />,
});

const MagneticCursor = dynamic(() => import('./MagneticCursor'), {
  ssr: false,
  loading: () => <ExperimentPlaceholder name="Magnetic Cursor" />,
});

const SnakeRL = dynamic(() => import('./SnakeRL'), {
  ssr: false,
  loading: () => <ExperimentPlaceholder name="Snake Q-Learning" />,
});

const CICDPipeline = dynamic(() => import('./CICDPipeline'), {
  ssr: false,
  loading: () => <ExperimentPlaceholder name="CI/CD Pipeline" />,
});

const PasswordStrength = dynamic(() => import('./PasswordStrength'), {
  ssr: false,
  loading: () => <ExperimentPlaceholder name="Password Strength" />,
});

/* ###########################################################
   ###   2. Helper Components                               ###
   ########################################################### */

// Loading placeholder shown while experiment loads
function ExperimentPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="w-full aspect-[5/4] max-w-[900px] mx-auto rounded-3xl flex items-center justify-center"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        boxShadow: '0 40px 120px rgba(0, 0, 0, 0.55)',
      }}
    >
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        <p style={{ color: 'var(--foreground-muted)' }}>Loading {name}...</p>
      </div>
    </div>
  );
}

/* ###########################################################
   ###   3. Type Definitions                                ###
   ########################################################### */

interface ExperimentRendererProps {
  slug: string;
}

/* ###########################################################
   ###   4. Main Component                                  ###
   ########################################################### */

// Render experiment based on slug
export default function ExperimentRenderer({ slug }: ExperimentRendererProps) {
  switch (slug) {
    case 'lanyard':
      return <InteractiveLanyard />;
    case 'terminal-nav':
      return <TerminalNavigator />;
    case 'magnetic-cursor':
      return <MagneticCursor />;
    case 'snake-rl':
      return <SnakeRL />;
    case 'cicd-pipeline':
      return <CICDPipeline />;
    case 'password-strength':
      return <PasswordStrength />;
    default:
      return (
        <div
          className="w-full aspect-video flex items-center justify-center rounded-2xl"
          style={{ background: 'var(--background-secondary)' }}
        >
          <p style={{ color: 'var(--foreground-muted)' }}>
            Component not found: {slug}
          </p>
        </div>
      );
  }
}
