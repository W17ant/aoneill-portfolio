/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - ADMIN SEARCH MODULE                ###
   ###   Last Updated: 02-07-2025                          ###
   ########################################################### */

/*
===============================================
Real-time table filtering for admin panel inventory
Seamless integration with existing admin functionality
Performance optimised with debouncing and RAF
Highlights matching text for improved UX
===============================================
*/

/* ###########################################################
   ###   1. Admin Search Class Definition                  ###
   ########################################################### */

/**
 * Real-time search functionality for admin product table.
 * Filters rows based on multiple fields with highlighting.
 */
class AdminSearch {
    constructor(adminPanel) {
        // Reference to parent admin panel instance
        this.adminPanel = adminPanel;
        // DOM element references
        this.searchInput = null;
        this.clearBtn = null;
        this.searchStats = null;
        // Debounce timer for search performance
        this.debounceTimer = null;
        // Current search query
        this.currentQuery = '';
        
        this.init();
    }

    /* ###########################################################
       ###   2. Initialisation Methods                         ###
       ########################################################### */

    /**
     * Initialize search module components.
     * Injects HTML, caches elements, and sets up listeners.
     */
    init() {
        this.injectSearchHTML();
        this.cacheElements();
        this.setupEventListeners();
        
        console.log('🔍 Admin Search Module Initialized');
    }

    /**
     * Inject search interface HTML into admin panel.
     * Creates search bar with stats and clear button.
     */
    injectSearchHTML() {
        const controlsSection = document.querySelector('.admin-controls');
        if (!controlsSection) return;

        const searchHTML = `
            <div class="admin-search-section">
                <div class="admin-search-wrapper">
                    <div class="admin-search-container">
                        <div class="admin-search-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="M21 21l-4.35-4.35"></path>
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            id="admin-search-input" 
                            class="admin-search-input"
                            placeholder="Search products by name, brand, or category..."
                            autocomplete="off"
                        >
                        <div class="search-loading" id="search-loading">
                            <div class="search-spinner"></div>
                        </div>
                    </div>
                    <div class="search-stats" id="search-stats">
                        <div class="search-stat">
                            <span>Showing:</span>
                            <span class="search-stat-value" id="visible-count">0</span>
                        </div>
                        <div class="search-stat">
                            <span>of</span>
                            <span class="search-stat-value" id="total-count">0</span>
                        </div>
                    </div>
                    <button class="btn-clear-search" id="btn-clear-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Clear
                    </button>
                </div>
            </div>
        `;

        // Insert before controls section for proper layout
        controlsSection.insertAdjacentHTML('beforebegin', searchHTML);
    }

    /**
     * Cache DOM element references for performance.
     * Avoids repeated DOM queries during search operations.
     */
    cacheElements() {
        this.searchInput = document.getElementById('admin-search-input');
        this.clearBtn = document.getElementById('btn-clear-search');
        this.searchStats = document.getElementById('search-stats');
        this.visibleCount = document.getElementById('visible-count');
        this.totalCount = document.getElementById('total-count');
        this.loadingIndicator = document.getElementById('search-loading');
        this.tableBody = document.getElementById('product-table-body');
    }

