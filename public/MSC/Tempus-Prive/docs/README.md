   ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - README.md                          ###
   ###   Last Updated: 04-07-2025                          ###
   ###########################################################

# Tempus-Prive
Web Technologies - Assignment (HTML, JS, CSS)

# Tempus-Privé - Luxury Watch Catalogue

## Project Overview

Tempus-Privé is an ultra-luxury watch e-commerce platform that embodies the philosophy "Time Reserved for the Few." This responsive product catalogue showcases exceptional timepieces from the world's most prestigious watchmakers including Rolex, Patek Philippe, and Audemars Piguet. The platform delivers an immersive shopping experience tailored for high-net-worth collectors and investors, featuring sophisticated filtering, seamless navigation, and an administrative interface for inventory management.

### Brand Vision
The website reflects refinement and exclusivity through carefully curated design elements, from the Crown Navy and Imperial Gold colour palette to the elegant typography system. Every interaction is crafted to mirror the precision and luxury of the timepieces it presents.

## Technologies Used

- **HTML5** - Semantic markup with proper document structure
- **CSS3** - Custom properties, Flexbox, and Grid layouts
- **JavaScript (ES6 Modules)** - Modern JavaScript with modular architecture
- **JSON** - Product data management and storage
- **CSS Media Queries** - Mobile-first responsive design
- **Local Storage API** - Wishlist and user preference persistence
- **Web APIs** - Intersection Observer for lazy loading
- **Visual Studio Code** - Development environment
- **Live Server Extension** - Local development server


tempus-prive/
│
├── index.html              # Main SPA entry point
├── README.md               # Project documentation
│
├── css/
│   ├── styles.css          # Main stylesheet with custom properties
│   ├── responsive.css      # Media queries and breakpoints
│   ├── services.css        # Service pages styling
│   └── admin.css           # Admin dashboard styles
│
├── js/
│   ├── main.js             # Core Initialisation and routing
│   ├── products.js         # Product display and filtering
│   ├── wishlist.js         # Wishlist functionality
│   ├── admin.js            # Admin CRUD operations
│   ├── validation.js       # Form validation utilities
│   ├── currency.js         # Currency conversion
│   └── utils.js            # Helper functions
│
├── data/
│   └── products.json       # Luxury watch inventory data
│
└── assets/
    ├── images/             
    │   └── watches/        # Product images
    └── icons/              # UI icons (wishlist, menu, etc.)


## Setup Instructions

### Prerequisites
- Visual Studio Code (latest version)
- Live Server extension for VS Code
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation Steps

1. **Clone or Download the Project**
   bash
   git clone https://github.com/W17ant/Tempus-Prive
   # OR download and extract the ZIP file
   

2. **Open in Visual Studio Code**
   - Launch Visual Studio Code
   - Select `File > Open Folder`
   - Navigate to the `tempus-prive` folder and open it

3. **Install Live Server Extension** (if not installed)
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
   - Search for "Live Server" by Ritwick Dey
   - Click Install and reload VS Code if prompted

4. **Run the Project**
   - Right-click on `index.html` in the Explorer panel
   - Select "Open with Live Server"
   - The website will launch at `http://127.0.0.1:5500`

## Features

### Core Features

#### 1. Luxury Product Display
- Premium watch showcase with:
  - High-resolution product images with lazy loading
  - Watch manufacturer and model details
  - Price display with GBP/USD/EUR/AED currency formatting
  - Availability status with elegant indicators
  - Detailed specifications and complications
- Auto-fit responsive grid layout (4 columns desktop → 1 column mobile)

#### 2. Brand & Category Filtering
- Filter by prestigious watch manufacturers:
  - Rolex
  - Patek Philippe
  - Audemars Piguet
  - Vacheron Constantin
  - A. Lange & Söhne
  - Richard Mille
  - Hublot
  - Omega
  - Cartier
  - Longines
- Category classifications:
  - Sport Watches
  - Dress Watches
  - Complications
  - Limited Editions
- Real-time filtering with smooth transitions

#### 3. Advanced Sorting
- Sort options:
  - Price (Low to High / High to Low)
  - Brand (A-Z / Z-A)
  - Newest Arrivals
  - Most Exclusive
- Maintains filter state during sorting operations

#### 4. Responsive Design Excellence
- Mobile-first approach with luxury preserved at all sizes
- Breakpoints:
  - Mobile: 320px - 479px
  - Mobile Plus: 480px - 767px
  - Tablet: 768px - 991px
  - Desktop: 992px - 1439px
  - Large Desktop: 1440px+
