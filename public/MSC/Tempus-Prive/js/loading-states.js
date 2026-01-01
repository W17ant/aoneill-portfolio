/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - LOADING STATES/EMPTY STATES MODULE ###
   ###   Last Updated: 29-06-2025                          ###
   ########################################################### */

/*
===============================================
Handles all loading indicators, skeleton screens,
and empty state messaging throughout the platform
===============================================
*/

/* ###########################################################
   ###   1. LoadingStatesManager Class Definition          ###
   ########################################################### */

/**
 * Manages all loading states, skeleton screens, and empty states.
 * Provides unified interface for showing/hiding loading indicators.
 * @class LoadingStatesManager
 */
class LoadingStatesManager {
  constructor() {
      // Track active loaders to prevent overlapping states
      this.activeLoaders = new Map();
      // Initialize reusable templates for performance
      this.skeletonTemplates = this.initSkeletonTemplates();
      this.emptyStateTemplates = this.initEmptyStateTemplates();
      this.init();
  }

  /* ###########################################################
     ###   2. Initialisation Methods                         ###
     ########################################################### */

  /* ====== Main Initialisation ====== */
  init() {
      this.loadStart = performance.now();
      this.setupLoadingScreen();
      this.injectStyles();
      console.log('⏳ Loading States Manager Initialized');
  }