    /**
     * Set up event listeners for search interactions.
     * Implements debouncing for optimal performance.
     */
    setupEventListeners() {
        /* ====== Search Input Handler ====== */
        // Debounce input to avoid excessive filtering
        this.searchInput.addEventListener('input', this.debounce(() => {
            this.performSearch(this.searchInput.value);
        }, 300)); // 300ms delay balances responsiveness and performance

        /* ====== Clear Button Handler ====== */
        this.clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        /* ====== Keyboard Enhancement ====== */
        // Enter key blurs input to dismiss mobile keyboard
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.searchInput.blur();
            }
        });
    }

    /* ###########################################################
       ###   3. Search Functionality                           ###
       ########################################################### */

    /**
     * Execute search operation with loading state.
     * Updates UI and triggers table filtering.
     */
    performSearch(query) {
        this.currentQuery = query.toLowerCase().trim();
        
        // Toggle clear button visibility
        if (this.currentQuery) {
            this.clearBtn.classList.add('visible');
            this.showLoading();
        } else {
            this.clearBtn.classList.remove('visible');
        }

        // Use RAF for smooth UI updates
        requestAnimationFrame(() => {
            this.filterTable();
            this.hideLoading();
        });
    }

    /**
     * Filter table rows based on search query.
     * Handles highlighting and no-results state.
     */
    filterTable() {
        const rows = this.tableBody.querySelectorAll('tr');
        let visibleRows = 0;
        let hasResults = false;

        // Clean up any existing no-results message
        const existingNoResults = this.tableBody.querySelector('.no-results-row');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        rows.forEach(row => {
            // Skip special rows
            if (row.classList.contains('no-results-row')) {
                return;
            }

            if (!this.currentQuery) {
                // Reset all rows when search is cleared
                row.classList.remove('hidden');
                row.classList.remove('highlight');
                this.removeHighlights(row);
                visibleRows++;
                hasResults = true;
            } else {
                // Check if row matches search query
                const searchableText = this.getSearchableText(row);
                
                if (searchableText.includes(this.currentQuery)) {
                    row.classList.remove('hidden');
                    row.classList.add('highlight');
                    this.highlightMatches(row);
                    visibleRows++;
                    hasResults = true;
                } else {
                    row.classList.add('hidden');
                    row.classList.remove('highlight');
                    this.removeHighlights(row);
                }
            }
        });

        // Display no-results message if needed
        if (!hasResults && this.currentQuery) {
            this.showNoResults();
        }

        // Update statistics display
        this.updateStats(visibleRows, rows.length);
    }

    /**
     * Extract searchable text from table row.
     * Includes name, brand, price, categories, and badges.
     */
    getSearchableText(row) {
        const cells = row.querySelectorAll('td');
        const searchableData = [];

        // Product name (column 2)
        if (cells[1]) searchableData.push(cells[1].textContent);
        
        // Brand (column 3)
        if (cells[2]) searchableData.push(cells[2].textContent);
        
        // Price (column 4)
        if (cells[3]) searchableData.push(cells[3].textContent);
        
        // Category (column 5)
        if (cells[4]) searchableData.push(cells[4].textContent);
        
        // Status badges (column 6)
        if (cells[5]) {
            const badges = cells[5].querySelectorAll('.status-badge');
            badges.forEach(badge => searchableData.push(badge.textContent));
        }

        // Join all text and normalize for searching
        return searchableData.join(' ').toLowerCase();
    }

    /* ###########################################################
       ###   4. Text Highlighting System                       ###
       ########################################################### */

    /**
     * Highlight matching text in relevant table cells.
     * Focuses on name, brand, and category columns.
     */
    highlightMatches(row) {
        const cells = row.querySelectorAll('td');
        
        // Target columns for highlighting: name(1), brand(2), category(4)
        [1, 2, 4].forEach(index => {
            if (cells[index]) {
                const originalText = cells[index].textContent;
                const highlightedText = this.highlightText(originalText, this.currentQuery);
                // Only update DOM if matches found
                if (highlightedText !== originalText) {
                    cells[index].innerHTML = highlightedText;
                }
            }
        });
    }

    /**
     * Remove all highlight spans from row.
     * Restores original text content.
     */
    removeHighlights(row) {
        const highlighted = row.querySelectorAll('.search-highlight');
        highlighted.forEach(el => {
            const text = el.textContent;
            // Replace span element with plain text
            el.replaceWith(text);
        });
    }

    /**
     * Wrap matching text in highlight spans.
     * Case-insensitive matching with regex.
     */
    highlightText(text, query) {
        if (!query || !text) return text;
        
        // Create case-insensitive regex with escaped special chars
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * Escape special regex characters in search query.
     * Prevents regex errors from user input.
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /* ###########################################################
       ###   5. UI Update Methods                              ###
       ########################################################### */

    /**
     * Update search statistics display.
     * Synchronises with admin panel stats when filtering.
     */
    updateStats(visible, total) {
        this.visibleCount.textContent = visible;
        this.totalCount.textContent = total;

        // Update admin panel stats for filtered view
        if (this.adminPanel && this.adminPanel.updateStats) {
            if (this.currentQuery) {
                // Show filtered stats during search
                const filteredProducts = this.getFilteredProducts();
                this.adminPanel.updateFilteredStats(filteredProducts);
            } else {
                // Restore original stats when not searching
                this.adminPanel.updateStats();
            }
        }
    }

    /**
     * Get product data for visible rows.
     * Maps visible rows back to product objects.
     */
    getFilteredProducts() {
        const visibleRows = this.tableBody.querySelectorAll('tr:not(.hidden):not(.no-results-row)');
        const filteredProducts = [];

        visibleRows.forEach(row => {
            // Extract product ID from row buttons
            const productId = row.querySelector('[data-product-id]')?.dataset.productId;
            if (productId && this.adminPanel.products) {
                const product = this.adminPanel.products.find(p => p.id === productId);
                if (product) {
                    filteredProducts.push(product);
                }
            }
        });

        return filteredProducts;
    }

    /**
     * Display no results message in table.
     * Provides helpful hints for better search.
     */
    showNoResults() {
        const noResultsHTML = `
            <tr class="no-results-row">
                <td colspan="7">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-message">No products found matching "${this.escapeHtml(this.currentQuery)}"</div>
                    <div class="no-results-hint">Try searching by product name, brand, or category</div>
                </td>
            </tr>
        `;
        
        this.tableBody.insertAdjacentHTML('beforeend', noResultsHTML);
    }

    /**
     * Show loading indicator during search.
     * Provides visual feedback for async operations.
     */
    showLoading() {
        this.loadingIndicator.classList.add('visible');
    }

    /**
     * Hide loading indicator after search.
     * Completes the loading state cycle.
     */
    hideLoading() {
        this.loadingIndicator.classList.remove('visible');
    }

    /* ###########################################################
       ###   6. Search Control Methods                         ###
       ########################################################### */

    /**
     * Clear search and reset table display.
     * Returns focus to search input for convenience.
     */
    clearSearch() {
        this.searchInput.value = '';
        this.currentQuery = '';
        this.clearBtn.classList.remove('visible');
        this.filterTable();
        // Return focus for immediate new search
        this.searchInput.focus();
    }

    /* ###########################################################
       ###   7. Utility Functions                              ###
       ########################################################### */

    /**
     * Debounce function to limit execution frequency.
     * Improves performance by reducing filter operations.
     */
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Escape HTML to prevent XSS in dynamic content.
     * Ensures safe display of user-provided search terms.
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* ###########################################################
       ###   8. Public API Methods                             ###
       ########################################################### */

    /**
     * Refresh search results after data changes.
     * Called by admin panel after CRUD operations.
     */
    refresh() {
        this.filterTable();
    }

    /**
     * Reset search to initial state.
     * Public method for external reset triggers.
     */
    reset() {
        this.clearSearch();
    }
}

