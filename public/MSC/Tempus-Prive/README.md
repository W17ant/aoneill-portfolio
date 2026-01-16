   ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ                                      ###
   ###   Last Updated: 04-07-2025                          ###
   ########################################################### 

# Tempus-Prive
Web Technologies - Assignment (HTML, JS, CSS)

# Tempus-Privé - Luxury Watch Catalogue

## Project Overview

Tempus-Privé is an ultra-luxury watch e-commerce platform that embodies the philosophy "Time Reserved for the Few." This responsive product catalogue showcases exceptional timepieces from the world's most prestigious watchmakers including Rolex, Patek Philippe, and Audemars Piguet. The platform delivers an immersive shopping experience tailored for high-net-worth collectors and investors, featuring sophisticated filtering, seamless navigation, and an administrative interface for inventory management.

### Brand Vision
The website reflects refinement and exclusivity through carefully curated design elements, from the Crown Navy and Imperial Gold color palette to the elegant typography system. Every interaction is crafted to mirror the precision and luxury of the timepieces it presents.

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
  - Detailed specifications and complications
- Auto-fit responsive grid layout (4 columns desktop → 1 column mobile)

#### 2. Brand & Category Filtering
- Filter by prestigious watch manufacturers:
  - Audemars Piguet
  - Cartier
  - Hublot
  - Longines
  - Omega
  - Patek Philippe
  - Richard Mille
  - Rolex
- Category classifications:
  - Sport Watches
  - Dress Watches
  - Limited Editions / Investment Pieces
  - Real-time filtering with smooth transitions

#### 3. Advanced Sorting
- Sort options:
  - Price (Low to High (Entry Level) / High to Low (Highest Value))
  - Brand by Maison (A-Z)
  - Newest Arrivals
- Maintains filter state during sorting operations

#### 4. Responsive Design Excellence
- Mobile-first approach with luxury preserved at all sizes
- Breakpoints:
  - Mobile: 320px - 479px
  - Mobile Plus: 480px - 767px
  - Tablet: 768px - 991px
  - Desktop: 992px - 1439px
  - Large Desktop: 1440px+
- Touch-optimized with 48×48px minimum tap targets
- Slide-in navigation drawer for mobile

#### 5. Form Validation & Authentication
- Contact form with validation:
  - Required field validation
  - Email format validation
- Admin login with secure validation:
  - Password required
- Product management form validation:
  - Price format (numeric with decimals)
  - Image URL validation
  - Character limits (watch descriptions)
  - Reference number format checking

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

#### 1. Wishlist/Private Collection System
- Add/remove watches with heart icon animation
- Persistent storage across sessions
- Wishlist counter in navigation
- Dedicated wishlist view page

#### 2. Real-time Search
- Search across:
  - Watch brands and models
  - Reference numbers
  - Materials
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
- using https://openexchangerates.org/ API
- Fall back if API fails to load using estimated exchange rate
- Formatted with proper symbols and separators
- Remembers user preference

#### 4. Performance Optimizations
- Image lazy loading with Intersection Observer
- Smooth animations with CSS transforms
- Skeleton loading states
- TTI (Time to Interactive) ≤ 4 seconds on mid-range devices

## Code Quality & Structure

### Folder Structure
tempus-prive/
│
├── index.html                    # Main SPA entry point with luxury watch showcase
├── admin.html                    # Secure admin dashboard for inventory management
├── README.md                     # Project documentation and setup instructions
│
├── css/                          # Modular stylesheet architecture
│   ├── styles.css                # Core design system with CSS custom properties
│   ├── admin.css                 # Admin dashboard specific styling
│   ├── admin-search.css          # Advanced search interface for admin panel
│   ├── collection-styles.css     # Watch collection grid and card layouts
│   ├── currency-switcher.css     # Multi-currency display components
│   ├── filter-counts.css         # Dynamic filter badge styling
│   ├── footer.css                # Footer section with brand elements
│   ├── loading-states.css        # Skeleton screens and loading animations
│   ├── maison-styles.css         # Brand-specific showcase pages
│   ├── mobile-overrides.css      # Mobile-first responsive adjustments
│   ├── private-collection.css    # Exclusive collection section styling
│   ├── search-modal.css          # Search overlay and results styling
│   └── services.css              # Bespoke service pages styling
│
├── js/                           # ES6 module-based JavaScript architecture
│   ├── main.js                   # Core SPA routing and initialization
│   ├── products.js               # Product catalog display and management
│   ├── admin.js                  # Admin CRUD operations and dashboard logic
│   ├── admin-search.js           # Advanced search functionality for admin
│   ├── animations.js             # Smooth transitions and micro-interactions
│   ├── currency-service.js       # Real-time currency conversion engine
│   ├── filter-counts.js          # Dynamic filter count calculations
│   ├── footer.js                 # Footer interactions and newsletter signup
│   ├── loading-states.js         # Progressive loading implementations
│   ├── luxury-sections.js        # Premium content section handlers
│   ├── private-collection.js     # Exclusive collection functionality
│   ├── search.js                 # Global search with debouncing
│   └── services.js               # Service page navigation and content
│
├── data/                         
│   └── products.json             # Curated luxury watch inventory database
│
├── docs/                         # Technical documentation
│   ├── backend_file_plan.json    # Backend architecture planning
│   └── tempus-prive_structure.txt # File structure documentation
│
└── images/                       # Visual assets
    ├── assets/                   # Brand and UI assets
    │   ├── placeholder-watch.png # Loading state placeholder
    │   ├── tp-logo.png           # Tempus-Privé primary logo
    │   ├── tp-monogram.png       # Brand monogram mark
    │   └── tp-monogram-background.png # Decorative background pattern
    │
    ├── brands/                   # Luxury brand logos
    │   ├── audemars-piguet-logo.png
    │   ├── cartier-logo.png
    │   ├── hublot-logo.png
    │   ├── longines-logo.png
    │   ├── omega-logo.png
    │   ├── patek-philippe-logo.png
    │   ├── richard-mille-logo.png
    │   └── rolex-logo.png
    │
    └── products/                 # High-resolution watch photography
        ├── audemars-piguet/      # Royal Oak, Offshore collections
        ├── cartier/              # Santos, Tank collections
        ├── hublot/               # Big Bang, Classic Fusion
        ├── longines/             # Heritage pocket watches
        ├── omega/                # Speedmaster, Chronometre pieces
        ├── patek-philippe/       # Nautilus, Calatrava models
        ├── richard-mille/        # RM series ultra-luxury pieces
        └── rolex/                # Daytona, Submariner icons

