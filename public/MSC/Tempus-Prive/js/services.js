/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - SERVICE PAGES MODULE               ###
   ###   Last Updated: 04-07-2025                          ###
   ########################################################### */

/*
===============================================
Handles SPA navigation, deep linking, and animations
for luxury service detail pages
Manages state transitions and URL history
Implements smooth scrolling and accessibility features
===============================================
*/

/* ###########################################################
   ###   1. Module Pattern Setup & Constants               ###
   ########################################################### */

   const ServicesModule = (function() {
    'use strict';

    /* ====== Section Titles Configuration ====== */
    // Maps section IDs to display titles for navigation
    const SECTION_TITLES = {
        'services': 'Services Overview',
        'authentication': 'Authentication Services',
        'delivery': 'Global Delivery',
        'insurance': 'Insurance & Protection',
        'servicing': 'Expert Servicing'
    };

    /* ====== Animation Constants ====== */
    const ANIMATION_DURATION = 300; // ms - matches CSS transition duration
    const SCROLL_OFFSET = 80; // px - compensates for fixed header height

    /* ###########################################################
       ###   2. State Management Variables                     ###
       ########################################################### */

    /* ====== Module State Tracking ====== */
    let currentSection = 'services'; // Track active section for navigation
    let isTransitioning = false;     // Prevent overlapping transitions

    /* ###########################################################
       ###   3. Core Navigation Function                       ###
       ########################################################### */

    /**
 * Shows specified section with smooth transitions.
 * Handles URL updates, accessibility attributes, and scroll behavior.
 * @param {string} sectionId - ID of section to show
 */
    function showSection(sectionId) {
        console.log(`🧭 SPA Navigation: ${sectionId} | No page reload`);
    
    if (sectionId !== 'services' && SECTION_TITLES[sectionId]) {
        console.log(`📄 Service Detail Page Loaded: ${SECTION_TITLES[sectionId]}`);
    }
        // Only handle service-related sections
        const servicePages = ['services', 'authentication', 'delivery', 'insurance', 'servicing'];
        
        if (!servicePages.includes(sectionId)) {
            // For non-service sections, delegate to main navigation
            const navLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (navLink) {
                navLink.click();
            }
            return;
        }
    
        // Prevent multiple simultaneous transitions
        if (isTransitioning) return;
        
        // Validate section exists before proceeding
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.warn(`Section "${sectionId}" not found`);
            return;
        }
    
        // Set transition state
        isTransitioning = true;
    
        // HIDE ALL SECTIONS (not just service ones) for standalone appearance
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
            section.setAttribute('aria-hidden', 'true');
        });
    
        // Show ONLY the target section
        targetSection.style.display = 'block';
        targetSection.setAttribute('aria-hidden', 'false');
    
        // Update URL based on section type
        if (sectionId === 'services') {
            history.pushState({ section: 'services' }, '', '#services');
            
            // When returning to services overview, show all non-service sections again
            document.querySelectorAll('.section:not(.service-page):not(#services)').forEach(section => {
                section.style.display = 'block';
                section.setAttribute('aria-hidden', 'false');
            });
        } else {
            history.pushState({ section: sectionId }, '', `#service=${sectionId}`);
        }
    
        // Scroll behavior based on what we're showing
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (sectionId === 'services') {
            // When returning to services overview, scroll to the services section
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: prefersReducedMotion ? 'instant' : 'smooth',
                    block: 'start'
                });
            }, 50); // Small delay to ensure sections are visible first
        } else {
            // For service detail pages, scroll to top since they're standalone
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'instant' : 'smooth'
            });
        }
    
        // Update document title
        document.title = `Tempus Privé | ${SECTION_TITLES[sectionId] || 'Services'}`;
    
        // Ensure services nav link stays active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const servicesNavLink = document.querySelector('[data-section="services"]');
        if (servicesNavLink) {
            servicesNavLink.classList.add('active');
        }
    
        // Update internal state
        currentSection = sectionId;
    
        // Focus management for accessibility
        const heading = targetSection.querySelector('h1');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    
        // Reset transition state after animation
        setTimeout(() => {
            isTransitioning = false;
            
            // Announce page change to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Now viewing ${SECTION_TITLES[sectionId] || 'service page'}`;
            document.body.appendChild(announcement);
            
            // Remove announcement after screen reader processes it
            setTimeout(() => announcement.remove(), 1000);
        }, ANIMATION_DURATION);
    }

    /* ###########################################################
       ###   4. Browser History Management                     ###
       ########################################################### */

    /**
     * Handles browser back/forward button navigation.
     * Restores previous section state from history.
     * @param {PopStateEvent} event - Browser history event
     */
    function handlePopState(event) {
        const hash = window.location.hash;
        
        // Handle service detail pages
        if (hash.startsWith('#service=')) {
            const sectionId = hash.split('=')[1];
            if (SECTION_TITLES[sectionId]) {
                showSection(sectionId);
            }
        } 
        // Handle services overview
        else if (hash === '#services') {
            showSection('services');
        }
        // Handle state from event
        else if (event.state && event.state.section) {
            const servicePages = ['services', 'authentication', 'delivery', 'insurance', 'servicing'];
            if (servicePages.includes(event.state.section)) {
                showSection(event.state.section);
            }
        }
    }

    /* ###########################################################
       ###   5. Deep Linking Support                           ###
       ########################################################### */

    /**
     * Processes initial page load with hash navigation.
     * Enables direct linking to specific service pages.
     */
    function handleDeepLink() {
        const hash = window.location.hash;
        
        if (hash.startsWith('#service=')) {
            // Extract service ID from hash
            const serviceId = hash.split('=')[1];
            if (SECTION_TITLES[serviceId]) {
                setTimeout(() => {
                    showSection(serviceId);
                }, 100);
            }
        } else if (hash === '#services') {
            setTimeout(() => {
                showSection('services');
            }, 100);
        }
    }

    /* ###########################################################
       ###   6. Keyboard Navigation                            ###
       ########################################################### */

    /**
     * Implements keyboard shortcuts for accessibility.
     * ESC key returns to services overview from detail pages.
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeyboard(event) {
        // ESC key to return to overview
        if (event.key === 'Escape') {
            // First check if any modal is open
            const activeModals = document.querySelectorAll('.modal.active');
            if (activeModals.length > 0) {
                // Let the global handler deal with modals
                return;
            }
            
            // Check if we're on a service detail page
            const activeServicePage = document.querySelector('.section.service-page[style*="display: block"]');
            if (activeServicePage && currentSection !== 'services') {
                event.preventDefault();
                showSection('services');
            }
        }
    }

    /* ###########################################################
       ###   7. Navigation Enhancement                         ###
       ########################################################### */

    /**
     * Enhances service navigation link behavior.
     * Handles special cases when navigating from service detail pages.
     */
    function enhanceServiceNavigation() {
        const servicesNavLink = document.querySelector('[data-section="services"]');
        
        if (servicesNavLink) {
            servicesNavLink.addEventListener('click', function(e) {
                // Check if we're on a service detail page
                const currentHash = window.location.hash;
                if (currentHash.startsWith('#service=')) {
                    e.preventDefault();
                    e.stopPropagation();
                    showSection('services');
                }
                // Otherwise, let normal scroll navigation handle it
            });
        }
    }

    /* ###########################################################
       ###   8. Card Click Enhancement                         ###
       ########################################################### */

    /**
     * Ensures service cards are keyboard accessible.
     * Adds Enter key support for card activation.
     */
    function enhanceCardAccessibility() {
        document.addEventListener('click', function(e) {
            // Check if clicked element is within a service card
            const serviceCard = e.target.closest('.service-card[onclick]');
            if (serviceCard) {
                // The onclick handler will call showSection
                // This is just for debugging
                console.log('Service card clicked:', serviceCard);
            }
        });

        // Add keyboard support for service cards
        document.querySelectorAll('.service-card[onclick]').forEach(card => {
            // Make cards focusable if not already
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                
                // Add Enter key support
                card.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
        });
    }

    /* ###########################################################
       ###   9. Animation Effects                              ###
       ########################################################### */

    /**
     * Adds hover and entrance animations to elements.
     * Enhances visual feedback during interactions.
     */
    function initAnimations() {
        // Add animation classes to service cards
        const cards = document.querySelectorAll('.service-card, .feature-card');
        
        cards.forEach((card, index) => {
            // Stagger entrance animations
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effect classes
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    /* ###########################################################
       ###   10. Public API Definition                         ###
       ########################################################### */

    /* ====== Module Public Interface ====== */
    return {
        /**
         * Initializes the services module.
         * Sets up event listeners and handles initial state.
         */
        init: function() {
            // Initialize if we have any service-related content
            const hasServiceContent = document.querySelector(
                '#services, .service-page, .service-card, .service-features, [onclick*="showSection"]'
            );
            
            if (!hasServiceContent) {
                console.log('No service content found, skipping services module init');
                return;
            }
            
            console.log('✅ Initializing services module...');

            // Attach global event listeners
            window.addEventListener('popstate', handlePopState);
            document.addEventListener('keydown', handleKeyboard);

            // Handle initial deep link on page load
            handleDeepLink();

            // Enhance navigation
            enhanceServiceNavigation();
            enhanceCardAccessibility();

            // Initialize animations
            initAnimations();

            // Expose showSection globally for onclick handlers
            window.showSection = showSection;

            // Log successful initialization
            console.log('✅ Services module initialized successfully');
            console.log('📍 Current section:', currentSection);
            console.log('🔗 Available sections:', Object.keys(SECTION_TITLES));
        },

        /**
         * Programmatic navigation method.
         * Allows other modules to trigger section changes.
         */
        navigate: showSection,
        
        /**
         * Returns the currently active section ID.
         * Useful for state management in other modules.
         */
        getCurrentSection: () => currentSection
    };
})();

/* ###########################################################
   ###   11. Module Initialization                         ###
   ########################################################### */

/* ====== Initialize on DOM Ready ====== */
// Check if DOM is already loaded or wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        ServicesModule.init();
    });
} else {
    // DOM already loaded, initialize immediately
    ServicesModule.init();
}

// Also ensure module is available globally
window.ServicesModule = ServicesModule;

/* ###########################################################
   ###            END OF SERVICES JS MODULE                ###
   ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: SERVICE PAGES MODULE (FIXED)
=======================================================

KEY FIXES:
- Initializes when ANY service content is present
- showSection() is always made globally available
- ESC key handling works properly
- Browser back/forward navigation restored
- Deep linking support maintained

SPA SERVICE NAVIGATION:
- Show/hide mechanism for sub-pages
- URL state management
- History API integration
- Smooth transitions

DEEP LINKING:
- Direct links to service details
- Back button functionality
- State preservation
- SEO friendly URLs

KEYBOARD SUPPORT:
- ESC key returns to overview
- Enter/Space activates cards
- Tab navigation
- Focus management

ACCESSIBILITY:
- ARIA attributes
- Screen reader announcements
- Keyboard navigation
- Focus indicators

INTEGRATION:
- Works with existing onclick handlers
- Delegates non-service navigation
- Maintains active nav states
- Console logging for debugging
=======================================================
*/