/* ###########################################################
   ###   9. Module Initialisation                          ###
   ########################################################### */

/* ====== DOM Ready Integration ====== */
document.addEventListener('DOMContentLoaded', function() {
    // Wait for admin panel Initialisation
    setTimeout(() => {
        if (window.adminPanel) {
            // Create search instance with admin panel reference
            const adminSearch = new AdminSearch(window.adminPanel);
            
            // Expose globally for debugging
            window.adminSearch = adminSearch;
            
            /* ====== Extend Admin Panel ====== */
            // Wrap renderTable to maintain search after updates
            const originalRenderTable = window.adminPanel.renderTable;
            window.adminPanel.renderTable = function() {
                originalRenderTable.call(this);
                // Reapply search filter after table render
                if (window.adminSearch) {
                    window.adminSearch.refresh();
                }
            };

            /* ====== Add Filtered Stats Method ====== */
            // Method to update stats for filtered results
            window.adminPanel.updateFilteredStats = function(filteredProducts) {
                const brands = new Set();
                let investment = 0;
                let featured = 0;

                filteredProducts.forEach(product => {
                    // Count unique brands
                    brands.add(product.brand);
                    
                    // Count investment pieces
                    if (Array.isArray(product.category)) {
                        if (product.category.includes('investment')) investment++;
                    } else if (typeof product.category === 'string') {
                        if (product.category.includes('investment')) investment++;
                    }
                    
                    // Count featured items
                    if (product.featured) featured++;
                });

                // Update stat displays
                document.getElementById('total-products').textContent = filteredProducts.length;
                document.getElementById('investment-count').textContent = investment;
                document.getElementById('featured-count').textContent = featured;
                document.getElementById('brands-count').textContent = brands.size;
            };
            
            console.log('🔍 Admin Search Module Ready');
        } else {
            console.warn('Admin panel not found, search module not initialized');
        }
    }, 100); // Small delay ensures admin panel loads first
});

/* ###########################################################
   ###            END OF ADMIN SEARCH JS MODULE            ###
   ########################################################### */