- Touch-optimised with 48×48px minimum tap targets
- Slide-in navigation drawer for mobile

#### 5. Form Validation & Authentication
- Admin access via concierge modal:
  - Password-based authentication (code: "Watch1")
  - Simple password field validation
  - Shake animation on incorrect entry
- Product management form validation:
  - Required field validation (product name, brand)
  - Price format validation (numeric with decimals)
  - Category selection validation (at least one required)
  - Image URL validation (checks for valid image extensions)
  - Product name minimum length (2 characters)

#### 6. JavaScript Event Handling
- Smooth scroll navigation with `prefers-reduced-motion` respect
- Modal interactions for product details
- Wishlist toggle with visual feedback
- Hamburger menu animation
- Filter and sort change handlers
- Form submission with preventDefault

#### 7. Admin Dashboard (/admin)
- Secure access portal
- Complete CRUD operations:
  - **Create**: Add new luxury timepieces with comprehensive validation
  - **Read**: View inventory in elegant table format
  - **Update**: Edit watch details, pricing, and availability
  - **Delete**: Remove products with confirmation modal
- Statistics overview (total inventory value, brands represented)
- All changes persist via Local Storage

### Advanced Features

#### 1. Wishlist System
- Add/remove watches with heart icon animation
- Persistent storage across sessions
- Wishlist counter in navigation
- Dedicated wishlist view page

#### 2. Real-time Search
- Search across:
  - Watch brands and models
  - Reference numbers
  - Complications
- Debounced input (300ms) for performance
- Highlighted search results
- "No results" state with suggestions

#### 3. Currency Converter
- Real-time conversion between:
  - GBP (British Pounds)
  - USD (US Dollars)
  - EUR (Euros)
  - AED (UAE Dirhams)
- Formatted with proper symbols and separators
- Remembers user preference

#### 4. Performance optimisations
- Image lazy loading with Intersection Observer
- Smooth animations with CSS transforms
- Skeleton loading states
- TTI (Time to Interactive) target: ≤ 4 seconds on mid-range devices

## Code Quality & Structure

### Folder Structure
See `tempus-prive_structure.txt` for complete file organization.

tempus-prive/
│
├── index.html              # Main SPA entry point
├── README.md               # Project documentation
│
├── css/
│   ├── styles.css          # Main stylesheet with custom properties
│   ├── responsive.css      # Media queries and breakpoints
│   ├── services.css        # Service pages styling
│   └── admin.css           # Admin dashboard styles
│
├── js/
│   ├── main.js             # Core Initialisation and routing
│   ├── products.js         # Product display and filtering
│   ├── wishlist.js         # Wishlist functionality
│   ├── admin.js            # Admin CRUD operations
│   ├── validation.js       # Form validation utilities
│   ├── currency.js         # Currency conversion
│   └── utils.js            # Helper functions
│
├── data/
│   └── watches.json        # Luxury watch inventory data
│
└── assets/
    ├── images/             
    │   └── watches/        # Product images
    └── icons/              # UI icons (wishlist, menu, etc.)


### Code Conventions

#### CSS Architecture

/* ###########################################################
   ###   SECTION_NUMBER. FEATURE_NAME                      ###
   ########################################################### */

/* ===== Feature Subsection ===== */


- CSS Custom Properties (from actual implementation):
  - `--crown-navy: #0C1B2A`
  - `--imperial-gold: #9b7d4a`
  - `--ivory-paper: #F5F5F5`
  - `--charcoal-black: #121212`
  - `--platinum-silver: #9CA3AF`
  - `--claret-red: #7F1124`

#### JavaScript Patterns
- ES6 modules with clear imports/exports
- Event delegation for dynamic content
- Async/await for data operations
- Try-catch error handling throughout

#### HTML Standards
- Semantic elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- ARIA labels for screen readers
- Proper heading hierarchy
- Alt text for all product images

## Typography System
- **Primary Font**: Arial, sans-serif
- **Secondary Font**: Georgia, serif
- **Font Sizes**: Using CSS custom properties with responsive scaling
- **Line Height**: 1.6 for optimal readability
- **Letter Spacing**: Refined for luxury aesthetic

## Challenges Faced & Solutions

### Challenge 1: Luxury Brand Consistency
**Problem**: Maintaining the premium aesthetic across all device sizes while ensuring functionality.
**Solution**: Implemented a sophisticated spacing system using CSS custom properties and clamp() functions, ensuring proportional scaling that preserves the luxury feel from 320px to 4K displays.

