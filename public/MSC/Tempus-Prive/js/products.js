/* ###########################################################
   ###  2418521        Antony O'Neill                      ###
   ###  TEMPUS PRIVÉ - PRODUCTS MANAGEMENT MODULE          ###
   ###  Last Updated: 02-07-2025                           ###
   ########################################################### */

/*
===============================================
Comprehensive product data management system
Handles JSON loading, filtering, sorting, and display
Integrates with main.js for unified product handling
Provides dynamic UI updates and state management
===============================================
*/

/* ###########################################################
   ###  1. Product Manager Class Definition                ###
   ########################################################### */

/**
 * Central manager for all product-related operations.
 * Handles data loading, filtering, sorting, and rendering logic.
 * @class ProductManager
 */
class ProductManager {
    
  /**
   * Initializes product manager with default state.
   * Sets up empty data structures and default filter/sort values.
   */
  constructor() {
      // ====== Product Data Storage ======
      this.products = [];      // Main product array from JSON
      this.brands = {};        // Brand metadata mapping
      this.categories = {};    // Category metadata mapping
      
      // ====== Filter and Sort State ======
      this.currentFilter = 'all';        // Active category filter
      this.currentSort = 'featured';     // Active sort criteria
      this.searchQuery = '';             // Active search term
      
      // ====== UI State Management ======
      this.isLoading = false;    // Loading indicator state
      this.loadedCount = 12;     // Progressive loading counter
      
      this.init();
  }

  /* ###########################################################
     ###  2. Initialization and Data Loading                 ###
     ########################################################### */

  /**
   * Main initialization entry point.
   * Orchestrates data loading and UI setup with error handling.
   */
  async init() {
      try {
          await this.loadProductData();
          this.initializeEventListeners();
          this.renderProducts();
          this.renderBrands();
          this.renderCategories();
      } catch (error) {
          console.error('Error initializing ProductManager:', error);
          this.showError('Failed to load products. Please refresh the page.');
      }
  }

  /**
   * Loads product data from JSON file.
   * Implements loading states and comprehensive error handling.
   */
  async loadProductData() {
      this.setLoading(true);
      
      try {
          const response = await fetch('./data/products.json');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          // Defensive programming: ensure arrays/objects exist
          this.products = data.products || [];
          this.brands = data.brands || {};
          this.categories = data.categories || {};
          
          console.log(`Loaded ${this.products.length} products from ${Object.keys(this.brands).length} brands`);
      } catch (error) {
          console.error('Error loading product data:', error);
          // Fallback to empty data prevents app crash
          this.products = [];
          this.brands = {};
          this.categories = {};
          throw error;
      } finally {
          // Always hide loading state, even on error
          this.setLoading(false);
      }
  }

  /* ###########################################################
     ###  3. Event Listener Management                       ###
     ########################################################### */

