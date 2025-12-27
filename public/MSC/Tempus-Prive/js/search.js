/* ###########################################################
   ###  2418521        Antony O'Neill                      ###
   ###  TEMPUS PRIVÉ - SEARCH MODULE                       ###
   ###  Last Updated: 02-07-2025                           ###
   ########################################################### */

/*
===============================================
Full-text search across products with debouncing,
keyboard navigation, and accessibility features
===============================================
*/

/* ###########################################################
   ###  1. Search Modal Class Definition                   ###
   ########################################################### */

/**
 * Manages the search modal interface and functionality.
 * Provides real-time search with keyboard navigation and accessibility.
 * @class SearchModal
 */
class SearchModal {
    constructor() {
        // ====== Modal DOM Elements ======
        this.modal = null;
        this.backdrop = null;
        this.searchInput = null;
        this.resultsContainer = null;
        this.resultsList = null;
        this.closeBtn = null;
        
        // ====== Data and State Management ======
        this.products = [];
        this.searchResults = [];
        this.selectedIndex = -1;
        this.searchDebounceTimer = null;
        this.isOpen = false;
        this.lastFocusedElement = null;
        
        this.init();
    }

/* ###########################################################
   ###  2. Initialization Methods                          ###
   ########################################################### */

    /**
     * Initializes the search modal by injecting HTML and setting up events.
     * Entry point for all search functionality.
     */
    init() {
        this.injectModalHTML();
        this.cacheElements();
        this.setupEventListeners();
        this.loadProducts();
        
        console.log('🔍 Search Modal Initialized');
    }