### Code Conventions

#### CSS Architecture
css
/* ###########################################################
   ###   SECTION_NUMBER. FEATURE_NAME                      ###
   ########################################################### */

/* ===== Feature Subsection ===== */


- CSS Custom Properties:
  - `--crown-navy: #0C1B2A`
  - `--imperial-gold: #D4AF37`
  - `--ivory-paper: #F8F6F1`
  - `--platinum-silver: #E5E4E2`
  - `--claret-red: #7C0A02`

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

## Challenges Faced & Solutions

### Challenge 1: Luxury Brand Consistency
**Problem**: Maintaining the premium aesthetic across all device sizes while ensuring functionality.
**Solution**: Implemented a sophisticated spacing system using CSS custom properties and clamp() functions, ensuring proportional scaling that preserves the luxury feel from 320px to 4K displays.

### Challenge 2: Mobile Navigation UX
**Problem**: Creating a premium mobile experience without cluttering the header.
**Solution**: Implemented a clean dropdown menu with backdrop blur effect (backdrop-filter: blur(20px)), maintaining the luxury aesthetic while providing easy access to navigation items with proper touch targets (44px minimum).

### Challenge 3: Image Loading Performance
**Problem**: Ensuring smooth image loading for product galleries without sacrificing quality.
**Solution**: Implemented lazy loading with Intersection Observer and progressive blur-up loading animations (filter: blur(20px) to blur(0)), creating smooth transitions that enhance perceived performance.

### Challenge 4: Multi-faceted Product Discovery
**Problem**: Allowing users to browse products by different criteria without overwhelming the interface.
**Solution**: Developed a filtering system supporting category filters (sport, dress, luxury, investment, heritage) and brand filters (8 luxury brands) with sorting options (featured, price ascending/descending, newest, brand), using efficient array methods for real-time updates with O(n) performance.

## Future Improvements

### Phase 1: Backend Integration (Final Assessment)
- Node.js + Express.js RESTful API
- MongoDB database with Mongoose ODM
- JWT authentication for admin access
- Real-time inventory updates

### Phase 2: Enhanced User Experience
- Multiple image gallery for watches
- Appointment booking for private viewings
- Live chat with horological experts

### Phase 3: Advanced Features
- Price history and investment insights
- Multi-language support (EN, FR, DE, JP, AR)

### Phase 4: Performance & SEO
- Server-side rendering with Next.js
- Progressive Web App capabilities
- Advanced caching strategies
- Structured data for rich snippets

## How the Project Meets the Assessment Criteria

### UI Design & Responsiveness (30%)
- **Exceptional Visual Design**: Implements luxury brand guidelines with Crown Navy (#0C1B2A) and Imperial Gold (#D4AF37) palette
- **Responsive Layout**: Mobile-first design with breakpoints at 480px, 768px, and 1440px
- **Consistent Grid System**: Auto-fit responsive grid maintaining visual hierarchy across all sections
- **Premium Interactions**: Smooth transitions, hover effects, and micro-interactions throughout
- **Accessibility Features**: Keyboard navigation, focus states, and reduced motion support implemented

### Code Implementation & Quality (50%)
- **Modern JavaScript**: ES6 features with modular architecture and clear separation of concerns
- **Comprehensive Validation**: Email regex validation, required fields, and category selection checks
- **Efficient Code Structure**: DRY principles, reusable functions, and organized file structure
- **Professional Comments**: Consistent banner pattern with section numbers and clear documentation
- **Performance Features**: Lazy loading, debounced search, and optimized DOM manipulation


### Demo Video Content (10%)
The demo video comprehensively covers:
- Live demonstration of all features on multiple devices
- Code architecture walkthrough
- Technical challenges and innovative solutions
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

**Submission Date**: July 18, 2025

---

### References

Design patterns and luxury e-commerce best practices adapted from:
- Krug, S. (2014). *Don't Make Me Think, Revisited*. New Riders.
- Nielsen, J. (2020). *Luxury Usability: Pleasant Surprises and Memorability*. Nielsen Norman Group.

Web development techniques and best practices:
- Duckett, J. (2014). *HTML and CSS: Design and Build Websites*. John Wiley & Sons.
- Duckett, J. (2014). *JavaScript and JQuery: Interactive Front-End Web Development*. John Wiley & Sons.
- Keith, J. & Andrew, R. (2016). *HTML5 for Web Designers* (2nd ed.). A Book Apart.
- Cederholm, D. (2016). *CSS3 for Web Designers* (2nd ed.). A Book Apart.
- Simpson, K. (2015). *You Don't Know JS* (Book Series). O'Reilly Media.
- Flanagan, D. (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media.
- Meyer, E. A. & Weil, E. (2023). *CSS: The Definitive Guide* (5th ed.). O'Reilly Media.

*Note: All watch images are used under educational fair use. Brand names and logos are trademarks of their respective owners.*
