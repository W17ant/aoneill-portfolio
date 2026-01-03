/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SKILLS SECTION - Technical skills showcase         ###
   ###   Organised by category with visual grouping         ###
   ###   Last Updated: 03-01-2026                           ###
   ########################################################### */

/* ###########################################################
   ###   1. Skills Data                                     ###
   ########################################################### */

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Machine Learning & AI',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'pandas', 'NumPy', 'Jupyter', 'Deep Learning', 'Reinforcement Learning'],
  },
  {
    name: 'Web Development',
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'REST APIs'],
  },
  {
    name: 'Tools & Practices',
    skills: ['Git', 'GitHub Actions', 'Docker', 'Linux', 'VS Code', 'Agile', 'CI/CD', 'Testing'],
  },
];

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

export default function SkillsSection() {
  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <h2 className="text-3xl font-semibold mb-3 tracking-[-0.01em]" style={{ color: 'var(--ink)' }}>
          Skills
        </h2>
        <p className="text-base mb-10" style={{ color: 'var(--ink-secondary)' }}>
          Technologies and tools I work with.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {skillCategories.map((category) => (
            <div key={category.name}>
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--accent)' }}
              >
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm rounded-full"
                    style={{
                      background: 'var(--bg-base)',
                      color: 'var(--ink)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