    /**
     * Injects the search modal HTML into the DOM.
     * Creates backdrop and modal structure with accessibility attributes.
     */
    injectModalHTML() {
        const modalHTML = `
            <!-- Search Backdrop -->
            <div class="search-backdrop" id="search-backdrop"></div>
            
            <!-- Search Modal -->
            <div id="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
                <div class="search-modal-content">
                    <!-- Header -->
                    <div class="search-header">
                        <h2 id="search-modal-title" class="sr-only">Search Luxury Timepieces</h2>
                        <div class="search-input-wrapper">
                            <div class="search-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="M21 21l-4.35-4.35"></path>
                                </svg>
                            </div>
                            <input 
                                type="search" 
                                id="search-input" 
                                placeholder="Search by brand, model, or feature..." 
                                autocomplete="off"
                                aria-label="Search products"
                                aria-describedby="search-info"
                            >
                        </div>
                        <button 
                            id="search-close" 
                            class="search-close"
                            aria-label="Close search"
                            title="Close (ESC)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Info Bar -->
                    <div class="search-info" id="search-info">
                        <div class="search-count">
                            <span id="result-count">0</span> results
                        </div>
                        <div class="search-hint">
                            <span class="key-hint">↑↓</span> Navigate
                            <span class="key-hint">Enter</span> Select
                            <span class="key-hint">ESC</span> Close
                        </div>
                    </div>
                    
                    <!-- Results -->
                    <div id="search-results" role="region" aria-live="polite" aria-relevant="additions removals">
                        <ul class="search-results-list" role="list" id="search-results-list">
                            <!-- Results populated dynamically -->
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Caches DOM element references for performance.
     * Prevents repeated DOM queries during interactions.
     */
    cacheElements() {
        this.modal = document.getElementById('search-modal');
        this.backdrop = document.getElementById('search-backdrop');
        this.searchInput = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');
        this.resultsList = document.getElementById('search-results-list');
        this.closeBtn = document.getElementById('search-close');
        this.resultCount = document.getElementById('result-count');
    }

    /**
     * Sets up all event listeners for user interactions.
     * Handles clicks, keyboard input, and modal behavior.
     */
    setupEventListeners() {
        // ====== Search Trigger ======
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.open());
        }

        // ====== Close Controls ======
        this.closeBtn.addEventListener('click', () => this.close());

        // Backdrop click closes modal for intuitive UX
        this.backdrop.addEventListener('click', () => this.close());

        // ====== Search Input Handling ======
        // Debounce prevents excessive searches during typing
        this.searchInput.addEventListener('input', this.debounce(() => {
            this.performSearch(this.searchInput.value);
        }, 300));

        // ====== Keyboard Navigation ======
        this.searchInput.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });

        // ====== Modal Content Protection ======
        // Prevents clicks inside modal from bubbling up to close it
        this.modal.querySelector('.search-modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /**
     * Loads product data from global variable or localStorage.
     * Provides fallback to empty array if no data available.
     */
    loadProducts() {
        // Prioritize global variable for consistency with main.js
        if (window.luxuryProducts) {
            this.products = window.luxuryProducts;
        } else {
            try {
                const stored = localStorage.getItem('admin-products');
                this.products = stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Error loading products:', error);
                this.products = [];
            }
        }
        
        console.log(`🔍 Loaded ${this.products.length} products for search`);
    }

    /* ###########################################################
       ###  3. Search Functionality                            ###
       ########################################################### */

    /**
     * Performs search across multiple product fields.
     * Implements performance monitoring for optimization.
     * @param {string} query - User's search input
     */
    performSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length === 0) {
            this.displayResults([]);
            return;
        }
        
        const results = this.searchProducts(trimmedQuery);
        console.log(`🔍 Search performed: "${trimmedQuery}" | Found ${results.length} matches`);
        this.displayResults(results);

        // ====== Multi-field Search ======
        this.searchResults = this.products.filter(product => {
            // Build searchable text from all relevant fields
            const searchFields = [];
            
            // Add basic fields
            if (product.name) searchFields.push(product.name);
            if (product.brand) searchFields.push(product.brand);
            
            // Handle both array and string category formats for flexibility
            if (Array.isArray(product.category)) {
                searchFields.push(...product.category);
            } else if (product.category) {
                searchFields.push(product.category);
            }
            
            // Include technical specifications for detailed searches
            if (product.specs) {
                if (product.specs.movement) searchFields.push(product.specs.movement);
                if (product.specs.material) searchFields.push(product.specs.material);
                if (product.specs.caseMaterial) searchFields.push(product.specs.caseMaterial);
            }
            
            // Join all fields and search
            const searchableText = searchFields.join(' ').toLowerCase();
            return searchableText.includes(searchTerm);
        });

        // ====== Performance Monitoring ======
        // Log slow searches for optimization opportunities
        const searchTime = performance.now() - startTime;
        if (searchTime > 50) {
            console.warn(`Search took ${searchTime.toFixed(2)}ms`);
        }

        this.displayResults(searchTerm);
    }

    /**
     * Displays search results with highlighting and formatting.
     * Uses requestAnimationFrame for smooth rendering.
     * @param {string} searchTerm - Term to highlight in results
     */
    displayResults(searchTerm) {
        if (this.searchResults.length === 0) {
            this.displayNoResults();
            return;
        }

        this.resultCount.textContent = this.searchResults.length;
        
        // Use requestAnimationFrame for optimal rendering performance
        requestAnimationFrame(() => {
            const resultsHTML = this.searchResults.map((product, index) => {
                const highlightedName = this.highlightMatch(product.name, searchTerm);
                const highlightedBrand = this.highlightMatch(product.brand, searchTerm);
                const movement = product.specs?.movement || '';
                const material = product.specs?.caseMaterial || product.specs?.material || '';
                
                return `
                    <li class="search-result-item" 
                        role="option" 
                        tabindex="-1"
                        data-product-id="${product.id}"
                        data-index="${index}">
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="result-image"
                             onerror="this.src='./images/assets/placeholder-watch.png'">
                        <div class="result-content">
                            <div class="result-brand">${highlightedBrand}</div>
                            <div class="result-name">${highlightedName}</div>
                            <div class="result-details">
                                ${movement ? `<span class="result-detail">${this.highlightMatch(movement, searchTerm)}</span>` : ''}
                                ${material ? `<span class="result-detail">${this.highlightMatch(material, searchTerm)}</span>` : ''}
                            </div>
                        </div>
                        <div class="result-price" data-price-gbp="${product.price || ''}">${product.priceDisplay || product.price || 'Private Consultation'}</div>
                    </li>
                `;
            }).join('');

            // Reset the container to show the results list
            this.resultsContainer.innerHTML = `
                <ul class="search-results-list" role="list" id="search-results-list">
                    ${resultsHTML}
                </ul>
            `;
            
            // Re-cache the results list element after DOM update
            this.resultsList = document.getElementById('search-results-list');
            
            this.selectedIndex = -1;
            this.addResultClickHandlers();
        });
    }

    /**
     * Highlights matching text in search results.
     * Creates visual feedback for search relevance.
     * @param {string} text - Text to search within
     * @param {string} searchTerm - Term to highlight
     * @returns {string} HTML with highlighted matches
     */
    highlightMatch(text, searchTerm) {
        if (!text || !searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark class="match">$1</mark>');
    }

    /**
     * Escapes special regex characters for safe pattern matching.
     * Prevents regex injection issues.
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /* ###########################################################
       ###  4. UI State Management                             ###
       ########################################################### */

    /**
     * Displays empty state with search suggestions.
     * Shown when search modal opens or query is cleared.
     */
    displayEmptyState() {
        this.resultCount.textContent = '0';
        this.resultsContainer.innerHTML = `
            <div class="search-empty">
                <div class="empty-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                </div>
                <h3 class="empty-title">Begin Your Search</h3>
                <p class="empty-message">Discover exceptional timepieces from our curated collection</p>
                <div class="empty-suggestions">
                    <p>Try searching for:</p>
                    <div class="suggestion-list">
                        <span class="suggestion-chip" data-search="Rolex">Rolex</span>
                        <span class="suggestion-chip" data-search="Automatic">Automatic</span>
                        <span class="suggestion-chip" data-search="Sport">Sport</span>
                        <span class="suggestion-chip" data-search="Gold">Gold</span>
                    </div>
                </div>
            </div>
        `;
        
        // Clear cached reference as DOM structure changed
        this.resultsList = null;
        
        this.addSuggestionHandlers();
    }

    /**
     * Displays no results state with helpful suggestions.
     * Guides users to modify their search query.
     */
    displayNoResults() {
        this.resultCount.textContent = '0';
        this.resultsContainer.innerHTML = `
            <div class="search-empty">
                <div class="empty-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                        <line x1="15" y1="15" x2="9" y2="9"></line>
                    </svg>
                </div>
                <h3 class="empty-title">No Results Found</h3>
                <p class="empty-message">No timepieces found matching your search</p>
                <div class="empty-suggestions">
                    <p>Suggestions:</p>
                    <ul style="text-align: left; display: inline-block; margin: 1rem 0;">
                        <li>Check your spelling</li>
                        <li>Try different keywords</li>
                        <li>Use brand names or categories</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Clear cached reference as DOM structure changed
        this.resultsList = null;
    }