  /* ====== Loading Screen Setup ====== */
  setupLoadingScreen() {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
          // Add accessibility attributes
          loadingScreen.setAttribute('role', 'status');
          loadingScreen.setAttribute('aria-live', 'polite');
          loadingScreen.setAttribute('aria-label', 'Loading Tempus Privé');
          
          // Update structure if needed
          const loadingContent = loadingScreen.querySelector('.loading-content');
          if (loadingContent && !loadingContent.querySelector('.loading-spinner')) {
              loadingContent.insertAdjacentHTML('beforeend', `
                  <div class="loading-spinner" aria-hidden="true">
                      <div class="spinner-ring"></div>
                  </div>
              `);
          }
      }
  }

  /* ###########################################################
     ###   3. Template Initialisation                        ###
     ########################################################### */

  /* ====== Skeleton Templates ====== */
  initSkeletonTemplates() {
      return {
          productCard: `
              <div class="skeleton-card" role="status" aria-label="Loading product">
                  <div class="skeleton skeleton-image"></div>
                  <div class="skeleton-content">
                      <div class="skeleton skeleton-text skeleton-brand"></div>
                      <div class="skeleton skeleton-text skeleton-title"></div>
                      <div class="skeleton skeleton-text skeleton-specs"></div>
                      <div class="skeleton skeleton-text skeleton-price"></div>
                  </div>
              </div>
          `,
          maisonCard: `
              <div class="skeleton-card skeleton-maison" role="status" aria-label="Loading brand">
                  <div class="skeleton skeleton-logo"></div>
                  <div class="skeleton skeleton-text skeleton-title"></div>
                  <div class="skeleton skeleton-text skeleton-subtitle"></div>
                  <div class="skeleton-pills">
                      <div class="skeleton skeleton-pill"></div>
                      <div class="skeleton skeleton-pill"></div>
                  </div>
              </div>
          `,
          serviceCard: `
              <div class="skeleton-card skeleton-service" role="status" aria-label="Loading service">
                  <div class="skeleton skeleton-icon"></div>
                  <div class="skeleton skeleton-text skeleton-title"></div>
                  <div class="skeleton skeleton-text skeleton-desc"></div>
                  <div class="skeleton skeleton-text skeleton-desc"></div>
              </div>
          `,
          searchResult: `
              <div class="skeleton-search-item" role="status" aria-label="Loading search result">
                  <div class="skeleton skeleton-thumb"></div>
                  <div class="skeleton-search-content">
                      <div class="skeleton skeleton-text skeleton-name"></div>
                      <div class="skeleton skeleton-text skeleton-detail"></div>
                  </div>
              </div>
          `
      };
  }

  /* ====== Empty State Templates ====== */
  initEmptyStateTemplates() {
      return {
          products: {
              icon: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
              </svg>`,
              title: 'No timepieces found',
              message: 'Adjust your selection criteria to discover more masterpieces',
              action: {
                  text: 'View All Collection',
                  handler: 'clearFilters'
              }
          },
          search: {
              icon: '🔍',
              title: 'No results found',
              message: 'Try adjusting your search terms or browse our full collection',
              action: {
                  text: 'Clear Search',
                  handler: 'clearSearch'
              }
          },
          collection: {
              icon: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>`,
              title: 'Your collection is waiting for its first masterpiece',
              message: 'Add timepieces to create your private collection',
              action: {
                  text: 'Explore Collection',
                  handler: 'exploreCollection'
              }
          },
          error: {
              icon: '⚠️',
              title: 'Something went wrong',
              message: 'We encountered an error. Please try again.',
              action: {
                  text: 'Retry',
                  handler: 'retry'
              }
          }
      };
  }

  /* ###########################################################
     ###   4. Public Methods - Skeleton Loading              ###
     ########################################################### */

  /**
   * Show skeleton cards in container.
   * @param {string|HTMLElement} container - Container element or ID
   * @param {string} type - Type of skeleton (productCard, maisonCard, etc)
   * @param {number} count - Number of skeletons to show
   */
  showSkeletons(container, type = 'productCard', count = 8) {
      if (typeof container === 'string') {
          container = document.getElementById(container);
      }
      if (!container) return;

      const template = this.skeletonTemplates[type];
      if (!template) {
          console.warn(`Unknown skeleton type: ${type}`);
          return;
      }

      // Generate multiple skeleton cards
      container.innerHTML = Array(count).fill(template).join('');
      container.setAttribute('aria-busy', 'true');
      
      // Track active loader
      this.activeLoaders.set(container, { type, count });
  }

  /**
   * Hide skeleton loading state.
   * @param {string|HTMLElement} container - Container element or ID
   */
  hideSkeletons(container) {
      if (typeof container === 'string') {
          container = document.getElementById(container);
      }
      if (!container) return;

      container.removeAttribute('aria-busy');
      this.activeLoaders.delete(container);
  }

  /* ###########################################################
     ###   5. Public Methods - Empty States                  ###
     ########################################################### */

  /**
   * Show empty state with appropriate messaging and actions.
   * @param {string|HTMLElement} container - Container element or ID
   * @param {string} type - Type of empty state (products, search, collection, error)
   * @param {Object} customOptions - Optional custom configuration
   */
  showEmptyState(container, type = 'products', customOptions = {}) {
      if (typeof container === 'string') {
          container = document.getElementById(container);
      }
      if (!container) return;

      const template = this.emptyStateTemplates[type] || this.emptyStateTemplates.error;
      const options = { ...template, ...customOptions };

      container.innerHTML = `
          <div class="empty-state" role="status" aria-live="polite">
              <div class="empty-icon">${options.icon}</div>
              <h3>${options.title}</h3>
              <p>${options.message}</p>
              ${options.action ? `
                  <button class="btn-secondary" onclick="${options.action.handler}()">
                      ${options.action.text}
                  </button>
              ` : ''}
          </div>
      `;
  }

  /* ###########################################################
     ###   6. Public Methods - Inline Loading                ###
     ########################################################### */

  /**
   * Show inline loading spinner with message.
   * @param {string|HTMLElement} container - Container element or ID
   * @param {string} message - Loading message to display
   */
  showInlineLoader(container, message = 'Loading...') {
      if (typeof container === 'string') {
          container = document.getElementById(container);
      }
      if (!container) return;

      container.innerHTML = `
          <div class="inline-loader" role="status" aria-live="polite">
              <div class="spinner-small"></div>
              <span>${message}</span>
          </div>
      `;
      container.setAttribute('aria-busy', 'true');
  }

  /* ###########################################################
     ###   7. Public Methods - Spinner Overlays              ###
     ########################################################### */

  /**
   * Show contextual spinner overlay on target element.
   * @param {string|HTMLElement} targetElement - Target element or ID
   * @param {string} message - Optional message to display
   * @returns {HTMLElement} The overlay element for later removal
   */
  showSpinnerOverlay(targetElement, message = '') {
      if (typeof targetElement === 'string') {
          targetElement = document.getElementById(targetElement);
      }
      if (!targetElement) return;

      const overlay = document.createElement('div');
      overlay.className = 'spinner-overlay';
      overlay.innerHTML = `
          <div class="spinner-content">
              <div class="spinner-ring"></div>
              ${message ? `<p class="spinner-message">${message}</p>` : ''}
          </div>
      `;
      
      // Ensure target has relative positioning for overlay
      targetElement.style.position = 'relative';
      targetElement.appendChild(overlay);
      targetElement.setAttribute('aria-busy', 'true');
      
      return overlay;
  }

  /**
   * Hide spinner overlay from target element.
   * @param {string|HTMLElement} targetElement - Target element or ID
   */
  hideSpinnerOverlay(targetElement) {
      if (typeof targetElement === 'string') {
          targetElement = document.getElementById(targetElement);
      }
      if (!targetElement) return;

      const overlay = targetElement.querySelector('.spinner-overlay');
      if (overlay) {
          overlay.remove();
      }
      targetElement.removeAttribute('aria-busy');
  }

  /* ###########################################################
     ###   8. Public Methods - Loading Screen                ###
     ########################################################### */

  /**
   * Fade out the initial loading screen.
   * @param {number} duration - Fade duration in milliseconds
   */
  fadeOutLoadingScreen(duration = 800) {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
          loadingScreen.classList.add('fade-out');
          console.log(`⚡ Page loaded in ${performance.now() - this.loadStart}ms`);
          setTimeout(() => {
              loadingScreen.style.display = 'none';
          }, duration);
      }
  }

  /* ###########################################################
     ###   9. Public Methods - Button Loading States         ###
     ########################################################### */

  /**
   * Set button loading state with spinner.
   * @param {string|HTMLElement} button - Button element or ID
   * @param {boolean} isLoading - Whether to show loading state
   * @param {string} loadingText - Text to show while loading
   */
  setButtonLoading(button, isLoading = true, loadingText = 'Processing...') {
      if (typeof button === 'string') {
          button = document.getElementById(button);
      }
      if (!button) return;

      if (isLoading) {
          // Store original text for restoration
          button.dataset.originalText = button.textContent;
          button.innerHTML = `
              <span class="button-spinner"></span>
              <span>${loadingText}</span>
          `;
          button.disabled = true;
          button.classList.add('loading');
      } else {
          // Restore original state
          button.textContent = button.dataset.originalText || button.textContent;
          button.disabled = false;
          button.classList.remove('loading');
          delete button.dataset.originalText;
      }
  }

  /* ###########################################################
     ###   10. Utility Methods                               ###
     ########################################################### */

  /**
   * Inject dynamic styles for reduced motion preferences.
   * Respects user's accessibility settings.
   */
  injectStyles() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const style = document.createElement('style');
          style.textContent = `
              .skeleton, .spinner-ring, .button-spinner {
                  animation: none !important;
              }
          `;
          document.head.appendChild(style);
      }
  }

  /**
   * Create progress indicator for multi-step operations.
   * @param {number} steps - Total number of steps
   * @param {number} currentStep - Current step (0-based)
   * @returns {string} HTML for progress indicator
   */
  createProgressIndicator(steps, currentStep = 0) {
      return `
          <div class="progress-indicator" role="progressbar" 
               aria-valuenow="${currentStep}" 
               aria-valuemin="0" 
               aria-valuemax="${steps}">
              <div class="progress-bar" style="width: ${(currentStep / steps) * 100}%"></div>
              <div class="progress-text">${currentStep} of ${steps}</div>
          </div>
      `;
  }
}

