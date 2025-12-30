/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CONTENT LIBRARY - Data management for timeline,    ###
   ###   projects, and lab experiments                      ###
   ###   Last Updated: 30-12-2024                           ###
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

export interface Make {
  slug: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  url: string;
  platform: 'thingiverse' | 'printables' | 'github';
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
      'Full-stack e-commerce platform for personalised gifts featuring real-time product customisation, secure Stripe payments, and a complete admin dashboard.',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Supabase', 'Stripe'],
    url: 'https://keepitwhat.com',
    featured: true,
    logo: '/images/keepitwhat-logo.png',
    overview:
      'A production e-commerce platform built from the ground up for a personalised gifts business. Features include a real-time product customiser with live preview, Stripe payment integration, Supabase backend with authentication, and a custom admin dashboard for order management. Built with Next.js 15 App Router and React Server Components for optimal performance.',
    problem:
      'The client needed a modern, high-performance e-commerce solution that could handle complex product customisation (engraving, printing) with live previews, process secure payments, and provide an intuitive admin interface for managing orders and inventory.',
    approach:
      'Developed using Next.js App Router with React Server Components for SEO and performance. Implemented Supabase for database, authentication, and file storage. Integrated Stripe for secure payment processing with webhook handling. Created a custom product customiser using Canvas API for real-time previews. Mobile-first responsive design with Tailwind CSS.',
    outcome:
      'Successfully launched with strong conversion rates. The product customiser significantly reduced customer support queries by letting customers preview their personalised items before purchase. Fast page loads and SEO optimisation improved organic traffic.',
  },
  {
    slug: 'critical-minerals',
    title: 'Critical Minerals Tomorrow',
    description:
      'Professional corporate website for an international strategic advisory firm, built with Next.js and optimised for SEO with schema markup and fast page loads.',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'SEO'],
    url: 'https://criticalmineralstomorrow.com',
    featured: true,
    logo: '/images/critical-minerals-logo.png',
    overview:
      'Corporate website for Critical Minerals Tomorrow, a strategic advisory firm specialising in critical minerals, rare earths, and battery metals. The site establishes professional credibility through clean design, comprehensive content, and strong SEO performance. Built with Next.js for static generation and optimal Core Web Vitals.',
    problem:
      'Lee Constable needed a professional web presence that would establish credibility in the specialised critical minerals sector, attract potential clients through organic search, and clearly communicate the firm\'s expertise and services.',
    approach:
      'Designed a clean, authoritative layout with clear information architecture. Implemented comprehensive technical SEO including schema markup (Organization, Person, Service), meta tags, Open Graph, and XML sitemap. Integrated Google Search Console and Analytics. Optimised for Core Web Vitals with image optimisation and efficient loading.',
    outcome:
      'Achieved strong organic search visibility for targeted keywords in the critical minerals sector. The professional design and clear messaging successfully established credibility with potential clients. Fast loading times and mobile responsiveness improved user engagement.',
  },
  {
    slug: 'tempus-prive',
    title: 'Tempus Prive',
    description:
      'Responsive luxury watch e-commerce prototype demonstrating vanilla JavaScript DOM manipulation, shopping cart functionality, and mobile-first design principles.',
    tech: ['JavaScript', 'CSS', 'E-commerce', 'Responsive Design'],
    url: 'https://aoneill.co.uk/MSC/Tempus-Prive/',
    featured: false,
    logo: '/images/tp-logo.webp',
    overview:
      'Academic project developed for MSc Web Technologies assessment, demonstrating core e-commerce patterns and vanilla JavaScript skills. Features a product catalog with filtering, shopping cart with localStorage persistence, and fully responsive design for all device sizes.',
    problem:
      'Demonstrate comprehensive understanding of e-commerce user experience patterns, JavaScript DOM manipulation without frameworks, responsive CSS techniques, and web accessibility fundamentals.',
    approach:
      'Built entirely with vanilla JavaScript to demonstrate core language proficiency. Implemented product filtering, cart functionality with localStorage persistence, and quantity management. Created responsive layouts using CSS Grid and Flexbox with mobile-first breakpoints.',
    outcome:
      'Successful assessment submission demonstrating strong fundamentals in JavaScript, CSS, and e-commerce UX patterns. The project showcases the ability to build functional web applications without relying on frameworks.',
  },
  {
    slug: 'ai-ethics-game',
    title: 'The Credit Algorithm',
    description:
      'Interactive fiction game exploring AI ethics in financial services, featuring branching narratives, ethical framework scoring, and shareable outcome cards.',
    tech: ['JavaScript', 'Interactive Fiction', 'AI Ethics'],
    url: 'https://aoneill.co.uk/MSC/ai-ethics-finance-scenario.html',
    featured: false,
    logo: '/images/credit-algorithm-logo.png',
    overview:
      'An educational interactive fiction experience that puts players in the role of a product manager at a fintech company developing an AI-powered credit scoring algorithm. Through branching narratives and ethical dilemmas, players explore concepts like algorithmic bias, transparency, fairness, and the social impact of AI systems.',
    problem:
      'Make complex AI ethics concepts accessible and engaging for a general audience through interactive storytelling, rather than traditional academic presentation.',
    approach:
      'Designed a branching narrative structure with multiple decision points and consequences. Implemented an ethical framework scoring system that tracks player choices across different ethical dimensions. Created shareable ending cards that summarise the player\'s ethical approach.',
    outcome:
      'Successfully created an engaging way to explore complex AI ethics topics. The game format makes abstract concepts concrete through real-world scenarios, encouraging reflection on the societal implications of AI systems in finance.',
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
  {
    slug: 'cicd-pipeline',
    title: 'CI/CD Pipeline',
    description: 'Visualize and simulate continuous integration and deployment pipelines.',
    icon: 'GitBranch',
    tags: ['DevOps', 'Visualization', 'Pipeline'],
    component: 'CICDPipeline',
    explores:
      'Interactive simulation of CI/CD pipelines with multiple configurations including parallel job execution.',
    principles: [
      'Pipeline stage visualization',
      'Parallel vs sequential execution',
      'Real-time logging and progress tracking',
      'State machine patterns',
    ],
  },
  {
    slug: 'password-strength',
    title: 'Password Strength',
    description: 'Analyze password security with real-time feedback and crack time estimates.',
    icon: 'KeyRound',
    tags: ['Security', 'Analysis', 'Interactive'],
    component: 'PasswordStrength',
    explores:
      'Real-time password strength analysis with entropy calculation and estimated crack time visualization.',
    principles: [
      'Password entropy calculation',
      'Brute-force time estimation',
      'Real-time validation feedback',
      'Secure password generation',
    ],
  },
  {
    slug: 'bot-detector',
    title: 'Bot Detector',
    description: 'ML-powered analysis of mouse movements and behavior to detect bots.',
    icon: 'ScanFace',
    tags: ['AI', 'Security', 'ML'],
    component: 'BotDetector',
    explores:
      'Real-time behavioral biometrics using a neural network trained to distinguish human mouse patterns from bot automation.',
    principles: [
      'Behavioral biometrics analysis',
      'Neural network classification',
      'Feature extraction from movement data',
      'Real-time anomaly detection',
    ],
  },
  {
    slug: 'dependency-graph',
    title: 'Dependency Graph',
    description: 'Visualize npm package dependencies as an interactive force-directed graph.',
    icon: 'Network',
    tags: ['Visualization', 'GitHub API', 'Canvas'],
    component: 'DependencyGraph',
    explores:
      'Force-directed graph visualization with physics simulation. Fetch package.json from any GitHub repo to explore its dependency tree.',
    principles: [
      'Force-directed graph layout algorithm',
      'Canvas rendering with physics simulation',
      'GitHub API integration',
      'Interactive drag and zoom controls',
    ],
  },
];

/* ###########################################################
   ###   5. Makes Data                                      ###
   ########################################################### */

const makes: Make[] = [
  {
    slug: 'thingiverse',
    title: 'Thingiverse Designs',
    description: '3D printable designs including electronics enclosures, tools, and functional prints.',
    icon: 'Printer',
    tags: ['3D Printing', 'CAD', 'Maker'],
    url: 'https://www.thingiverse.com/BIGT1987/designs',
    platform: 'thingiverse',
  },
];

/* ###########################################################
   ###   6. Content Accessor Functions                      ###
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

export async function getMakes(): Promise<Make[]> {
  return makes;
}