    /* ###########################################################
       ###  5. Keyboard Navigation                             ###
       ########################################################### */

    /**
     * Handles keyboard navigation for accessibility.
     * Implements arrow key navigation and Enter selection.
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardNavigation(e) {
        // Guard against null resultsList after state changes
        if (!this.resultsList) return;
        
        const results = this.resultsList.querySelectorAll('.search-result-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                // Move selection down, capped at last result
                this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
                this.updateSelectedResult(results);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                // Move selection up, -1 returns focus to input
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelectedResult(results);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
                    const productId = results[this.selectedIndex].dataset.productId;
                    this.selectProduct(productId);
                }
                break;
        }
    }

    /**
     * Updates visual selection state for keyboard navigation.
     * Ensures selected item is visible in viewport.
     * @param {NodeList} results - List of result elements
     */
    updateSelectedResult(results) {
        results.forEach((result, index) => {
            if (index === this.selectedIndex) {
                result.classList.add('active');
                // Smooth scroll to keep selected item visible
                result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                // Announce selection to screen readers
                result.setAttribute('aria-selected', 'true');
            } else {
                result.classList.remove('active');
                result.setAttribute('aria-selected', 'false');
            }
        });
    }

    /* ###########################################################
       ###  6. Event Handlers                                  ###
       ########################################################### */

    /**
     * Adds click handlers to search result items.
     * Delegates product selection to selectProduct method.
     */
    addResultClickHandlers() {
        // Guard against null resultsList after state changes
        if (!this.resultsList) return;
        
        const results = this.resultsList.querySelectorAll('.search-result-item');
        results.forEach(result => {
            result.addEventListener('click', () => {
                const productId = result.dataset.productId;
                this.selectProduct(productId);
            });
        });
    }

