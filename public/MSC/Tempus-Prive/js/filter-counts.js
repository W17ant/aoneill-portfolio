/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - DYNAMIC FILTER COUNTS MODULE       ###
   ###   Last Updated: 02-07-2025                          ###
   ########################################################### */

/*
===============================================
Manages real-time category counts for product filters
Updates automatically when product data changes
Performance optimised with caching and debouncing
Cross-tab synchronisation via storage events
===============================================
*/

// Initial loading message for debugging
console.log('🔧 filter-counts.js is loading...');

/* ###########################################################
   ###   1. Filter Count Manager Class                     ###
   ########################################################### */

/**
 * Core manager for dynamic filter count badges.
 * Synchronises counts across tabs and components.
 */
class FilterCountManager {
    constructor() {
        // Product data array
        this.products = [];
        // Debounce timer for update batching
        this.updateDebounceTimer = null;
        // Performance cache for count calculations
        this.cache = new Map();
        // Initialisation flag prevents duplicate setup
        this.initialized = false;
    }

    /* ###########################################################
       ###   2. Initialisation Methods                         ###
       ########################################################### */

    /**
     * Primary Initialisation method.
     * Orchestrates data loading, listeners, and initial render.
     */
    init() {
        // Guard against duplicate Initialisation
        if (this.initialized) return;
        
        // Load initial products
        this.loadProducts();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial count update
        this.updateCounts();
        
        this.initialized = true;
        console.log('✅ Filter Count Manager Initialized');
    }

    /* ###########################################################
       ###   3. Data Loading Methods                           ###
       ########################################################### */

    /**
     * Loads product data from available sources.
     * Fallback chain ensures data availability.
     */
    loadProducts() {
        // Primary source: global luxuryProducts array
        if (window.luxuryProducts && Array.isArray(window.luxuryProducts)) {
            this.products = window.luxuryProducts;
        } else {
            // Fallback: localStorage for cross-tab persistence
            try {
                const stored = localStorage.getItem('admin-products');
                if (stored) {
                    this.products = JSON.parse(stored);
                }
            } catch (error) {
                console.error('Error loading products from storage:', error);
                this.products = [];
            }
        }
    }

    /* ###########################################################
       ###   4. Event Listener Setup                           ###
       ########################################################### */

