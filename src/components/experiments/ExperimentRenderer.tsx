'use client';

import dynamic from 'next/dynamic';

// Dynamically import experiment components
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

interface ExperimentRendererProps {
  slug: string;
}

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