    /**
     * Adds click handlers to suggestion chips.
     * Allows quick searches from predefined terms.
     */
    addSuggestionHandlers() {
        const suggestions = this.resultsContainer.querySelectorAll('.suggestion-chip');
        suggestions.forEach(chip => {
            chip.addEventListener('click', () => {
                this.searchInput.value = chip.dataset.search;
                this.performSearch(chip.dataset.search);
                this.searchInput.focus();
            });
        });
    }

    /**
     * Handles product selection from search results.
     * Closes modal and triggers product view.
     * @param {string} productId - ID of selected product
     */
    selectProduct(productId) {
        this.close();
        
        // Integrate with global product viewing function
        if (window.viewProduct) {
            window.viewProduct(productId);
        } else {
            // Fallback notification for demo purposes
            if (window.showNotification) {
                const product = this.products.find(p => p.id === productId);
                window.showNotification(`Viewing ${product?.name || 'product'}`, 'info');
            }
        }
    }

    /* ###########################################################
       ###  7. Modal Controls                                  ###
       ########################################################### */

    /**
     * Opens the search modal with proper focus management.
     * Implements focus trap for accessibility.
     */
    open() {
        if (this.isOpen) return;
        
        // Store current focus for restoration on close
        this.lastFocusedElement = document.activeElement;
        this.isOpen = true;
        
        // ====== Show Modal with Animation ======
        this.backdrop.classList.add('active');
        this.modal.classList.add('active');
        // Prevent body scroll while modal is open
        document.body.style.overflow = 'hidden';
        
        // ====== Reset State ======
        this.searchInput.value = '';
        this.displayEmptyState();
        
        // Delay focus to ensure animation doesn't interfere
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
        
        // ====== Accessibility Features ======
        this.trapFocus();
    }

    /**
     * Closes the search modal and restores previous state.
     * Returns focus to previously focused element.
     */
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // ====== Hide Modal ======
        this.backdrop.classList.remove('active');
        this.modal.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
        
        // ====== Focus Restoration ======
        // Return focus to element that triggered search
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
        
        // ====== State Cleanup ======
        this.searchInput.value = '';
        this.selectedIndex = -1;
    }

    /**
     * Implements focus trap for modal accessibility.
     * Ensures Tab navigation stays within modal bounds.
     */
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'input, button, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            // Wrap focus at boundaries
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        });
    }

    /* ###########################################################
       ###  8. Utility Functions                               ###
       ########################################################### */

    /**
     * Debounces function execution for performance.
     * Prevents excessive function calls during rapid input.
     * @param {Function} func - Function to debounce
     * @param {number} wait - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.searchDebounceTimer);
            this.searchDebounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Formats price for display with proper currency symbol.
     * Handles various price formats and edge cases.
     * @param {number|string} price - Price value
     * @returns {string} Formatted price string
     */
    formatPrice(price) {
        if (!price) return 'Private Consultation';
        if (typeof price === 'string') return price;
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
}

/* ###########################################################
   ###  9. Module Initialization                           ###
   ########################################################### */

// ====== Global Variable Declaration ======
let searchModal;

// ====== DOM Ready Handler ======
document.addEventListener('DOMContentLoaded', function() {
    searchModal = new SearchModal();
    
    // Make available globally for integration
    window.searchModal = searchModal;
    
    console.log('🔍 Search Modal Ready');
});

/* ###########################################################
   ###  10. Module Exports                                 ###
   ########################################################### */

// ====== CommonJS Export Support ======
// Enables testing and modular usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchModal };
}

/* ###########################################################
   ###           END OF SEARCH JS MODULE                   ###
   ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: SEARCH MODULE
=======================================================

REAL-TIME SEARCH ENGINE:
- Instant search with 300ms debounce
- Multi-field search (name, brand, reference)
- Case-insensitive matching
- Performance monitoring

MODAL INTERFACE:
- Full-screen search experience
- Keyboard navigation (arrows, enter, ESC)
- Visual selection indicators
- Auto-focus on open

SEARCH FEATURES:
- Result count display
- No results messaging
- Quick action chips
- Category suggestions

KEYBOARD NAVIGATION:
- Up/down arrow key support
- Enter to select result
- ESC to close modal
- Tab cycling through results

INTEGRATION:
- Works with global product data
- Updates on admin changes
- Connects to product viewing
- Mobile-optimized interface

ACCESSIBILITY:
- ARIA live regions for results
- Screen reader announcements
- Proper focus management
- Semantic markup
=======================================================
*/   