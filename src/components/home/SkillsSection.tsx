/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SKILLS SECTION - Structured grid cards             ###
   ###   Clean category cards with proficiency dot indicators###
   ###   Last Updated: 21-05-2026                           ###
   ########################################################### */

'use client';

/* ###########################################################
   ###   1. Skills Data                                     ###
   ########################################################### */

interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

interface Category {
  id: string;
  title: string;
  color: string;
  dotColor: string;
  skills: Skill[];
}

const categories: Category[] = [
  {
    id: 'ml',
    title: 'ML & AI',
    color: '#4ade80',
    dotColor: '#22c55e',
    skills: [
      { name: 'Python', level: 4 },
      { name: 'PyTorch', level: 4 },
      { name: 'TensorFlow', level: 3 },
      { name: 'scikit-learn', level: 4 },
      { name: 'pandas', level: 4 },
      { name: 'NumPy', level: 4 },
      { name: 'Deep Learning', level: 4 },
      { name: 'NLP', level: 4 },
      { name: 'Transformers', level: 3 },
      { name: 'Computer Vision', level: 3 },
      { name: 'Reinforcement Learning', level: 3 },
    ],
  },
  {
    id: 'web',
    title: 'Web Dev',
    color: '#60a5fa',
    dotColor: '#3b82f6',
    skills: [
      { name: 'TypeScript', level: 4 },
      { name: 'React', level: 5 },
      { name: 'Next.js', level: 5 },
      { name: 'Node.js', level: 4 },
      { name: 'Tailwind', level: 5 },
      { name: 'Supabase', level: 4 },
      { name: 'PostgreSQL', level: 3 },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    color: '#c084fc',
    dotColor: '#a855f7',
    skills: [
      { name: 'Git', level: 5 },
      { name: 'Docker', level: 3 },
      { name: 'GitHub Actions', level: 4 },
      { name: 'Linux', level: 4 },
      { name: 'CI/CD', level: 4 },
      { name: 'VS Code', level: 5 },
      { name: 'Jupyter', level: 4 },
    ],
  },
];

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

export default function SkillsSection() {
  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-5xl mx-auto px-5">
        <h2
          className="text-3xl font-semibold mb-3 tracking-[-0.01em]"
          style={{ color: 'var(--ink)' }}
        >
          Skills
        </h2>
        <p className="text-base mb-10" style={{ color: 'var(--ink-secondary)' }}>
          Technologies and tools I work with.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--stroke)',
                borderLeft: `3px solid ${category.dotColor}`,
              }}
            >
              {/* Category Header */}
              <div
                className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider"
                style={{ color: category.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: category.dotColor }}
                />
                {category.title}
              </div>

              {/* Skills List */}
              <div className="flex flex-col gap-2.5">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                    style={{ background: 'var(--bg-surface)' }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--ink)' }}
                    >
                      {skill.name}
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: dot <= skill.level ? category.dotColor : 'transparent',
                            border: `1.5px solid ${dot <= skill.level ? category.dotColor : 'var(--stroke-hover)'}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
