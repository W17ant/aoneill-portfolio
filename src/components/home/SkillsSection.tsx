/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SKILLS SECTION - Interactive skill cloud           ###
   ###   Color-coded tags with magnetic float effect        ###
   ###   Last Updated: 03-01-2026                           ###
   ########################################################### */

'use client';

import { useRef, useCallback } from 'react';

/* ###########################################################
   ###   1. Skills Data                                     ###
   ########################################################### */

interface Skill {
  name: string;
  category: 'ml' | 'web' | 'tools';
}

const skills: Skill[] = [
  // ML & AI
  { name: 'Python', category: 'ml' },
  { name: 'PyTorch', category: 'ml' },
  { name: 'TensorFlow', category: 'ml' },
  { name: 'scikit-learn', category: 'ml' },
  { name: 'pandas', category: 'ml' },
  { name: 'NumPy', category: 'ml' },
  { name: 'Deep Learning', category: 'ml' },
  { name: 'Reinforcement Learning', category: 'ml' },
  // Web Development
  { name: 'TypeScript', category: 'web' },
  { name: 'React', category: 'web' },
  { name: 'Next.js', category: 'web' },
  { name: 'Node.js', category: 'web' },
  { name: 'Tailwind', category: 'web' },
  { name: 'Supabase', category: 'web' },
  { name: 'PostgreSQL', category: 'web' },
  // Tools
  { name: 'Git', category: 'tools' },
  { name: 'Docker', category: 'tools' },
  { name: 'GitHub Actions', category: 'tools' },
  { name: 'Linux', category: 'tools' },
  { name: 'CI/CD', category: 'tools' },
  { name: 'VS Code', category: 'tools' },
  { name: 'Jupyter', category: 'tools' },
];

const categoryColors = {
  ml: {
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.25)',
    text: '#4ade80',
    dot: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.4)',
  },
  web: {
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.25)',
    text: '#60a5fa',
    dot: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
  tools: {
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.25)',
    text: '#c084fc',
    dot: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
};

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

export default function SkillsSection() {
  const cloudRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cloudRef.current) return;
    const tags = cloudRef.current.querySelectorAll<HTMLSpanElement>('.skill-tag');

    tags.forEach((tag) => {
      const rect = tag.getBoundingClientRect();
      const tagCenterX = rect.left + rect.width / 2;
      const tagCenterY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - tagCenterX, e.clientY - tagCenterY);

      if (distance < 120) {
        const strength = (120 - distance) / 120;
        const dx = (e.clientX - tagCenterX) * strength * 0.15;
        const dy = (e.clientY - tagCenterY) * strength * 0.15;
        tag.style.transform = `translate(${dx}px, ${dy}px)`;
        tag.style.filter = `brightness(${1 + strength * 0.3})`;
        tag.style.boxShadow = `0 4px ${15 + strength * 15}px ${tag.dataset.glow}`;
      } else {
        tag.style.transform = '';
        tag.style.filter = '';
        tag.style.boxShadow = '';
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cloudRef.current) return;
    const tags = cloudRef.current.querySelectorAll<HTMLSpanElement>('.skill-tag');
    tags.forEach((tag) => {
      tag.style.transform = '';
      tag.style.filter = '';
      tag.style.boxShadow = '';
    });
  }, []);

  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <h2 className="text-3xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
          Skills
        </h2>
        <p className="text-base mb-10" style={{ color: 'var(--ink-secondary)' }}>
          Technologies and tools I work with.
        </p>

        <div
          ref={cloudRef}
          className="flex flex-wrap gap-2.5"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {skills.map((skill) => {
            const colors = categoryColors[skill.category];
            return (
              <span
                key={skill.name}
                className="skill-tag px-4 py-2 text-sm rounded-full cursor-default select-none"
                data-glow={colors.glow}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                {skill.name}
              </span>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-6 pt-4" style={{ borderTop: '1px solid var(--stroke)' }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: categoryColors.ml.dot }} />
            <span>ML & AI</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: categoryColors.web.dot }} />
            <span>Web Dev</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: categoryColors.tools.dot }} />
            <span>Tools</span>
          </div>
        </div>
      </div>
    </section>
  );
}