### Challenge 2: Performance optimisation
**Problem**: Initial Lighthouse performance scores were below target due to large image files and unoptimised assets.
**Solution**: Converted all product images from PNG to WebP format for 70%+ size reduction. Utilized the Minify VS Code extension to compress CSS and JavaScript files, reducing bundle sizes by approximately 50%. Implemented lazy loading for images to improve initial page load times.

### Challenge 3: Complex Product Filtering
**Problem**: Multiple filter combinations (brand + category + price range) created complex state management.
**Solution**: Developed a modular filtering system using JavaScript Sets and array methods, allowing multiple active filters with O(n) performance.

## Future Improvements

### Phase 1: Backend Integration (Final Assessment)
- Node.js + Express.js RESTful API
- MongoDB database with Mongoose ODM
- JWT authentication for admin access
- Real-time inventory updates

### Phase 2: Enhanced User Experience
- Appointment booking for private viewings - placeholder/demo
- Live chat with horological experts - placeholder/demo
- Optimise accessibiility and performance Lighthouse scores

### Phase 3: Performance & SEO
- Server-side rendering with Next.js
- Progressive Web App capabilities
- Advanced caching strategies
- Structured data for rich snippets

## Performance Metrics

### Current Status
- **Lighthouse Scores**:
Desktop
  - Performance: 97 
  - Accessibility: 89 (requires optimisation)
  - Best Practices: 93
  - SEO: 100
Mobile
  - Performance: 76 (requires optimisation)
  - Accessibility: 93
  - Best Practices: 93
  - SEO: 100

### Identified Issues
- Critical request chains affecting TTI
- Render-blocking resources
- Opportunities for CSS minification (Est savings: 66 KiB)
- JavaScript optimisation needed (Est savings: 56 KiB)

## Performance Metrics

## How the Project Meets the Assessment Criteria

### UI Design & Responsiveness (30%)
- **Exceptional Visual Design**: Implements luxury brand guidelines with Crown Navy (#0C1B2A) and Imperial Gold (#9b7d4a) palette
- **Fully Responsive**: Tested across all required breakpoints (320px → 1440px+) with no horizontal scroll
- **Consistent Layout**: Grid system maintains visual hierarchy across all sections
- **Premium Interactions**: Smooth animations, hover effects, and micro-interactions enhance the luxury experience
- **Accessibility**: Working towards WCAG 2.1 AA compliance with proper contrast ratios and keyboard navigation

### Code Implementation & Quality (50%)
- **ES6 JavaScript Excellence**: Modular architecture with clear separation of concerns
- **Comprehensive Validation**: Multi-layered form validation with regex patterns and custom error messages
- **Efficient Code Structure**: DRY principles, reusable components, and optimised algorithms
- **Professional Comments**: Following the established comment banner pattern throughout
- **Accessibility optimised**: Lighthouse scores: Performance 66 (requires improvement), Accessibility 93+ on mobile, Best Practices 90+

### Demo Video Content (10%)
The demo video comprehensively covers:
- Live demonstration of all features on multiple devices
- Code architecture walkthrough
- Technical challenges and innovative solutions
- Performance metrics demonstration
- Future development roadmap aligned with final assessment

### Advanced Features (10%)
- **Wishlist System**: Full CRUD with Local Storage persistence and visual feedback
- **Currency Converter**: Real-time conversion with proper formatting
- **Advanced Search**: Debounced search with highlighting and filters
- **Skeleton Loading**: Enhanced perceived performance
- **Admin Dashboard**: Complete inventory management without backend

## Student Information

**Student Number**: [2418521]

**Module**: CSO7005 - Web Technologies

**Assessment**: Mid-Module Assessment

**Submission Deadline**: July 18, 2025

---

### References

Web development techniques and best practices:
- McFedries, P. (2023). *HTML, CSS, & JavaScript All-in-One For Dummies*. John Wiley & Sons.
- LaGrone, B. (2013). *HTML5 and CSS3 Responsive Web Design Cookbook* Packt Publishing.
- Flanagan, D. (2011). *JavaScriptS: The Definitive Guide* (6th ed.). O'Reilly Media.
- Duckett, J. (2014). *JavaScript and JQuery: Interactive Front-End Web Development*. John Wiley & Sons.
- Stoyan, S. (2011). *JavaScript Patterns. O'Reilly Media.
- Meyer, E. A. & Weil, E. (2023). *CSS: The Definitive Guide* (5th ed.). O'Reilly Media.

*Note: All watch images are generated and used under educational fair use. Brand names and logos are trademarks of their respective owners.*