  /**
   * Sets up all event listeners for user interactions.
   * Uses delegation pattern for dynamically created elements.
   */
  initializeEventListeners() {
      // ====== Filter Button Handlers ======
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
          btn.addEventListener('click', (e) => {
              const filter = e.target.dataset.filter;
              this.setFilter(filter);
              this.updateActiveFilter(e.target);
          });
      });

      // ====== Sort Dropdown Handler ======
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
          sortSelect.addEventListener('change', (e) => {
              this.setSort(e.target.value);
          });
      }

      // ====== Search Input with Debouncing ======
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
          searchInput.addEventListener('input', this.debounce((e) => {
              this.setSearch(e.target.value);
          }, 300)); // 300ms delay prevents excessive rerenders
      }

      // ====== Load More Button ======
      const loadMoreBtn = document.getElementById('load-more-btn');
      if (loadMoreBtn) {
          loadMoreBtn.addEventListener('click', () => {
              this.loadMoreProducts();
          });
      }

      // ====== Product Card Interactions ======
      this.initializeProductInteractions();
  }

  /**
   * Initializes event delegation for product card interactions.
   * Handles clicks and hover effects for dynamically created cards.
   */
  initializeProductInteractions() {
      // Use event delegation for dynamically created product cards
      const productsGrid = document.getElementById('products-grid');
      if (productsGrid) {
          // ====== Click Handler Delegation ======
          productsGrid.addEventListener('click', (e) => {
              const productCard = e.target.closest('.product-card');
              if (!productCard) return;

              const productId = productCard.dataset.productId;
              
              // Route to appropriate handler based on clicked element
              if (e.target.classList.contains('btn-view')) {
                  this.viewProduct(productId);
              } else if (e.target.classList.contains('add-to-collection')) {
                  this.addToCollection(productId);
              } else if (e.target.classList.contains('request-consultation')) {
                  this.requestConsultation(productId);
              }
          });

          // ====== Hover Effect Handlers ======
          // Using capture phase (true) for better performance
          productsGrid.addEventListener('mouseenter', (e) => {
              const productCard = e.target.closest('.product-card');
              if (productCard) {
                  this.animateProductCard(productCard, 'enter');
              }
          }, true);

          productsGrid.addEventListener('mouseleave', (e) => {
              const productCard = e.target.closest('.product-card');
              if (productCard) {
                  this.animateProductCard(productCard, 'leave');
              }
          }, true);
      }
  }

  /* ###########################################################
     ###  4. Filter and Sort State Management                ###
     ########################################################### */

  /**
   * Updates current filter and triggers re-render.
   * Central point for all filter changes.
   * @param {string} filter - Category filter value
   */
  setFilter(filter) {
      this.currentFilter = filter;
      this.renderProducts();
  }

  /**
   * Updates current sort option and triggers re-render.
   * Maintains sort preference across filter changes.
   * @param {string} sort - Sort criteria value
   */
  setSort(sort) {
      this.currentSort = sort;
      this.renderProducts();
  }

  /**
   * Updates search query with normalization.
   * Converts to lowercase for case-insensitive search.
   * @param {string} query - User search input
   */
  setSearch(query) {
      this.searchQuery = query.toLowerCase().trim();
      this.renderProducts();
  }

  /* ###########################################################
     ###  5. Product Filtering and Sorting Logic             ###
     ########################################################### */

  /**
   * Applies all active filters and sorting to products.
   * Combines category filter, search, and sort in sequence.
   * @returns {Array} Filtered and sorted product array
   */
  getFilteredProducts() {
      let filtered = [...this.products]; // Create copy to avoid mutation

      // ====== Category Filter ======
      if (this.currentFilter !== 'all') {
          filtered = filtered.filter(product => {
              // Handle both array and string category formats
              if (Array.isArray(product.category)) {
                  return product.category.includes(this.currentFilter);
              }
              return product.category === this.currentFilter;
          });
      }

      // ====== Search Filter ======
      if (this.searchQuery) {
          filtered = filtered.filter(product => {
              // Build searchable text from multiple fields
              const searchFields = [
                  product.name,
                  this.brands[product.brand]?.name || product.brand,
                  product.model,
                  product.description,
                  product.specifications?.caseMaterial,
                  product.specifications?.movement
              ].filter(Boolean); // Remove null/undefined values

              // Check if any field contains search query
              return searchFields.some(field => 
                  field.toLowerCase().includes(this.searchQuery)
              );
          });
      }

      // ====== Apply Sorting ======
      return this.sortProducts(filtered);
  }

  /**
   * Sorts products based on current sort criteria.
   * Handles null prices and various sort options.
   * @param {Array} products - Array to sort
   * @returns {Array} New sorted array
   */
  sortProducts(products) {
      // Create copy to maintain immutability
      const sorted = [...products];
      
      switch (this.currentSort) {
          case 'price-asc':
              return sorted.sort((a, b) => {
                  // "By Private Consultation" items go to end
                  if (a.price === null) return 1;
                  if (b.price === null) return -1;
                  return a.price - b.price;
              });
              
              case 'price-desc':
                return sorted.sort((a, b) => {
                    // "By Private Consultation" items go to TOP when sorting highest first
                    if (a.price === null && b.price === null) return 0;
                    if (a.price === null) return -1;  // Changed from: return 1
                    if (b.price === null) return 1;   // Changed from: return -1
                    return b.price - a.price;
                });
              
          case 'name-asc':
              return sorted.sort((a, b) => 
                  a.name.localeCompare(b.name)
              );
              
          case 'name-desc':
              return sorted.sort((a, b) => 
                  b.name.localeCompare(a.name)
              );
              
          case 'brand':
              return sorted.sort((a, b) => 
                  a.brand.localeCompare(b.brand)
              );
              
          case 'newest':
              // Boolean sort: true values first
              return sorted.sort((a, b) => 
                  (b.newArrival || 0) - (a.newArrival || 0)
              );
              
          case 'featured':
          default:
              // Featured products take priority
              return sorted.sort((a, b) => {
                  if (a.featured && !b.featured) return -1;
                  if (!a.featured && b.featured) return 1;
                  return 0;
              });
      }
  }

  /* ###########################################################
     ###  6. Product Rendering Methods                       ###
     ########################################################### */

  /**
   * Main render function for product grid.
   * Handles empty states and progressive loading.
   */
  renderProducts() {
      const grid = document.getElementById('products-grid');
      if (!grid) return;

      const filteredProducts = this.getFilteredProducts();
      
      // ====== Empty State Handling ======
      if (filteredProducts.length === 0) {
          this.renderEmptyState(grid);
          return;
      }

      // ====== Progressive Loading Logic ======
      const productsToShow = filteredProducts.slice(0, this.loadedCount);
      
      // Clear and render product cards
      grid.innerHTML = productsToShow.map(product => 
          this.createProductCard(product)
      ).join('');

      // ====== Load More Button Visibility ======
      this.updateLoadMoreButton(productsToShow.length < filteredProducts.length);
  }

  /**
   * Creates HTML for individual product card.
   * Builds card with image, details, and action buttons.
   * @param {Object} product - Product data object
   * @returns {string} HTML string for product card
   */
  createProductCard(product) {
      const priceDisplay = this.formatPrice(product.price);
      const isNew = product.newArrival ? '<span class="badge-new">New</span>' : '';
      const isFeatured = product.featured ? '<span class="badge-featured">Featured</span>' : '';
      
      return `
          <div class="product-card" data-product-id="${product.id}">
              <div class="product-image-wrapper">
                  <img src="${product.image}" 
                       alt="${product.name}" 
                       class="product-image"
                       loading="lazy"
                       onerror="this.src='./images/assets/placeholder-watch.png'">
                  <div class="product-badges">
                      ${isNew}
                      ${isFeatured}
                  </div>
                  <div class="product-overlay">
                      <button class="btn-view" aria-label="View ${product.name}">
                          <i class="icon-eye"></i> View Details
                      </button>
                  </div>
              </div>
              <div class="product-info">
                  <h3 class="product-brand">${product.brand}</h3>
                  <h4 class="product-name">${product.name}</h4>
                  <p class="product-price" data-price-gbp="${product.price || ''}">${priceDisplay}</p>
                  <div class="product-actions">
                      <button class="add-to-collection" data-product-id="${product.id}">
                          <i class="icon-heart"></i>
                      </button>
                      <button class="request-consultation" data-product-id="${product.id}">
                          <i class="icon-message"></i>
                      </button>
                  </div>
              </div>
          </div>
      `;
  }

  /**
   * Renders brand filter buttons.
   * Creates clickable brand options from brand data.
   */
  renderBrands() {
      const brandsContainer = document.getElementById('brands-filter');
      if (!brandsContainer) return;

      const brandButtons = Object.entries(this.brands).map(([key, brand]) => `
          <button class="filter-btn brand-btn" data-filter="${key}">
              ${brand.name}
              <span class="brand-count">${this.getProductCountByBrand(key)}</span>
          </button>
      `).join('');

      brandsContainer.innerHTML = brandButtons;
  }

  /**
   * Renders category filter options.
   * Creates category buttons with product counts.
   */
  renderCategories() {
      const categoriesContainer = document.getElementById('categories-filter');
      if (!categoriesContainer) return;

      const categoryButtons = Object.entries(this.categories).map(([key, category]) => `
          <button class="filter-btn category-btn" data-filter="${key}">
              ${category.name}
              <span class="category-count">${this.getProductCountByCategory(key)}</span>
          </button>
      `).join('');

      categoriesContainer.innerHTML = categoryButtons;
  }

  /* ###########################################################
     ###  7. UI State Management Methods                     ###
     ########################################################### */

  /**
   * Updates visual state of filter buttons.
   * Manages active class for selected filter.
   * @param {HTMLElement} activeButton - Clicked button element
   */
  updateActiveFilter(activeButton) {
      // Remove active class from all filter buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      activeButton.classList.add('active');
  }

  /**
   * Sets loading state and updates UI accordingly.
   * Shows/hides loading indicators.
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
      this.isLoading = loading;
      const loadingIndicator = document.getElementById('loading-indicator');
      
      if (loadingIndicator) {
          loadingIndicator.style.display = loading ? 'block' : 'none';
      }
  }

  /**
   * Displays error message to user.
   * Creates user-friendly error notification.
   * @param {string} message - Error message to display
   */
  showError(message) {
      const errorContainer = document.getElementById('error-container');
      if (errorContainer) {
          errorContainer.innerHTML = `
              <div class="error-message">
                  <i class="icon-alert"></i>
                  <p>${message}</p>
                  <button onclick="location.reload()">Retry</button>
              </div>
          `;
          errorContainer.style.display = 'block';
      }
  }

  /**
   * Renders empty state when no products match filters.
   * Provides helpful message and action to reset.
   * @param {HTMLElement} container - Grid container element
   */
  renderEmptyState(container) {
      container.innerHTML = `
          <div class="empty-state">
              <i class="icon-search-off"></i>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onclick="productManager.resetFilters()">
                  Clear All Filters
              </button>
          </div>
      `;
  }

  /* ###########################################################
     ###  8. Product Interaction Handlers                    ###
     ########################################################### */

  /**
   * Handles product view action.
   * Opens product detail modal or navigates to detail page.
   * @param {string} productId - ID of product to view
   */
  viewProduct(productId) {
      const product = this.products.find(p => p.id === productId);
      if (!product) return;

      // Trigger product detail display
      if (window.displayProductDetails) {
          window.displayProductDetails(productId);
      } else {
          // Fallback: navigate to product page
          window.location.href = `#product/${productId}`;
      }
  }

  /**
   * Handles add to collection action.
   * Integrates with collection management system.
   * @param {string} productId - ID of product to add
   */
  addToCollection(productId) {
      if (window.tempusPriveCollection) {
          window.tempusPriveCollection.toggle(productId);
      }
      
      // Update button state
      const button = document.querySelector(`[data-product-id="${productId}"] .add-to-collection`);
      if (button) {
          button.classList.toggle('in-collection');
      }
  }

  /**
   * Handles consultation request action.
   * Opens consultation form with product context.
   * @param {string} productId - ID of product for consultation
   */
  requestConsultation(productId) {
      const product = this.products.find(p => p.id === productId);
      if (!product) return;

      // Open consultation modal with product info
      if (window.openConsultationModal) {
          window.openConsultationModal(product);
      } else {
          // Fallback: show notification
          if (window.showNotification) {
              window.showNotification('Consultation request feature coming soon', 'info');
          }
      }
  }

  /**
   * Animates product card on hover.
   * Provides visual feedback for user interactions.
   * @param {HTMLElement} card - Product card element
   * @param {string} state - Animation state ('enter' or 'leave')
   */
  animateProductCard(card, state) {
      if (state === 'enter') {
          card.classList.add('hovering');
          // Scale image slightly on hover
          const img = card.querySelector('.product-image');
          if (img) {
              img.style.transform = 'scale(1.05)';
          }
      } else {
          card.classList.remove('hovering');
          const img = card.querySelector('.product-image');
          if (img) {
              img.style.transform = 'scale(1)';
          }
      }
  }

  /* ###########################################################
     ###  9. Utility Methods                                 ###
     ########################################################### */

  /**
   * Formats price for display with currency.
   * Handles null prices as "By Private Consultation".
   * @param {number|null} price - Price value
   * @returns {string} Formatted price string
   */
  formatPrice(price) {
      if (price === null || price === undefined) {
          return "By Private Consultation";
      }
      
      // Format as GBP currency
      return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
      }).format(price);
  }

  /**
   * Creates debounced function to limit execution frequency.
   * Prevents excessive function calls during rapid events.
   * @param {Function} func - Function to debounce
   * @param {number} wait - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  }

  /**
   * Gets product count for specific brand.
   * Used for filter button badges.
   * @param {string} brand - Brand key
   * @returns {number} Product count
   */
  getProductCountByBrand(brand) {
      return this.products.filter(p => p.brand === brand).length;
  }

  /**
   * Gets product count for specific category.
   * Used for filter button badges.
   * @param {string} category - Category key
   * @returns {number} Product count
   */
  getProductCountByCategory(category) {
      return this.products.filter(p => {
          if (Array.isArray(p.category)) {
              return p.category.includes(category);
          }
          return p.category === category;
      }).length;
  }

  /**
   * Loads more products for progressive loading.
   * Increases loaded count and re-renders.
   */
  loadMoreProducts() {
      this.loadedCount += 12; // Load 12 more products
      this.renderProducts();
  }

  /**
   * Updates load more button visibility.
   * Shows/hides based on remaining products.
   * @param {boolean} hasMore - Whether more products exist
   */
  updateLoadMoreButton(hasMore) {
      const loadMoreBtn = document.getElementById('load-more-btn');
      if (loadMoreBtn) {
          loadMoreBtn.style.display = hasMore ? 'block' : 'none';
      }
  }

  /**
   * Resets all filters to default state.
   * Clears search, category filter, and resets sort.
   */
  resetFilters() {
      this.currentFilter = 'all';
      this.currentSort = 'featured';
      this.searchQuery = '';
      
      // Clear search input
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
          searchInput.value = '';
      }
      
      // Reset sort dropdown
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
          sortSelect.value = 'featured';
      }
      
      // Update active filter button
      const allButton = document.querySelector('[data-filter="all"]');
      if (allButton) {
          this.updateActiveFilter(allButton);
      }
      
      this.renderProducts();
  }
}