    /**
     * Configures all event listeners for reactive updates.
     * Handles custom events, storage changes, and user interactions.
     */
    setupEventListeners() {
        /* ====== Custom Product Update Events ====== */
        // Listen for programmatic product updates
        window.addEventListener('productsUpdated', (e) => {
            if (e.detail && e.detail.products) {
                this.products = e.detail.products;
                this.updateCounts();
            }
        });

        /* ====== Storage Events for Cross-Tab Sync ====== */
        // Synchronie when another tab updates products
        window.addEventListener('storage', (e) => {
            if (e.key === 'admin-products') {
                try {
                    const newProducts = JSON.parse(e.newValue);
                    if (Array.isArray(newProducts)) {
                        this.products = newProducts;
                        this.updateCounts();
                    }
                } catch (error) {
                    console.error('Error parsing products from storage:', error);
                }
            }
        });

        /* ====== User Interaction Feedback ====== */
        // Visual feedback when filters are clicked
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-tab')) {
                this.highlightActiveFilter(e.target.closest('.filter-tab'));
            }
        });
    }

    /* ###########################################################
       ###   5. Count Calculation Logic                        ###
       ########################################################### */

    /**
     * Calculates product counts by category.
     * Implements caching for performance optimisation.
     */
    countByCategory(products) {
        // Check cache to avoid redundant calculations
        const cacheKey = this.getCacheKey(products);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Initialize count object with all categories
        const counts = {
            all: products.length,
            investment: 0,
            sport: 0,
            dress: 0,
            luxury: 0,
            heritage: 0
        };

        // Count products in each category (non-exclusive)
        products.forEach(product => {
            // Handle modern array format
            if (Array.isArray(product.category)) {
                product.category.forEach(cat => {
                    if (counts.hasOwnProperty(cat)) {
                        counts[cat]++;
                    }
                });
            } else if (typeof product.category === 'string') {
                // Handle legacy comma-separated string format
                const categories = product.category.split(',').map(c => c.trim());
                categories.forEach(cat => {
                    if (counts.hasOwnProperty(cat)) {
                        counts[cat]++;
                    }
                });
            }
        });

        // Cache the result for future requests
        this.cache.set(cacheKey, counts);
        
        // Prevent unbounded cache growth
        if (this.cache.size > 20) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        return counts;
    }

    /**
     * Generates cache key for memoization.
     * Creates unique identifier from product data.
     */
    getCacheKey(products) {
        // Concatenate product IDs and categories for unique key
        return products.map(p => `${p.id}:${Array.isArray(p.category) ? p.category.join(',') : p.category}`).join('|');
    }

    /* ###########################################################
       ###   6. DOM Update Methods                             ###
       ########################################################### */

    /**
     * Triggers count updates with debouncing.
     * Prevents excessive DOM updates during rapid changes.
     */
    updateCounts() {
        // Cancel pending updates
        clearTimeout(this.updateDebounceTimer);
        
        // Schedule new update with 100ms debounce
        this.updateDebounceTimer = setTimeout(() => {
            // Use requestAnimationFrame for smooth rendering
            requestAnimationFrame(() => {
                this.performCountUpdate();
            });
        }, 100);
    }

    /**
     * Executes actual DOM updates with performance monitoring.
     * Tracks update time to identify performance issues.
     */
    performCountUpdate() {
        const startTime = performance.now();
        const counts = this.countByCategory(this.products);

        // Update individual count elements
        Object.entries(counts).forEach(([category, count]) => {
            this.updateCountElement(category, count);
        });

        // Update filter tab badges
        this.updateFilterTabBadges(counts);

        // Warn if update exceeds one frame (16.67ms at 60fps)
        const updateTime = performance.now() - startTime;
        if (updateTime > 16.67) {
            console.warn(`Filter count update took ${updateTime.toFixed(2)}ms`);
        }
    }

    /**
     * Updates individual count element with animations.
     * Provides visual feedback for count changes.
     */
    updateCountElement(category, count) {
        const element = document.getElementById(`count-${category}`);
        if (element) {
            const currentCount = parseInt(element.textContent) || 0;
            
            // Only update if count changed
            if (currentCount !== count) {
                element.textContent = count;
                
                // Base animation class
                element.classList.add('count-updating');
                
                // Directional animation based on change
                if (count > currentCount) {
                    element.classList.add('count-increased');
                } else if (count < currentCount) {
                    element.classList.add('count-decreased');
                }
                
                // Clean up animation classes after completion
                setTimeout(() => {
                    element.classList.remove('count-updating', 'count-increased', 'count-decreased');
                }, 500);
            }
        }
    }

    /**
     * Updates filter tab badge counts.
     * Includes pulse animation for changed values.
     */
    updateFilterTabBadges(counts) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            const filter = tab.dataset.filter;
            const badge = tab.querySelector('.tab-count');
            
            if (badge && counts[filter] !== undefined) {
                const currentCount = parseInt(badge.textContent) || 0;
                
                // Only update DOM if count changed
                if (currentCount !== counts[filter]) {
                    badge.textContent = counts[filter];
                    
                    // Pulse animation draws attention to change
                    badge.classList.add('badge-pulse');
                    setTimeout(() => badge.classList.remove('badge-pulse'), 300);
                }
            }
        });
    }

    /**
     * Provides temporary visual feedback on filter click.
     * Confirms user interaction with subtle animation.
     */
    highlightActiveFilter(filterTab) {
        const badge = filterTab.querySelector('.tab-count');
        if (badge) {
            badge.classList.add('badge-active');
            // Brief highlight duration
            setTimeout(() => badge.classList.remove('badge-active'), 200);
        }
    }

    /* ###########################################################
       ###   7. Public API Methods                             ###
       ########################################################### */

    /**
     * Manual refresh method for external triggers.
     * Reloads data and forces complete update.
     */
    refresh() {
        this.loadProducts();
        this.updateCounts();
    }

    /**
     * Gets count for specific category.
     * Public interface for other components.
     */
    getCount(category) {
        const counts = this.countByCategory(this.products);
        return counts[category] || 0;
    }

    /**
     * Returns all category counts.
     * Used by components needing complete count data.
     */
    getAllCounts() {
        return this.countByCategory(this.products);
    }

    /**
     * Updates products and broadcasts changes.
     * Primary integration point for admin panel.
     */
    notifyProductChange(products) {
        this.products = products;
        this.updateCounts();
        
        // Broadcast update to other components
        window.dispatchEvent(new CustomEvent('filterCountsUpdated', {
            detail: { counts: this.getAllCounts() }
        }));
    }
}

/* ###########################################################
   ###   8. Module Initialisation                          ###
   ########################################################### */

/* ====== Global Variable Declaration ====== */
let filterCountManager;

/* ====== DOM Ready Handler ====== */
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if filter tabs exist on page
    if (document.querySelector('.filter-tab')) {
        filterCountManager = new FilterCountManager();
        filterCountManager.init();
        
        // Expose globally for external access
        window.filterCountManager = filterCountManager;
    }
});

/* ###########################################################
   ###   9. Global Utility Functions                       ###
   ########################################################### */

/**
 * Global function for external product updates.
 * Allows admin panel to trigger count refresh.
 */
window.updateFilterCounts = function(products) {
    if (filterCountManager) {
        filterCountManager.notifyProductChange(products);
    }
};

/**
 * Global function for manual refresh.
 * Useful for debugging and forced updates.
 */
window.refreshFilterCounts = function() {
    if (filterCountManager) {
        filterCountManager.refresh();
    }
};

/* ###########################################################
   ###   10. Module Export for Testing                     ###
   ########################################################### */

/* ====== CommonJS Export Support ====== */
// Enable unit testing in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FilterCountManager };
}

// Final success message
console.log('✅ filter-counts.js loaded successfully');

/* ###########################################################
   ###            END OF FILTER COUNTS JS MODULE           ###
   ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: DYNAMIC FILTER COUNTS MODULE
=======================================================

REAL-TIME COUNT UPDATES:
- Automatic count calculation
- Updates on product changes
- Cross-tab synchronisation
- Performance optimised with caching

CATEGORY COUNTING:
- Supports multi-category products
- Non-exclusive category counting
- "All" count always accurate
- Legacy format compatibility

EVENT SYSTEM:
- Custom events for updates
- Storage events for sync
- Integration with admin panel
- Debounced updates

PERFORMANCE FEATURES:
- Memoization with cache
- RequestAnimationFrame usage
- Debounced DOM updates
- Bounded cache size

VISUAL FEEDBACK:
- Pulse animation on change
- Active state highlighting
- Smooth count transitions
- Mobile-friendly badges

INTEGRATION POINTS:
- Admin panel notifications
- Collection page filters
- Search result counts
- Global state management
=======================================================
*/   