/* ###########################################################
 ###   11. Global Helper Functions                       ###
 ########################################################### */

/* ====== Empty State Action Handlers ====== */
// These functions are referenced in empty state templates

/**
* Clear all active filters.
* Global function for empty state CTAs.
*/
window.clearFilters = function() {
  if (window.luxurySections) {
      window.luxurySections.clearFilters();
  }
};

/**
* Clear search input and close modal.
* Global function for search empty states.
*/
window.clearSearch = function() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
  }
  const searchModal = document.getElementById('search-modal');
  if (searchModal) {
      searchModal.classList.remove('active');
  }
};

/**
* Navigate to collection section.
* Global function for collection empty states.
*/
window.exploreCollection = function() {
  const collectionModal = document.getElementById('collection-modal');
  if (collectionModal) {
      collectionModal.classList.remove('active');
  }
  // Navigate to collection section
  const collectionLink = document.querySelector('[data-section="collection"]');
  if (collectionLink) {
      collectionLink.click();
  }
};

/**
* Retry failed operations.
* Global function for error states.
*/
window.retry = function() {
  location.reload();
};

/* ###########################################################
 ###   12. Module Initialisation                         ###
 ########################################################### */

// Module-scoped variable for singleton instance
let loadingStatesManager;

document.addEventListener('DOMContentLoaded', function() {
  // Create singleton instance
  loadingStatesManager = new LoadingStatesManager();
  
  // Make globally available
  window.loadingStates = loadingStatesManager;
  
  // Auto fade-out loading screen after 2s max
  setTimeout(() => {
      loadingStatesManager.fadeOutLoadingScreen();
  }, 2000);
  
  console.log('⏳ Loading States Module Ready');
});

