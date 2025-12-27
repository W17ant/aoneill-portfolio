/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CONTENT LIBRARY - Data management for timeline,    ###
   ###   projects, and lab experiments                      ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

/**
 * Content management for timeline, projects, and experiments.
 * Data-driven approach - easy to add/remove without refactoring.
 */

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  tags: string[];
  tone: 'core' | 'growth' | 'current';
  links?: { label: string; href: string }[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  url?: string;
  repo?: string;
  featured: boolean;
  logo?: string;
  overview?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
}

export interface Experiment {
  slug: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  component?: string;
  explores?: string;
  principles?: string[];
}

/* ###########################################################
   ###   2. Timeline Data                                   ###
   ########################################################### */

const timeline: TimelineEntry[] = [
  {
    id: 'foundation',
    date: '2007–2024',
    title: 'Engineering mindset from mechanical systems',
    subtitle: 'Systems thinking under real constraints',
    description:
      '17 years in mechanical engineering, diagnosing complex systems and solving problems under pressure. This shaped my systematic approach to debugging and attention to detail.',
    bullets: [
      'Worked hands-on with safety, time, and cost constraints',
      'Diagnosed failures quickly and fixed them properly',
      'This shaped how I design software systems',
    ],
    tags: ['Systems', 'Problem-solving', 'Engineering'],
    tone: 'core',
  },
  {
    id: 'transition',
    date: '2024',
    title: 'Career transition to software',
    subtitle: 'MSc Computer Science with AI',
    description:
      'Enrolled at St Mary\'s University to formalize my self-taught programming skills and deep-dive into AI/ML.',
    bullets: [
      'Studying machine learning, neural networks, and software engineering',
      'Applying engineering mindset to code architecture',
      'Building real projects while learning theory',
    ],
    tags: ['Education', 'AI/ML', 'Career Change'],
    tone: 'growth',
    links: [
      {
        label: 'University Program',
        href: 'https://online.stmarys.ac.uk/msc-computer-science-with-artificial-intelligence/',
      },
    ],
  },
  {
    id: 'freelance',
    date: '2024–Present',
    title: 'Freelance web development',
    subtitle: 'Shipping real products for clients',
    description:
      'Building production websites and web applications for clients. Focus on Next.js, React, and modern tooling.',
    bullets: [
      'Keep It What - E-commerce platform with custom product builder',
      'Critical Minerals Tomorrow - Corporate site with SEO focus',
      'Multiple business websites with performance optimization',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Freelance'],
    tone: 'current',
    links: [
      { label: 'Keep It What', href: 'https://keepitwhat.com' },
      { label: 'Critical Minerals', href: 'https://criticalmineralstomorrow.com' },
    ],
  },
  {
    id: 'experiments',
    date: 'Ongoing',
    title: 'Experiments & learning',
    subtitle: 'Exploring interaction and systems',
    description:
      'Building experiments to understand fundamentals deeply. Physics simulations, terminal interfaces, and interaction design.',
    bullets: [
      'Elastic lanyard physics with canvas',
      'Terminal-style navigation and forms',
      'Reinforcement learning projects',
    ],
    tags: ['Experiments', 'Learning', 'Creative'],
    tone: 'current',
    links: [{ label: 'View Lab', href: '/lab' }],
  },
];

/* ###########################################################
   ###   3. Projects Data                                   ###
   ########################################################### */

const projects: Project[] = [
  {
    slug: 'keepitwhat',
    title: 'Keep It What',
    description:
      'Personalised gifts e-commerce platform with custom engraving and printing services.',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Supabase', 'Stripe'],
    url: 'https://keepitwhat.com',
    featured: true,
    logo: '/images/keepitwhat-logo.png',
    overview:
      'A full-featured e-commerce platform specialising in custom engraved and printed gifts.',
    problem:
      'The client needed a modern, fast e-commerce site that could handle product customisation previews and secure payments.',
    approach:
      'Built with Next.js App Router for optimal performance, Supabase for the backend, and Stripe for payments. Focus on mobile-first design and fast page loads.',
    outcome:
      'Launched successfully with strong conversion rates. The product customiser significantly reduces customer support queries.',
  },
  {
    slug: 'critical-minerals',
    title: 'Critical Minerals Tomorrow',
    description:
      'Strategic advisory website for critical minerals, rare earths, and battery metals consultancy.',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'SEO'],
    url: 'https://criticalmineralstomorrow.com',
    featured: true,
    logo: '/images/critical-minerals-logo.png',
    overview:
      'Corporate website for an international strategic advisory firm in the critical minerals sector.',
    problem:
      'Lee Constable needed a professional web presence that established credibility in a specialised industry.',
    approach:
      'Clean, authoritative design with comprehensive SEO including schema markup and Google Search Console integration.',
    outcome:
      'Strong organic search visibility and professional client acquisition channel.',
  },
  {
    slug: 'tempus-prive',
    title: 'Tempus Prive',
    description:
      'Luxury watch e-commerce platform developed for MSc Web Technologies assessment.',
    tech: ['JavaScript', 'CSS', 'E-commerce', 'Responsive Design'],
    url: 'https://aoneill.co.uk/MSC/Tempus-Prive/',
    featured: false,
    logo: '/images/tp-logo.webp',
    overview:
      'Academic project showcasing e-commerce fundamentals with a luxury watch theme.',
    problem:
      'Demonstrate understanding of e-commerce patterns, responsive design, and JavaScript DOM manipulation.',
    approach:
      'Vanilla JavaScript with focus on product catalog, cart functionality, and mobile responsiveness.',
    outcome:
      'Successful assessment submission demonstrating core web development skills.',
  },
  {
    slug: 'ai-ethics-game',
    title: 'The Credit Algorithm',
    description:
      'Interactive choose-your-own-adventure exploring ethical challenges in AI-powered credit scoring.',
    tech: ['JavaScript', 'Interactive Fiction', 'AI Ethics'],
    url: 'https://aoneill.co.uk/MSC/ai-ethics-finance-scenario.html',
    featured: false,
    logo: '/images/credit-algorithm-logo.png',
    overview:
      'Educational game exploring ethical dilemmas in AI decision-making for credit applications.',
    problem:
      'Make AI ethics concepts accessible and engaging through interactive storytelling.',
    approach:
      'Branching narrative with ethical framework scoring and shareable ending cards.',
    outcome:
      'Engaging way to explore complex AI ethics topics through interactive fiction.',
  },
];