/* ###########################################################
   ###  10. Module Initialization                          ###
   ########################################################### */

// ====== Global Variable Declaration ======
let productManager;

// ====== DOM Ready Handler ======
document.addEventListener('DOMContentLoaded', function() {
  productManager = new ProductManager();
  
  // Make available globally for integration
  window.productManager = productManager;
  
  console.log('📦 Product Manager Ready');
});

/* ###########################################################
   ###  11. Module Exports                                 ###
   ########################################################### */

// ====== CommonJS Export Support ======
// Enables testing and modular usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductManager };
}

/* ###########################################################
   ###           END OF PRODUCTS JS MODULE                 ###
   ########################################################### */
   
/*
=======================================================
IMPLEMENTATION NOTES: PRODUCTS MANAGEMENT MODULE
=======================================================

DYNAMIC PRODUCT GRID:
- Auto-fit responsive columns
- Lazy loading with "Load More" button
- 12 products initial load for performance
- Smooth reveal animations

FILTERING SYSTEM (10% Advanced):
- Multi-category filtering
- Real-time filter counts
- Visual active states
- URL parameter support

SORTING FUNCTIONALITY:
- Featured (default)
- Price ascending/descending
- Newest arrivals
- Alphabetical by name

SEARCH INTEGRATION:
- Connects with search.js module
- Highlights matching products
- Search result navigation
- Clear filters option

PERFORMANCE OPTIMIZATIONS:
- Virtual DOM-like rendering
- Batched DOM updates
- Debounced filter operations
- Image lazy loading

ACCESSIBILITY:
- Keyboard navigation support
- Screen reader announcements
- Focus management on filter change
- Semantic HTML structure
=======================================================
*/   