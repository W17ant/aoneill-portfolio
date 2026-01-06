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

export interface TutorialStep {
  title: string;
  description: string;
  code?: string;
  language?: string;
  tip?: string;
}

export interface Tutorial {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  prerequisites: string[];
  steps: TutorialStep[];
  resources?: { label: string; url: string }[];
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
  tutorial?: Tutorial;
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
    slug: 'snake-rl-agent',
    title: 'Deep Q-Learning Snake Agent',
    description:
      'Reinforcement learning agent that learns to play Snake using a deep neural network. Includes systematic experiments comparing network architectures, memory sizes, and environment configurations.',
    tech: ['Python', 'PyTorch', 'Deep Q-Learning', 'Neural Networks', 'Reinforcement Learning'],
    repo: 'https://github.com/W17ant/msc-artificial-intelligence/tree/main/assessments/snake-rl',
    featured: true,
    logo: '/images/snake-rl-logo.png',
    overview:
      'MSc Artificial Intelligence final assessment project implementing a Deep Q-Network (DQN) agent that learns to play Snake through trial and error. The agent uses an 11-dimensional state representation, experience replay for stable learning, and epsilon-greedy exploration. Includes comprehensive experiments comparing different neural network architectures (256, 512, and deeper configurations), memory buffer sizes (10K to 200K), and environment variants (with and without wall collisions).',
    problem:
      'Develop an intelligent agent capable of learning optimal gameplay strategies for Snake without explicit programming of rules. The challenge involves handling sparse rewards (only positive reward when eating food), learning long-term strategies (avoiding traps), and balancing exploration vs exploitation during training.',
    approach:
      'Implemented Deep Q-Learning with experience replay using PyTorch. The neural network takes an 11-feature state vector (danger detection in 3 directions, current direction, food location) and outputs Q-values for 3 actions (straight, left, right). Training uses the Bellman equation to update Q-values, with epsilon-greedy exploration that decays over time. Conducted 12 systematic experiments varying architecture depth, hidden layer width, and replay memory size.',
    outcome:
      'Best configuration achieved consistent scores of 40+ after 200 training episodes. Experiments revealed that wider networks (256 neurons) outperformed deeper ones for this task, and larger replay buffers improved stability. The wall-collision variant proved more challenging, requiring different hyperparameter tuning. Full analysis documented with training curves, architecture comparisons, and statistical summaries.',
  },
  {
    slug: 'heart-disease-classification',
    title: 'Heart Disease Classification',
    description:
      'Machine learning classification system comparing Random Forest, SVM, and Neural Network approaches for predicting heart disease risk, achieving 85% accuracy with comprehensive model evaluation.',
    tech: ['Python', 'scikit-learn', 'TensorFlow', 'Keras', 'pandas', 'Data Science'],
    repo: 'https://github.com/W17ant/msc-artificial-intelligence/tree/main/assessments/heart-disease',
    featured: true,
    logo: '/images/heart-disease-logo.jpg',
    overview:
      'MSc Artificial Intelligence mid-module assessment implementing binary classification to predict heart disease risk using the UCI Heart Disease dataset. Comprehensive comparison of three machine learning approaches: Random Forest (ensemble learning), Support Vector Machines (kernel methods), and Neural Networks (deep learning). Each model tested with 3 different configurations to explore hyperparameter effects.',
    problem:
      'Develop a reliable predictive model for heart disease risk assessment using patient health metrics. The challenge involves handling a relatively small dataset (303 samples), selecting informative features from 13 clinical variables, and choosing the optimal algorithm and hyperparameters for this specific medical classification task.',
    approach:
      'Implemented a complete ML pipeline including exploratory data analysis with correlation heatmaps, feature importance ranking, and distribution analysis. Data preprocessing with StandardScaler normalisation and stratified train-test splits. Trained 9 model configurations: Random Forest (default, depth-limited, sample-constrained), SVM (RBF, linear, tuned RBF), and Neural Networks (simple, with dropout, wider architecture). Evaluation using accuracy, precision, recall, F1-score, ROC-AUC, and confusion matrices.',
    outcome:
      'Random Forest with sample constraints achieved the highest accuracy at 85.25%, with chest pain type (cp), maximum heart rate (thalachh), and number of major vessels (caa) identified as the most predictive features. Neural networks showed tendency to overfit on the small dataset despite dropout regularisation. Comprehensive Jupyter notebook with visualisations, statistical analysis, and reproducible results.',
  },
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
  {
    slug: 'ml-classification-practical',
    title: 'NCM Classification Practical',
    description:
      'Interactive Jupyter notebook walkthrough demonstrating Nearest Class Mean classification with live code execution, visualisations, and extensions including LDA, QDA, and Mahalanobis distance.',
    tech: ['Python', 'NumPy', 'Matplotlib', 'Machine Learning', 'Classification'],
    url: 'https://aoneill.co.uk/ml-practical/notebook_guide.html',
    repo: 'https://github.com/W17ant/machine-learning-practical',
    featured: true,
    logo: '/images/ml-practical-logo.svg',
    overview:
      'An interactive educational tool that simulates running a Jupyter notebook cell-by-cell, teaching machine learning classification concepts through hands-on code examples. Covers the complete ML pipeline from data loading to model evaluation, with four extensions exploring advanced classifiers.',
    problem:
      'Traditional static documentation fails to convey the iterative, experimental nature of machine learning. Students need to understand not just what code does, but why each step matters and how outputs change with different approaches.',
    approach:
      'Built an interactive HTML page that simulates Jupyter notebook execution with auto-typing code animation, live syntax highlighting, and contextual explanations. Each cell includes a helper panel explaining the concepts, expected outputs, and connections to ML theory. Implemented NCM, LDA, QDA, and Mahalanobis distance classifiers from scratch.',
    outcome:
      'A self-contained educational resource that demonstrates the difference between equal and unequal covariance classification problems. Dataset A achieves 100% accuracy with NCM while Dataset B shows 98.5%, clearly illustrating when linear vs quadratic decision boundaries are appropriate.',
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
    tutorial: {
      difficulty: 'Intermediate',
      duration: '45-60 min',
      prerequisites: ['Basic JavaScript/TypeScript', 'HTML Canvas fundamentals', 'Understanding of 2D vectors'],
      steps: [
        {
          title: 'Understanding Verlet Integration',
          description: 'Verlet integration is a numerical method for calculating motion. Unlike traditional physics where we track velocity, Verlet uses the difference between current and previous positions to determine movement. This makes it naturally stable and perfect for rope/cloth simulations.',
          code: `// Traditional physics: velocity-based
position += velocity;
velocity += acceleration;

// Verlet integration: position-based
const velocity = position - previousPosition;
previousPosition = position;
position += velocity + acceleration;`,
          language: 'javascript',
          tip: 'Verlet integration is self-correcting - small errors don\'t accumulate over time like they do with Euler integration.'
        },
        {
          title: 'Creating the Point System',
          description: 'Define a Point interface that stores current position, previous position (for Verlet), and whether the point is pinned (fixed in place). The rope will be a chain of these points.',
          code: `interface Point {
  x: number;
  y: number;
  oldX: number;      // Previous position for Verlet
  oldY: number;
  pinned: boolean;   // Fixed points don't move
  mass: number;      // Heavier points swing slower
}

function createPoint(x: number, y: number, pinned = false): Point {
  return {
    x, y,
    oldX: x,         // Start with no velocity
    oldY: y,
    pinned,
    mass: 1
  };
}`,
          language: 'typescript'
        },
        {
          title: 'Building the Constraint System',
          description: 'Constraints maintain fixed distances between points. Each constraint connects two points and tries to keep them at a target length. This is what gives the rope its structure.',
          code: `interface Constraint {
  p1: Point;
  p2: Point;
  length: number;         // Target distance
  originalLength: number; // For calculating stretch
}

function resolveConstraint(c: Constraint) {
  const dx = c.p2.x - c.p1.x;
  const dy = c.p2.y - c.p1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate how much to move each point
  const difference = (c.length - distance) / distance;
  const offsetX = dx * difference * 0.5;
  const offsetY = dy * difference * 0.5;

  // Move points toward/away from each other
  if (!c.p1.pinned) {
    c.p1.x -= offsetX;
    c.p1.y -= offsetY;
  }
  if (!c.p2.pinned) {
    c.p2.x += offsetX;
    c.p2.y += offsetY;
  }
}`,
          language: 'typescript',
          tip: 'Run constraint resolution multiple times per frame (iterations) for a stiffer rope. More iterations = more stable but slower.'
        },
        {
          title: 'Physics Update Loop',
          description: 'Each frame, update all points using Verlet integration, then resolve constraints multiple times to maintain the rope structure.',
          code: `const config = {
  gravity: 0.35,
  damping: 0.97,    // Air resistance (1 = none, 0 = frozen)
  iterations: 6     // Constraint solving passes
};

function updatePoint(point: Point) {
  if (point.pinned) return;

  // Calculate velocity from position difference
  const vx = (point.x - point.oldX) * config.damping;
  const vy = (point.y - point.oldY) * config.damping;

  // Store current position
  point.oldX = point.x;
  point.oldY = point.y;

  // Apply velocity and gravity
  point.x += vx;
  point.y += vy + config.gravity;
}

function animate() {
  // Update physics
  for (const point of points) {
    updatePoint(point);
  }

  // Resolve constraints multiple times
  for (let i = 0; i < config.iterations; i++) {
    for (const constraint of constraints) {
      resolveConstraint(constraint);
    }
  }

  // Render
  draw();
  requestAnimationFrame(animate);
}`,
          language: 'typescript'
        },
        {
          title: 'Adding Drag Interaction',
          description: 'Allow users to grab and drag the end of the rope. When dragging, directly set the point position instead of letting physics control it.',
          code: `let isDragging = false;
let dragPoint: Point | null = null;

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragPoint = points[points.length - 1]; // Grab end point
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !dragPoint) return;

  const rect = canvas.getBoundingClientRect();
  dragPoint.x = e.clientX - rect.left;
  dragPoint.y = e.clientY - rect.top;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  dragPoint = null;
});`,
          language: 'typescript',
          tip: 'Attach mousemove and mouseup to document, not canvas - this lets users drag outside the canvas bounds without losing the interaction.'
        },
        {
          title: 'Rendering with Canvas Gradients',
          description: 'Draw the rope with varying width and color based on stretch. Thinner and redder when stretched, thicker and bluer when relaxed.',
          code: `function drawLanyard(ctx: CanvasRenderingContext2D) {
  for (const c of constraints) {
    const stretch = c.stretch || 1;

    // Width decreases with stretch
    const width = Math.max(10, 28 / Math.pow(stretch, 0.6));

    // Color shifts red when stretched
    const stretchNorm = Math.min(1, (stretch - 1) / 1.2);
    const r = Math.floor(17 + stretchNorm * 100);
    const g = Math.floor(24 - stretchNorm * 20);
    const b = Math.floor(39 - stretchNorm * 30);

    ctx.strokeStyle = \`rgb(\${r}, \${g}, \${b})\`;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(c.p1.x, c.p1.y);
    ctx.lineTo(c.p2.x, c.p2.y);
    ctx.stroke();
  }
}`,
          language: 'typescript'
        }
      ],
      resources: [
        { label: 'Verlet Integration Explained', url: 'https://en.wikipedia.org/wiki/Verlet_integration' },
        { label: 'Canvas API Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API' },
        { label: 'requestAnimationFrame', url: 'https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame' }
      ]
    }
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
    tutorial: {
      difficulty: 'Beginner',
      duration: '30-45 min',
      prerequisites: ['Basic React/JavaScript', 'Understanding of async/await', 'Basic CSS'],
      steps: [
        {
          title: 'Setting Up the Terminal Structure',
          description: 'Create a terminal-like container with a header bar (traffic lights), scrollable body for output, and an input area at the bottom.',
          code: `function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="terminal">
      {/* Header with traffic lights */}
      <div className="terminal-header">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="title">TERMINAL</span>
      </div>

      {/* Scrollable output area */}
      <div ref={bodyRef} className="terminal-body">
        {lines.map((line, i) => (
          <pre key={i}>{line}</pre>
        ))}
      </div>

      {/* Input area */}
      <div className="terminal-input">
        <span className="prompt">user@site:~$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
}`,
          language: 'tsx'
        },
        {
          title: 'Character-by-Character Typing Animation',
          description: 'Create a typing effect by revealing text one character at a time using async/await and setTimeout.',
          code: `async function typeText(text: string, delay = 20) {
  let displayed = '';

  for (let i = 0; i < text.length; i++) {
    displayed += text[i];

    // Update the last line with current progress
    setLines(prev => {
      const newLines = [...prev];
      newLines[newLines.length - 1] = displayed;
      return newLines;
    });

    // Wait before next character
    await new Promise(resolve =>
      setTimeout(resolve, delay)
    );
  }
}

// Usage: run a demo script
async function runDemo() {
  const script = [
    { text: 'Booting system...', delay: 30 },
    { text: 'Welcome, user.', delay: 15 },
    { text: '$ help', delay: 25 },
  ];

  for (const line of script) {
    setLines(prev => [...prev, '']); // Add empty line
    await typeText(line.text, line.delay);
    await new Promise(r => setTimeout(r, 200)); // Pause between lines
  }
}`,
          language: 'typescript',
          tip: 'Adjust the delay based on line type - user input should type slower than system output to feel more natural.'
        },
        {
          title: 'Command Parsing and Routing',
          description: 'Parse user input into command and arguments, then execute the appropriate action. Use a switch statement or command map.',
          code: `interface Route {
  key: string;
  label: string;
  path: string;
}

const routes: Route[] = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'projects', label: 'Projects', path: '/projects' },
  { key: 'contact', label: 'Contact', path: '/contact' },
];

function runCommand(input: string) {
  const parts = input.trim().split(' ');
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  switch (cmd) {
    case 'help':
      addOutput('Commands: help, ls, open <page>, clear');
      break;

    case 'ls':
      addOutput(routes.map(r => r.key).join('  '));
      break;

    case 'open':
    case 'cd':
      const route = routes.find(r =>
        r.key === arg || r.key.startsWith(arg)
      );
      if (route) {
        addOutput(\`Opening \${route.path}...\`);
        setTimeout(() => {
          window.location.href = route.path;
        }, 500);
      } else {
        addOutput(\`Not found: "\${arg}". Try "ls" to see options.\`);
      }
      break;

    case 'clear':
      setLines([]);
      break;

    default:
      addOutput(\`Unknown command: "\${cmd}". Type "help".\`);
  }
}`,
          language: 'typescript'
        },
        {
          title: 'Adding Command Suggestions',
          description: 'Show clickable suggestions based on current input. Filter available commands and routes as the user types.',
          code: `function getSuggestions(input: string): string[] {
  const value = input.trim().toLowerCase();

  // No input - show common commands
  if (!value) {
    return ['help', 'ls', 'open projects'];
  }

  const parts = value.split(' ');
  const cmd = parts[0];

  // Completing command name
  if (parts.length === 1) {
    return ['help', 'ls', 'open', 'clear']
      .filter(c => c.startsWith(cmd));
  }

  // Completing 'open' argument
  if (cmd === 'open') {
    const arg = parts[1] || '';
    return routes
      .filter(r => r.key.startsWith(arg))
      .map(r => \`open \${r.key}\`);
  }

  return [];
}

// Render suggestions as clickable chips
{suggestions.map(s => (
  <button
    key={s}
    onClick={() => setInput(s)}
    className="suggestion-chip"
  >
    {s}
  </button>
))}`,
          language: 'tsx',
          tip: 'Limit suggestions to 4-5 items to avoid overwhelming users. Prioritize the most likely commands.'
        },
        {
          title: 'Scroll-Triggered Activation',
          description: 'Use Intersection Observer to start the typing animation when the terminal scrolls into view.',
          code: `const [started, setStarted] = useState(false);
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!containerRef.current || started) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          runDemo(); // Start typing animation
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 } // Trigger when 35% visible
  );

  observer.observe(containerRef.current);

  return () => observer.disconnect();
}, [started]);

// Show "Scroll to start" until activated
{!started && (
  <div className="hint">Scroll to start...</div>
)}`,
          language: 'tsx'
        },
        {
          title: 'Keyboard Navigation',
          description: 'Handle Enter to submit, arrow keys for menu navigation, and Escape to close menus.',
          code: `function handleKeyDown(e: React.KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      runCommand(input);
      setInput('');
      break;

    case 'ArrowUp':
      e.preventDefault();
      // Navigate command history or menu
      setSelected(s => Math.max(0, s - 1));
      break;

    case 'ArrowDown':
      e.preventDefault();
      setSelected(s => Math.min(options.length - 1, s + 1));
      break;

    case 'Escape':
      e.preventDefault();
      setMenuOpen(false);
      break;

    case 'Tab':
      e.preventDefault();
      // Auto-complete from suggestions
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
      }
      break;
  }
}`,
          language: 'typescript'
        }
      ],
      resources: [
        { label: 'Intersection Observer API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API' },
        { label: 'React Keyboard Events', url: 'https://react.dev/reference/react-dom/components/common#keyboardevent-handler' },
        { label: 'CSS Terminal Styling', url: 'https://css-tricks.com/old-timey-terminal-styling/' }
      ]
    }
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
    tutorial: {
      difficulty: 'Beginner',
      duration: '25-35 min',
      prerequisites: ['Basic JavaScript/CSS', 'Understanding of mouse events', 'CSS transforms basics'],
      steps: [
        {
          title: 'Creating a Custom Cursor',
          description: 'Replace the default cursor with custom elements - an outer ring and inner dot. Position them absolutely and follow the mouse.',
          code: `// Cursor elements
<div class="cursor-ring" id="ring"></div>
<div class="cursor-dot" id="dot"></div>

// CSS
.cursor-ring, .cursor-dot {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}

.cursor-ring {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

// Hide default cursor on container
.container { cursor: none; }`,
          language: 'css'
        },
        {
          title: 'Smooth Cursor Following with Lerp',
          description: 'Instead of the cursor snapping to mouse position, use linear interpolation (lerp) for a smooth, trailing effect.',
          code: `let cursorX = 0, cursorY = 0;  // Current position
let targetX = 0, targetY = 0;  // Mouse position

const ring = document.getElementById('ring');
const dot = document.getElementById('dot');

// Track mouse position
document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

// Animation loop with lerp
function animate() {
  // Lerp: move 15% of the way to target each frame
  cursorX += (targetX - cursorX) * 0.15;
  cursorY += (targetY - cursorY) * 0.15;

  // Apply position
  ring.style.left = cursorX + 'px';
  ring.style.top = cursorY + 'px';
  dot.style.left = cursorX + 'px';
  dot.style.top = cursorY + 'px';

  requestAnimationFrame(animate);
}

animate();`,
          language: 'javascript',
          tip: 'The lerp value (0.15) controls smoothness. Lower = smoother but more lag, higher = snappier but less smooth.'
        },
        {
          title: 'Magnetic Pull Effect on Buttons',
          description: 'Make buttons "pull" toward the cursor when hovering. Calculate the offset from the button center and apply a fraction of it as a transform.',
          code: `const buttons = document.querySelectorAll('.magnetic-btn');
const magneticStrength = 0.3; // How strongly it pulls

buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();

    // Distance from button center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Apply magnetic pull (button moves toward cursor)
    btn.style.transform = \`translate(
      \${deltaX * magneticStrength}px,
      \${deltaY * magneticStrength}px
    )\`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});`,
          language: 'javascript'
        },
        {
          title: '3D Tilt Effect on Cards',
          description: 'Create a 3D perspective effect where cards rotate based on cursor position. Use CSS perspective and rotateX/Y transforms.',
          code: `const cards = document.querySelectorAll('.tilt-card');
const tiltAmount = 10; // Degrees of rotation

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();

    // Position as -0.5 to 0.5 (center is 0)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Calculate rotation
    // rotateY: horizontal tilt (positive x = right side up)
    // rotateX: vertical tilt (negative y = top toward viewer)
    const rotateY = x * tiltAmount;
    const rotateX = -y * tiltAmount;

    card.style.transform = \`
      perspective(1000px)
      rotateY(\${rotateY}deg)
      rotateX(\${rotateX}deg)
      scale(1.02)
    \`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = \`
      perspective(1000px)
      rotateY(0deg)
      rotateX(0deg)
      scale(1)
    \`;
  });
});`,
          language: 'javascript',
          tip: 'Add transform-style: preserve-3d to cards and translateZ to child elements for a true 3D layered effect.'
        },
        {
          title: 'Dynamic Glow Effect',
          description: 'Add a radial gradient glow that follows the cursor position within each card.',
          code: `// HTML: Add glow overlay inside card
<div class="tilt-card">
  <div class="card-glow"></div>
  <h3>Card Title</h3>
</div>

// CSS
.card-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  transition: background 0.2s;
}

// JavaScript: Update glow on mousemove
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  const glow = card.querySelector('.card-glow');
  glow.style.background = \`
    radial-gradient(
      circle at \${x * 100}% \${y * 100}%,
      rgba(96, 165, 250, 0.15),
      transparent 50%
    )
  \`;
});

card.addEventListener('mouseleave', () => {
  const glow = card.querySelector('.card-glow');
  glow.style.background = 'transparent';
});`,
          language: 'javascript'
        },
        {
          title: 'Cursor State Changes',
          description: 'Expand the cursor ring when hovering over interactive elements to provide visual feedback.',
          code: `// CSS for expanded state
.cursor-ring.expanded {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
}

// Add smooth transition
.cursor-ring {
  transition: width 0.2s, height 0.2s, background 0.2s;
}

// JavaScript: Toggle expanded class
const interactiveElements = document.querySelectorAll(
  '.magnetic-btn, .tilt-card'
);

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.classList.add('expanded');
  });

  el.addEventListener('mouseleave', () => {
    ring.classList.remove('expanded');
  });
});`,
          language: 'javascript'
        }
      ],
      resources: [
        { label: 'CSS Transforms', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/transform' },
        { label: 'CSS Perspective', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/perspective' },
        { label: 'requestAnimationFrame', url: 'https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame' }
      ]
    }
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
    tutorial: {
      difficulty: 'Advanced',
      duration: '60-90 min',
      prerequisites: ['Python basics', 'Understanding of neural networks', 'Basic calculus (gradients)', 'PyTorch fundamentals'],
      steps: [
        {
          title: 'Understanding Q-Learning',
          description: 'Q-Learning is a reinforcement learning algorithm that learns the value (Q) of taking an action in a given state. The "Q" stands for "quality" - how good is this action? The agent learns by trial and error, updating Q-values based on rewards received.',
          code: `# The Bellman Equation - core of Q-Learning
# Q(s,a) = r + γ * max(Q(s',a'))
#
# Where:
# - Q(s,a) = value of taking action 'a' in state 's'
# - r = immediate reward
# - γ (gamma) = discount factor (0-1), values future rewards
# - s' = next state
# - max(Q(s',a')) = best possible value from next state

# Example: Snake eats food
# reward = +10
# gamma = 0.9
# max Q of next state = 5
# New Q = 10 + 0.9 * 5 = 14.5`,
          language: 'python',
          tip: 'Gamma (γ) controls how much the agent cares about future rewards. γ=0 means only immediate rewards matter, γ=1 means future rewards are equally important as immediate ones.'
        },
        {
          title: 'Defining the State Space',
          description: 'The state is what the agent "sees" about the environment. For Snake, we encode 11 boolean features that capture danger, direction, and food location. This compressed representation is much more efficient than using raw pixel data.',
          code: `def get_state(self, game):
    """Convert game state to 11-feature vector"""
    head = game.snake[0]

    # Points adjacent to head
    point_l = Point(head.x - 20, head.y)
    point_r = Point(head.x + 20, head.y)
    point_u = Point(head.x, head.y - 20)
    point_d = Point(head.x, head.y + 20)

    # Current direction (one-hot encoded)
    dir_l = game.direction == Direction.LEFT
    dir_r = game.direction == Direction.RIGHT
    dir_u = game.direction == Direction.UP
    dir_d = game.direction == Direction.DOWN

    state = [
        # Danger straight ahead
        (dir_r and game.is_collision(point_r)) or
        (dir_l and game.is_collision(point_l)) or
        (dir_u and game.is_collision(point_u)) or
        (dir_d and game.is_collision(point_d)),

        # Danger to the right
        (dir_u and game.is_collision(point_r)) or
        (dir_d and game.is_collision(point_l)) or
        (dir_l and game.is_collision(point_u)) or
        (dir_r and game.is_collision(point_d)),

        # Danger to the left
        (dir_d and game.is_collision(point_r)) or
        (dir_u and game.is_collision(point_l)) or
        (dir_r and game.is_collision(point_u)) or
        (dir_l and game.is_collision(point_d)),

        # Current direction (4 features)
        dir_l, dir_r, dir_u, dir_d,

        # Food location relative to head (4 features)
        game.food.x < head.x,  # Food is left
        game.food.x > head.x,  # Food is right
        game.food.y < head.y,  # Food is up
        game.food.y > head.y   # Food is down
    ]

    return np.array(state, dtype=int)`,
          language: 'python',
          tip: 'The state representation is crucial. Too little information and the agent can\'t learn; too much and training becomes slow. These 11 features capture everything needed to play Snake optimally.'
        },
        {
          title: 'Building the Neural Network',
          description: 'We use a neural network to approximate the Q-function. The network takes the 11-feature state as input and outputs 3 Q-values (one for each action: straight, turn left, turn right).',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class Linear_QNet(nn.Module):
    """Deep Q-Network for Snake"""

    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        # Input: 11 state features
        # Hidden: 256 neurons (can experiment with this)
        # Output: 3 Q-values (straight, left, right)

        self.linear1 = nn.Linear(input_size, hidden_size)
        self.linear2 = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # ReLU activation for non-linearity
        x = F.relu(self.linear1(x))
        # No activation on output - raw Q-values
        x = self.linear2(x)
        return x

# Create network: 11 inputs -> 256 hidden -> 3 outputs
model = Linear_QNet(11, 256, 3)`,
          language: 'python'
        },
        {
          title: 'Epsilon-Greedy Exploration',
          description: 'The agent must balance exploration (trying new things) with exploitation (using what it knows). Epsilon-greedy starts with random actions and gradually shifts to using the learned policy.',
          code: `def get_action(self, state):
    """Choose action using epsilon-greedy strategy"""
    # Epsilon decreases as we play more games
    # Start at 80, decrease by 1 each game
    self.epsilon = 80 - self.n_games

    final_move = [0, 0, 0]  # [straight, right, left]

    # Random number 0-200
    if random.randint(0, 200) < self.epsilon:
        # EXPLORATION: random move
        move = random.randint(0, 2)
        final_move[move] = 1
    else:
        # EXPLOITATION: use neural network
        state_tensor = torch.tensor(state, dtype=torch.float)
        prediction = self.model(state_tensor)  # Get Q-values
        move = torch.argmax(prediction).item()  # Best action
        final_move[move] = 1

    return final_move

# Early training: mostly random (exploring)
# Game 1: epsilon=79, ~40% chance of random move
# Game 80: epsilon=0, always uses network`,
          language: 'python',
          tip: 'Without exploration, the agent might get stuck in a local optimum. Early random moves help discover strategies it wouldn\'t find otherwise.'
        },
        {
          title: 'Experience Replay',
          description: 'Instead of learning from experiences immediately and forgetting them, we store experiences in a replay buffer and sample random batches for training. This breaks correlations between consecutive samples and stabilizes learning.',
          code: `from collections import deque

MAX_MEMORY = 100_000  # Store last 100k experiences
BATCH_SIZE = 1000     # Train on 1000 random samples

class Agent:
    def __init__(self):
        # Replay buffer - automatically removes old entries
        self.memory = deque(maxlen=MAX_MEMORY)

    def remember(self, state, action, reward, next_state, done):
        """Store experience in replay buffer"""
        self.memory.append((state, action, reward, next_state, done))

    def train_long_memory(self):
        """Train on a batch from replay buffer"""
        if len(self.memory) > BATCH_SIZE:
            # Random sample breaks temporal correlations
            mini_batch = random.sample(self.memory, BATCH_SIZE)
        else:
            mini_batch = self.memory

        # Unzip the batch
        states, actions, rewards, next_states, dones = zip(*mini_batch)

        # Train the network
        self.trainer.train_step(states, actions, rewards, next_states, dones)`,
          language: 'python',
          tip: 'Experience replay is one of the key innovations that made Deep Q-Learning work. Without it, the network would overfit to recent experiences and forget earlier lessons.'
        },
        {
          title: 'The Training Step',
          description: 'This is where learning happens. We compute the target Q-values using the Bellman equation and update the network to minimize the difference between predicted and target Q-values.',
          code: `class QTrainer:
    def __init__(self, model, lr, gamma):
        self.model = model
        self.gamma = gamma  # Discount factor
        self.optimizer = optim.Adam(model.parameters(), lr=lr)
        self.criterion = nn.MSELoss()  # Mean squared error

    def train_step(self, state, action, reward, next_state, done):
        # Convert to tensors
        state = torch.tensor(state, dtype=torch.float)
        next_state = torch.tensor(next_state, dtype=torch.float)
        action = torch.tensor(action, dtype=torch.long)
        reward = torch.tensor(reward, dtype=torch.float)

        # Get current Q-value predictions
        pred = self.model(state)
        target = pred.clone()

        # Update Q-values using Bellman equation
        for idx in range(len(done)):
            Q_new = reward[idx]
            if not done[idx]:
                # Not terminal: Q = r + γ * max(Q(s'))
                Q_new = reward[idx] + self.gamma * torch.max(
                    self.model(next_state[idx])
                )
            # Update the Q-value for the action taken
            target[idx][torch.argmax(action[idx]).item()] = Q_new

        # Gradient descent
        self.optimizer.zero_grad()
        loss = self.criterion(target, pred)
        loss.backward()
        self.optimizer.step()`,
          language: 'python'
        },
        {
          title: 'The Training Loop',
          description: 'Putting it all together: the agent plays games, collects experiences, and learns from them. Each game trains on the current step (short memory) and a batch from the replay buffer (long memory).',
          code: `def train():
    agent = Agent()
    game = SnakeGameAI()
    record = 0

    while True:
        # Get current state
        state_old = agent.get_state(game)

        # Choose action (epsilon-greedy)
        action = agent.get_action(state_old)

        # Execute action, get reward
        reward, done, score = game.play_step(action)

        # Get new state
        state_new = agent.get_state(game)

        # Train on this single step (short-term memory)
        agent.train_short_memory(state_old, action, reward, state_new, done)

        # Store in replay buffer
        agent.remember(state_old, action, reward, state_new, done)

        if done:
            # Game over - reset and train on replay buffer
            game.reset()
            agent.n_games += 1
            agent.train_long_memory()  # Experience replay

            if score > record:
                record = score
                agent.model.save()

            print(f'Game {agent.n_games} Score: {score} Record: {record}')`,
          language: 'python',
          tip: 'The reward structure matters a lot. Typical: +10 for food, -10 for death, small negative for each step (encourages efficiency). Experiment with different values!'
        },
        {
          title: 'Visualizing Training Progress',
          description: 'Plotting scores over time helps diagnose training. A well-training agent shows increasing average scores with high variance initially (exploration) that decreases over time.',
          code: `import matplotlib.pyplot as plt
from IPython import display

def plot(scores, mean_scores):
    """Live-updating training plot"""
    display.clear_output(wait=True)
    display.display(plt.gcf())
    plt.clf()

    plt.title('Training Progress')
    plt.xlabel('Number of Games')
    plt.ylabel('Score')

    # Individual game scores (high variance)
    plt.plot(scores, label='Score', alpha=0.6)

    # Running average (should trend upward)
    plt.plot(mean_scores, label='Mean Score', linewidth=2)

    plt.ylim(ymin=0)
    plt.legend()
    plt.pause(0.1)

# Typical learning curve:
# Games 1-50: Random exploration, low scores
# Games 50-100: Learning basic survival
# Games 100-200: Improving food-finding
# Games 200+: Optimizing strategy`,
          language: 'python'
        }
      ],
      resources: [
        { label: 'Deep Q-Learning Paper (Mnih et al.)', url: 'https://arxiv.org/abs/1312.5602' },
        { label: 'PyTorch Documentation', url: 'https://pytorch.org/docs/stable/index.html' },
        { label: 'Bellman Equation Explained', url: 'https://en.wikipedia.org/wiki/Bellman_equation' },
        { label: 'Epsilon-Greedy Strategy', url: 'https://www.geeksforgeeks.org/epsilon-greedy-algorithm-in-reinforcement-learning/' }
      ]
    }
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
    tutorial: {
      difficulty: 'Beginner',
      duration: '20-30 min',
      prerequisites: ['Basic JavaScript', 'React useState/useEffect', 'Regular expressions basics'],
      steps: [
        {
          title: 'Setting Up the Password Input',
          description: 'Create a password input with toggle visibility. Use state to track the password value and whether it should be shown or hidden.',
          code: `const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

return (
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter password..."
    />
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
);`,
          language: 'tsx'
        },
        {
          title: 'Checking Password Requirements',
          description: 'Use regular expressions to check if the password meets various security criteria. Track each requirement separately for visual feedback.',
          code: `interface Checks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

function analyzePassword(pwd: string): Checks {
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>/?]/.test(pwd),
  };
}

// Update checks whenever password changes
useEffect(() => {
  setChecks(analyzePassword(password));
}, [password]);`,
          language: 'typescript',
          tip: 'Escape special characters in the regex, especially backslashes and brackets.'
        },
        {
          title: 'Calculating Password Score',
          description: 'Assign points for each requirement met and bonus points for extra length. Map the score to strength levels with corresponding colors.',
          code: `function calculateScore(pwd: string, checks: Checks): number {
  let score = 0;

  // Base points for each requirement
  if (checks.length) score += 20;
  if (checks.uppercase) score += 20;
  if (checks.lowercase) score += 20;
  if (checks.number) score += 20;
  if (checks.special) score += 20;

  // Bonus for extra length
  if (pwd.length >= 12) score += 10;
  if (pwd.length >= 16) score += 10;

  return Math.min(score, 100);
}

function getStrengthLevel(score: number) {
  if (score < 20) return { level: 'Weak', color: '#ff4444' };
  if (score < 40) return { level: 'Fair', color: '#ff9800' };
  if (score < 60) return { level: 'Good', color: '#ffd93d' };
  if (score < 80) return { level: 'Strong', color: '#8bc34a' };
  return { level: 'Excellent', color: '#4caf50' };
}`,
          language: 'typescript'
        },
        {
          title: 'Estimating Crack Time',
          description: 'Calculate how long it would take to brute-force the password based on character space and length. Use exponential math to compute possible combinations.',
          code: `function calculateCrackTime(pwd: string): string {
  if (!pwd) return '-';

  // Calculate character space
  let charSpace = 0;
  if (/[a-z]/.test(pwd)) charSpace += 26;
  if (/[A-Z]/.test(pwd)) charSpace += 26;
  if (/[0-9]/.test(pwd)) charSpace += 10;
  if (/[!@#$%^&*]/.test(pwd)) charSpace += 32;

  // Total combinations = charSpace ^ length
  const combinations = Math.pow(charSpace, pwd.length);

  // Assume 1 billion attempts per second
  const attemptsPerSecond = 1e9;

  // Average case: half the combinations
  const seconds = combinations / (2 * attemptsPerSecond);

  return formatTime(seconds);
}

function formatTime(seconds: number): string {
  if (seconds < 1) return 'Instant';
  if (seconds < 60) return Math.round(seconds) + ' seconds';
  if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
  if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
  if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
  return Math.round(seconds / 31536000) + ' years';
}`,
          language: 'typescript',
          tip: 'Real attackers use dictionary attacks first, so actual crack times for common passwords are much shorter than brute-force estimates.'
        },
        {
          title: 'Generating Secure Passwords',
          description: 'Create a function that generates cryptographically random passwords with guaranteed character variety.',
          code: `function generatePassword(length = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';

  // Guarantee at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle to avoid predictable positions
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}`,
          language: 'typescript'
        },
        {
          title: 'Building the Visual Strength Meter',
          description: 'Create an animated progress bar that fills based on password score, with color transitions matching strength level.',
          code: `function StrengthMeter({ score }: { score: number }) {
  const { level, color } = getStrengthLevel(score);

  return (
    <div className="strength-meter">
      <div className="flex justify-between mb-2">
        <span>Strength:</span>
        <span style={{ color }}>{level}</span>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: \`\${score}%\`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

// Requirements checklist
function RequirementsList({ checks }: { checks: Checks }) {
  const items = [
    { key: 'length', label: 'At least 8 characters', valid: checks.length },
    { key: 'uppercase', label: 'Uppercase letter', valid: checks.uppercase },
    { key: 'lowercase', label: 'Lowercase letter', valid: checks.lowercase },
    { key: 'number', label: 'Number', valid: checks.number },
    { key: 'special', label: 'Special character', valid: checks.special },
  ];

  return (
    <ul>
      {items.map(item => (
        <li
          key={item.key}
          className={item.valid ? 'text-green-400' : 'text-gray-500'}
        >
          {item.valid ? '✓' : '○'} {item.label}
        </li>
      ))}
    </ul>
  );
}`,
          language: 'tsx'
        }
      ],
      resources: [
        { label: 'Password Entropy', url: 'https://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength' },
        { label: 'OWASP Password Guidelines', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
        { label: 'Regex Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions' }
      ]
    }
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
    tutorial: {
      difficulty: 'Intermediate',
      duration: '40-50 min',
      prerequisites: ['JavaScript/TypeScript', 'Basic statistics concepts', 'Canvas API basics'],
      steps: [
        {
          title: 'Collecting Mouse Movement Data',
          description: 'Track mouse positions with timestamps. Store points in an array and limit the buffer size to prevent memory issues.',
          code: `interface Point {
  x: number;
  y: number;
  t: number; // timestamp
}

const pointsRef = useRef<Point[]>([]);

function handleMouseMove(e: MouseEvent) {
  const rect = container.getBoundingClientRect();
  const point: Point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    t: Date.now(),
  };

  pointsRef.current.push(point);

  // Keep only last 200 points
  if (pointsRef.current.length > 200) {
    pointsRef.current = pointsRef.current.slice(-200);
  }
}`,
          language: 'typescript',
          tip: 'Use refs instead of state for high-frequency updates like mouse tracking to avoid excessive re-renders.'
        },
        {
          title: 'Extracting Speed and Timing Features',
          description: 'Calculate speeds between consecutive points. Humans have varied speeds, bots move at constant velocity.',
          code: `function extractSpeedFeatures(points: Point[]) {
  const speeds: number[] = [];
  const timings: number[] = [];

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const dt = points[i].t - points[i - 1].t;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dt > 0) {
      speeds.push(dist / dt);  // pixels per ms
      timings.push(dt);
    }
  }

  // Calculate coefficient of variation (std/mean)
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const speedStd = Math.sqrt(
    speeds.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / speeds.length
  );

  // Higher CV = more human-like variance
  const speedConsistency = avgSpeed > 0 ? speedStd / avgSpeed : 0;

  return { speedConsistency, speeds, timings };
}`,
          language: 'typescript'
        },
        {
          title: 'Detecting Angular Variance (Wobble)',
          description: 'Humans naturally wobble slightly as they move. Calculate direction changes between segments to detect this.',
          code: `function extractAngularVariance(points: Point[]): number {
  const angles: number[] = [];

  // Calculate angle of each movement segment
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0.5) { // Ignore tiny movements
      angles.push(Math.atan2(dy, dx));
    }
  }

  // Calculate angle differences between consecutive segments
  const angularDiffs: number[] = [];
  for (let i = 1; i < angles.length; i++) {
    let diff = Math.abs(angles[i] - angles[i - 1]);
    // Handle wraparound at PI/-PI
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    angularDiffs.push(diff);
  }

  // Filter out large turns (intentional direction changes)
  const smallWobbles = angularDiffs.filter(d => d < Math.PI / 4);

  // Average wobble - humans have ~0.05 rad (~3 degrees)
  const avgWobble = smallWobbles.length > 0
    ? smallWobbles.reduce((a, b) => a + b, 0) / smallWobbles.length
    : 0;

  return Math.min(avgWobble / 0.05, 1); // Normalize to 0-1
}`,
          language: 'typescript',
          tip: 'The atan2 function returns angles in radians. Remember to handle the wraparound when angles cross from PI to -PI.'
        },
        {
          title: 'Measuring Path Curvature',
          description: 'Bots move in straight lines; humans naturally curve. Measure deviation from straight-line segments using perpendicular distance.',
          code: `function extractCurveScore(points: Point[]): number {
  let totalDeviation = 0;
  const windowSize = 8;
  let windowCount = 0;

  // Slide a window across the path
  for (let i = 0; i < points.length - windowSize; i += windowSize / 2) {
    const start = points[i];
    const end = points[i + windowSize - 1];

    // Line vector from start to end
    const lineDx = end.x - start.x;
    const lineDy = end.y - start.y;
    const lineLen = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

    if (lineLen > 5) {
      // Measure perpendicular distance of middle points from line
      for (let j = i + 1; j < i + windowSize - 1; j++) {
        const px = points[j].x - start.x;
        const py = points[j].y - start.y;

        // Cross product gives perpendicular distance
        const perpDist = Math.abs(px * lineDy - py * lineDx) / lineLen;
        totalDeviation += perpDist;
      }
      windowCount++;
    }
  }

  const avgDeviation = windowCount > 0
    ? totalDeviation / (windowCount * (windowSize - 2))
    : 0;

  // Normalize: ~2px average deviation is human-like
  return Math.min(avgDeviation / 2, 1);
}`,
          language: 'typescript'
        },
        {
          title: 'Detecting Micro-Corrections',
          description: 'Humans make tiny back-and-forth adjustments. Detect small direction reversals in X or Y axes.',
          code: `function extractMicroCorrections(points: Point[]): number {
  let corrections = 0;

  for (let i = 2; i < points.length; i++) {
    // Direction in previous step
    const dx1 = points[i - 1].x - points[i - 2].x;
    const dy1 = points[i - 1].y - points[i - 2].y;

    // Direction in current step
    const dx2 = points[i].x - points[i - 1].x;
    const dy2 = points[i].y - points[i - 1].y;

    // Check for small reversals (sign change with small magnitude)
    const xReversal = dx1 * dx2 < 0 &&
      Math.abs(dx1) < 10 && Math.abs(dx2) < 10;
    const yReversal = dy1 * dy2 < 0 &&
      Math.abs(dy1) < 10 && Math.abs(dy2) < 10;

    if (xReversal || yReversal) {
      corrections++;
    }
  }

  // Normalize: ~5% correction rate is human-like
  const correctionRate = corrections / points.length;
  return Math.min(correctionRate / 0.05, 1);
}`,
          language: 'typescript'
        },
        {
          title: 'Building the Classifier',
          description: 'Combine all features with weights to produce a human-likeness score. Higher scores indicate human behavior.',
          code: `interface Features {
  speedConsistency: number;
  angularVariance: number;
  microCorrections: number;
  curveScore: number;
  accelerationNoise: number;
  timingVariance: number;
}

class BehavioralClassifier {
  classify(features: Features): number {
    // Weights based on feature importance
    const weights = {
      speedConsistency: 0.20,
      angularVariance: 0.20,
      microCorrections: 0.15,
      curveScore: 0.20,
      accelerationNoise: 0.15,
      timingVariance: 0.10,
    };

    // Weighted sum of all features
    let score =
      features.speedConsistency * weights.speedConsistency +
      features.angularVariance * weights.angularVariance +
      features.microCorrections * weights.microCorrections +
      features.curveScore * weights.curveScore +
      features.accelerationNoise * weights.accelerationNoise +
      features.timingVariance * weights.timingVariance;

    // Scale to 0.2-0.92 range (never 0% or 100%)
    return 0.20 + score * 0.72;
  }
}

// Determine verdict based on score
function getVerdict(score: number) {
  if (score > 0.6) return 'human';
  if (score < 0.4) return 'bot';
  return 'uncertain';
}`,
          language: 'typescript',
          tip: 'The weights can be tuned based on real-world data. In production, you might train these weights using labeled examples of human vs bot movements.'
        },
        {
          title: 'Visualizing the Mouse Trail',
          description: 'Draw the movement path on canvas with color indicating the current verdict. Fade old points over time.',
          code: `function drawMouseTrail(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  verdict: 'human' | 'bot' | 'uncertain'
) {
  const now = Date.now();

  for (let i = 1; i < points.length; i++) {
    // Fade based on age (3 second lifespan)
    const age = now - points[i].t;
    const alpha = Math.max(0, 1 - age / 3000);
    if (alpha <= 0) continue;

    // Color based on verdict
    let color: string;
    if (verdict === 'human') {
      color = \`rgba(34, 197, 94, \${alpha * 0.8})\`; // Green
    } else if (verdict === 'bot') {
      color = \`rgba(239, 68, 68, \${alpha * 0.8})\`; // Red
    } else {
      color = \`rgba(245, 158, 11, \${alpha * 0.8})\`; // Yellow
    }

    // Draw line segment
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }
}`,
          language: 'typescript'
        }
      ],
      resources: [
        { label: 'Behavioral Biometrics', url: 'https://en.wikipedia.org/wiki/Behavioral_biometrics' },
        { label: 'Canvas API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API' },
        { label: 'Standard Deviation', url: 'https://en.wikipedia.org/wiki/Standard_deviation' }
      ]
    }
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
