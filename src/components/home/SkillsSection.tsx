/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SKILLS SECTION - Interactive skill cloud           ###
   ###   Color-coded tags with magnetic float effect        ###
   ###   Last Updated: 03-01-2026                           ###
   ########################################################### */

'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

/* ###########################################################
   ###   1. Skills Data                                     ###
   ########################################################### */

interface Skill {
  name: string;
  category: 'ml' | 'web' | 'tools';
  description: string;
}

const skills: Skill[] = [
  // ML & AI
  { name: 'Python', category: 'ml', description: 'Primary language for data science, ML pipelines, and automation scripts.' },
  { name: 'PyTorch', category: 'ml', description: 'Building and training neural networks, especially for research and experimentation.' },
  { name: 'TensorFlow', category: 'ml', description: 'Production ML models and deployment with TensorFlow Serving.' },
  { name: 'scikit-learn', category: 'ml', description: 'Classical ML algorithms, preprocessing, and model evaluation.' },
  { name: 'pandas', category: 'ml', description: 'Data manipulation, cleaning, and exploratory analysis.' },
  { name: 'NumPy', category: 'ml', description: 'Numerical computing and array operations for ML workflows.' },
  { name: 'Deep Learning', category: 'ml', description: 'CNNs, transformers, and architectures for vision and NLP tasks.' },
  { name: 'Reinforcement Learning', category: 'ml', description: 'Training agents with reward-based learning for decision-making problems.' },
  // Web Development
  { name: 'TypeScript', category: 'web', description: 'Type-safe JavaScript for scalable, maintainable codebases.' },
  { name: 'React', category: 'web', description: 'Building interactive UIs with component-based architecture.' },
  { name: 'Next.js', category: 'web', description: 'Full-stack React apps with SSR, routing, and API routes.' },
  { name: 'Node.js', category: 'web', description: 'Server-side JavaScript for APIs and backend services.' },
  { name: 'Tailwind', category: 'web', description: 'Utility-first CSS for rapid, consistent styling.' },
  { name: 'Supabase', category: 'web', description: 'Backend-as-a-service with auth, database, and realtime features.' },
  { name: 'PostgreSQL', category: 'web', description: 'Relational database for complex queries and data integrity.' },
  // Tools
  { name: 'Git', category: 'tools', description: 'Version control for collaboration and code history.' },
  { name: 'Docker', category: 'tools', description: 'Containerizing applications for consistent deployment environments.' },
  { name: 'GitHub Actions', category: 'tools', description: 'Automated CI/CD workflows for testing and deployment.' },
  { name: 'Linux', category: 'tools', description: 'Server administration, shell scripting, and development environment.' },
  { name: 'CI/CD', category: 'tools', description: 'Automated pipelines for continuous integration and delivery.' },
  { name: 'VS Code', category: 'tools', description: 'Primary IDE with extensions for all development workflows.' },
  { name: 'Jupyter', category: 'tools', description: 'Interactive notebooks for data exploration and ML experiments.' },
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
   ###   2. Tooltip Component                               ###
   ########################################################### */

interface TooltipProps {
  skill: Skill;
  colors: typeof categoryColors.ml;
  position: { x: number; y: number };
  visible: boolean;
}

function SkillTooltip({ skill, colors, position, visible }: TooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <div
        className="px-3 py-2 rounded-lg text-xs max-w-[220px] shadow-lg"
        style={{
          background: 'var(--bg)',
          border: `1px solid ${colors.border}`,
          color: 'var(--ink-secondary)',
        }}
      >
        <div className="font-medium mb-1" style={{ color: colors.text }}>
          {skill.name}
        </div>
        <div style={{ lineHeight: 1.4 }}>{skill.description}</div>
        {/* Arrow */}
        <div
          className="absolute -top-1.5 left-4 w-3 h-3 rotate-45"
          style={{
            background: 'var(--bg)',
            borderLeft: `1px solid ${colors.border}`,
            borderTop: `1px solid ${colors.border}`,
          }}
        />
      </div>
    </div>
  );
}

/* ###########################################################
   ###   3. Main Component                                  ###
   ########################################################### */

export default function SkillsSection() {
  const cloudRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(hover: none)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close tooltip when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !activeSkill) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.skill-tag')) {
        setIsVisible(false);
        setTimeout(() => setActiveSkill(null), 200);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, activeSkill]);

  const showTooltip = useCallback((skill: Skill, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const tooltipX = rect.left;
    const tooltipY = rect.bottom + 8;

    setActiveSkill(skill);
    setTooltipPosition({ x: tooltipX, y: tooltipY });
    // Small delay to trigger CSS transition
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setActiveSkill(null), 200);
  }, []);

  const handleTagInteraction = useCallback(
    (skill: Skill, element: HTMLElement, e: React.MouseEvent) => {
      if (isMobile) {
        e.stopPropagation();
        if (activeSkill?.name === skill.name) {
          hideTooltip();
        } else {
          showTooltip(skill, element);
        }
      }
    },
    [isMobile, activeSkill, showTooltip, hideTooltip]
  );

  const handleTagMouseEnter = useCallback(
    (skill: Skill, element: HTMLElement) => {
      if (isMobile) return;
      // Small delay before showing tooltip to avoid flicker
      hoverTimeoutRef.current = setTimeout(() => {
        showTooltip(skill, element);
      }, 150);
    },
    [isMobile, showTooltip]
  );

  const handleTagMouseLeave = useCallback(() => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hideTooltip();
  }, [isMobile, hideTooltip]);

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
                className="skill-tag px-4 py-2 text-sm rounded-full cursor-pointer select-none"
                data-glow={colors.glow}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
                onClick={(e) => handleTagInteraction(skill, e.currentTarget, e)}
                onMouseEnter={(e) => handleTagMouseEnter(skill, e.currentTarget)}
                onMouseLeave={handleTagMouseLeave}
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

      {/* Tooltip */}
      {activeSkill && (
        <SkillTooltip
          skill={activeSkill}
          colors={categoryColors[activeSkill.category]}
          position={tooltipPosition}
          visible={isVisible}
        />
      )}
    </section>
  );
}