/* ###########################################################
   ###   4. Experiments Data                                ###
   ########################################################### */

const experiments: Experiment[] = [
  {
    slug: 'lanyard',
    title: 'Elastic Lanyard',
    description: 'Physics-based lanyard with tension, elasticity, and drag interaction.',
    icon: 'IdCard',
    tags: ['Physics', 'Canvas', 'Interaction'],
    component: 'ElasticLanyard',
    explores:
      'Verlet integration for rope physics, elastic constraints, and responsive drag handling.',
    principles: [
      'Physics simulation with Verlet integration',
      'Canvas rendering with gradients',
      'Touch and mouse interaction handling',
      'Performance optimization with requestAnimationFrame',
    ],
  },
  {
    slug: 'terminal-nav',
    title: 'Terminal Navigator',
    description: 'Command-line style navigation with typing animation and suggestions.',
    icon: 'Terminal',
    tags: ['Terminal', 'Navigation', 'Typing'],
    component: 'TerminalNavigator',
    explores:
      'Terminal aesthetics applied to web navigation. Typing animations, command parsing, and keyboard interaction.',
    principles: [
      'Character-by-character typing animation',
      'Command parsing and fuzzy matching',
      'Keyboard navigation patterns',
      'Scroll-triggered activation',
    ],
  },
  {
    slug: 'magnetic-cursor',
    title: 'Magnetic Cursor',
    description: 'Custom cursor with magnetic pull on interactive elements.',
    icon: 'Magnet',
    tags: ['Cursor', 'Magnetic', '3D'],
    component: 'MagneticCursor',
    explores:
      'Custom cursor implementation with magnetic attraction to buttons and 3D tilt effects on cards.',
    principles: [
      'Custom cursor with smooth interpolation',
      'Magnetic pull calculation',
      '3D CSS transforms for tilt effect',
      'Pointer event handling',
    ],
  },
  {
    slug: 'snake-rl',
    title: 'Snake Q-Learning',
    description: 'Watch an AI learn to play Snake using reinforcement learning.',
    icon: 'Brain',
    tags: ['AI', 'Q-Learning', 'Neural Network'],
    component: 'SnakeRL',
    explores:
      'Deep Q-Learning with experience replay. Neural network learns optimal actions through trial and error.',
    principles: [
      'Q-Learning algorithm with neural network',
      'Epsilon-greedy exploration strategy',
      'Experience replay for stable learning',
      'Real-time training visualization',
    ],
  },
];

/* ###########################################################
   ###   5. Content Accessor Functions                      ###
   ########################################################### */

export async function getTimeline(): Promise<TimelineEntry[]> {
  return timeline;
}

export async function getTimelineByTag(tag: string): Promise<TimelineEntry[]> {
  return timeline.filter((entry) =>
    entry.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return projects.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}

export async function getExperiments(): Promise<Experiment[]> {
  return experiments;
}

export async function getExperimentBySlug(slug: string): Promise<Experiment | undefined> {
  return experiments.find((e) => e.slug === slug);
}