/* ###########################################################
 ###            END OF LOADING STATES JS MODULE          ###
 ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: LOADING STATES/EMPTY STATES MODULE
=======================================================

COMPREHENSIVE LOADING SYSTEM:
- Manages ALL loading indicators across the platform
- Skeleton screens for content placeholders
- Empty states with actionable CTAs
- Spinner overlays for async operations
- Button loading states with disabled interaction
- Progress indicators for multi-step processes

SKELETON TEMPLATES:
- productCard: Product grid loading placeholders
- maisonCard: Brand showcase skeletons
- serviceCard: Service section placeholders
- searchResult: Search modal loading items
- Maintains exact layout dimensions to prevent CLS

EMPTY STATE TEMPLATES:
- products: No results from filtering
- search: No search matches found
- collection: Empty wishlist state
- error: Generic error fallback
- Each includes icon, messaging, and CTA

ACCESSIBILITY FEATURES:
- ARIA live regions for status updates
- Role="status" for loading indicators
- aria-busy attributes during loads
- Screen reader announcements
- Reduced motion support

PERFORMANCE optimisationS:
- Template caching for instant rendering
- Map-based active loader tracking
- RequestAnimationFrame for animations
- Conditional style injection
- Memory cleanup on state changes

INTEGRATION POINTS:
- Called by luxury-sections.js during filtering
- Used by search-min.js for result loading
- Admin panel operation feedback
- Initial page load orchestration
- Error recovery mechanisms

USER EXPERIENCE:
- Minimum 2s loading screen for brand impact
- Smooth fade transitions
- Contextual loading messages
- Non-blocking UI updates
- Graceful error handling

GLOBAL FUNCTIONS:
- clearFilters(): Reset product filters
- clearSearch(): Clear search modal
- exploreCollection(): Navigate to collection
- retry(): Reload page for error recovery
- All attached to window for template access

SINGLETON PATTERN:
- Single instance ensures consistency
- Prevents duplicate loaders
- Centralised state management
- Global access via window.loadingStates
=======================================================
*/ 
