/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SKILLS SECTION - Structured grid cards             ###
   ###   Clean category cards with hover-reveal descriptions###
   ###   Last Updated: 16-01-2026                           ###
   ########################################################### */

'use client';

/* ###########################################################
   ###   1. Skills Data                                     ###
   ########################################################### */

interface Skill {
  name: string;
  description: string;
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
      { name: 'Python', description: 'Primary language for data science and ML pipelines.' },
      { name: 'PyTorch', description: 'Building and training neural networks.' },
      { name: 'TensorFlow', description: 'Production ML models and deployment.' },
      { name: 'scikit-learn', description: 'Classical ML algorithms and preprocessing.' },
      { name: 'pandas', description: 'Data manipulation and analysis.' },
      { name: 'NumPy', description: 'Numerical computing and array operations.' },
      { name: 'Deep Learning', description: 'CNNs, transformers, vision and NLP.' },
      { name: 'Reinforcement Learning', description: 'Reward-based agent training.' },
    ],
  },
  {
    id: 'web',
    title: 'Web Dev',
    color: '#60a5fa',
    dotColor: '#3b82f6',
    skills: [
      { name: 'TypeScript', description: 'Type-safe JavaScript for scalable codebases.' },
      { name: 'React', description: 'Component-based interactive UIs.' },
      { name: 'Next.js', description: 'Full-stack React with SSR and API routes.' },
      { name: 'Node.js', description: 'Server-side JavaScript for APIs.' },
      { name: 'Tailwind', description: 'Utility-first CSS for rapid styling.' },
      { name: 'Supabase', description: 'Backend-as-a-service with auth and database.' },
      { name: 'PostgreSQL', description: 'Relational database for complex queries.' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    color: '#c084fc',
    dotColor: '#a855f7',
    skills: [
      { name: 'Git', description: 'Version control and collaboration.' },
      { name: 'Docker', description: 'Containerizing applications.' },
      { name: 'GitHub Actions', description: 'CI/CD automation workflows.' },
      { name: 'Linux', description: 'Server admin and shell scripting.' },
      { name: 'CI/CD', description: 'Automated testing and deployment pipelines.' },
      { name: 'VS Code', description: 'Primary IDE with extensions.' },
      { name: 'Jupyter', description: 'Interactive notebooks for ML experiments.' },
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
              <div className="flex flex-col gap-1.5">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group px-3 py-2 rounded-lg cursor-default transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                    style={{ background: 'var(--bg-surface)' }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: 'var(--ink)' }}
                    >
                      {skill.name}
                    </div>
                    <div
                      className="text-xs overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0 group-hover:max-h-[60px] group-hover:opacity-100 group-hover:mt-1"
                      style={{ color: 'var(--ink-muted)' }}
                    >
                      {skill.description}
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
