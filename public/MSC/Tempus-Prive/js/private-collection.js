/* ###########################################################
   ###  2418521	 	   Antony O'Neill                      ###
   ###  TEMPUS PRIVÉ - PRIVATE COLLECTION MODULE           ###
   ###  Last Updated: 02-07-2025                           ###
   ########################################################### */

/*
===============================================
Wishlist functionality with localStorage persistence
Heart animations and modal management
===============================================
*/


/* ###########################################################
   ###  1. Private Collection Manager Class                ###
   ########################################################### */

/**
 * Manages user's private collection of saved timepieces.
 * Handles persistence, UI updates, and modal interactions.
 * @class PrivateCollectionManager
 */
class PrivateCollectionManager {
    /**
     * Initializes collection manager with storage and UI references.
     */
    constructor() {
        // ====== Storage Configuration ======
        this.STORAGE_KEY = 'tempus-collection';
        this.collection = [];
        
        // ====== UI References ======
        this.modal = null;
        this.collectionBtn = null;
        this.collectionCount = null;
        this.isInitialized = false;
        
        // Wait for DOM before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /* ###########################################################
       ###  2. Initialization Methods                          ###
       ########################################################### */

    /**
     * Initializes UI elements and event listeners.
     * Guards against multiple initialization.
     */
    init() {
        if (this.isInitialized) return;
        
        // Get UI elements
        this.refreshUIReferences();
        
        // Load collection from storage
        this.loadCollection();
        
        // Set up event listeners
        this.initializeEventListeners();
        
        // Update UI
        this.updateCollectionBadge();
        this.updateAllHeartStates();
        
        this.isInitialized = true;
        console.log('💎 Private Collection Manager Initialized');
    }
    
    /**
     * Refreshes references to UI elements.
     * Useful if DOM has been modified.
     */
    refreshUIReferences() {
        this.modal = document.getElementById('collection-modal');
        this.collectionBtn = document.getElementById('collection-btn');
        this.collectionCount = document.getElementById('collection-count');
        
        // Re-attach collection button handler if needed
        if (this.collectionBtn && this._handleCollectionClick) {
            // Check if handler is already attached
            if (!this.collectionBtn._collectionHandlerAttached) {
                this.collectionBtn.addEventListener('click', this._handleCollectionClick);
                this.collectionBtn._collectionHandlerAttached = true;
            }
        }
    }
    
    /**
     * Reinitializes event listeners if they've been lost.
     * Useful after DOM updates or navigation changes.
     */
    reinitializeEventListeners() {
        console.log('Reinitializing event listeners...');
        
        // Remove any existing handler
        if (this.collectionBtn && this._handleCollectionClick) {
            this.collectionBtn.removeEventListener('click', this._handleCollectionClick);
            this.collectionBtn._collectionHandlerAttached = false;
        }
        
        // Re-setup all event listeners
        this.initializeEventListeners();
    }

    /**
     * Sets up all event listeners for collection interactions.
     */
    initializeEventListeners() {
        // ====== Collection Button in Header ======
        // Use a named function so we can reference it later
        const handleCollectionClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Collection button clicked');
            this.openModal();
        };
        
        // Store the handler reference
        this._handleCollectionClick = handleCollectionClick;
        
        if (this.collectionBtn) {
            this.collectionBtn.addEventListener('click', handleCollectionClick);
            this.collectionBtn._collectionHandlerAttached = true;
        }

        // ====== Heart Button Delegation ======
        document.addEventListener('click', (e) => {
            // Handle heart button clicks
            const heartBtn = e.target.closest('.btn-add-collection');
            if (heartBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find product ID from parent card
                const card = heartBtn.closest('[data-product-id], [data-watch-id]');
                const watchId = card?.dataset.productId || card?.dataset.watchId;
                
                if (watchId) {
                    this.toggle(watchId);
                }
            }
            
            // Handle remove button in collection modal
            if (e.target.classList.contains('btn-remove') || e.target.closest('.btn-remove')) {
                const btn = e.target.classList.contains('btn-remove') ? e.target : e.target.closest('.btn-remove');
                const productId = btn.getAttribute('data-product-id');
                if (productId) {
                    this.remove(productId);
                }
            }
        });

        // ====== Modal Close Handlers ======
        if (this.modal) {
            // Handle close button and backdrop clicks
            this.modal.addEventListener('click', (e) => {
                // Close button click
                if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                    e.preventDefault();
                    this.closeModal();
                }
                
                // Backdrop click (only if clicking the modal itself, not its contents)
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // ====== Keyboard Navigation ======
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    /* ###########################################################
       ###  3. Data Persistence Layer                          ###
       ########################################################### */

    /**
     * Loads collection from localStorage with error handling.
     */
    loadCollection() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            const rawCollection = stored ? JSON.parse(stored) : [];
            
            // Clean up collection - ensure we only have string IDs
            this.collection = rawCollection.map(item => {
                if (typeof item === 'object' && item.id) {
                    return String(item.id);
                }
                return String(item);
            }).filter(id => id && id !== 'undefined' && id !== 'null');
            
            // Save cleaned collection back
            if (rawCollection.length !== this.collection.length) {
                this.saveCollection();
                console.log('💎 Cleaned up collection, removed invalid entries');
            }
        } catch (error) {
            console.error('Error loading collection:', error);
            this.collection = [];
        }
    }

    /**
     * Saves collection to localStorage with error handling.
     */
    saveCollection() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.collection));
            return true;
        } catch (error) {
            console.error('Error saving collection:', error);
            this.showNotification('Unable to save collection', 'error');
            return false;
        }
    }

    /**
     * Retrieves product data by ID from available sources.
     * @param {string} watchId - Product ID to retrieve
     * @returns {Object|null} Product data or null if not found
     */
    getProductData(watchId) {
        // Validate input
        if (!watchId || typeof watchId !== 'string') {
            console.warn(`Invalid product ID: ${watchId}`);
            return null;
        }
        
        // Check global luxuryProducts array first (this is the primary source)
        if (window.luxuryProducts && Array.isArray(window.luxuryProducts)) {
            const product = window.luxuryProducts.find(p => p.id === watchId);
            if (product) return product;
        }
        
        // Fallback: Check admin products in localStorage
        try {
            const adminProducts = localStorage.getItem('admin-products');
            if (adminProducts) {
                const products = JSON.parse(adminProducts);
                const product = products.find(p => p.id === watchId);
                if (product) return product;
            }
        } catch (error) {
            console.error('Error loading product from storage:', error);
        }
        
        console.warn(`Product not found: ${watchId}`);
        return null;
    }

    /* ###########################################################
       ###  4. Collection Management Methods                   ###
       ########################################################### */

    /**
     * Returns copy of collection array.
     */
    getAll() {
        return [...this.collection];
    }

    /**
     * Checks if watch exists in collection.
     */
    exists(watchId) {
        // Ensure we're comparing string IDs
        const id = typeof watchId === 'object' && watchId.id ? watchId.id : String(watchId);
        return this.collection.includes(id);
    }

    /**
     * Toggles watch in/out of collection.
     */
    toggle(watchId) {
        // Ensure we're working with a string ID
        const id = typeof watchId === 'object' && watchId.id ? watchId.id : String(watchId);
        const exists = this.exists(id);
        
        if (exists) {
            this.remove(id);
        } else {
            this.add(id);
        }
        
        return !exists; // Return new state
    }

    /**
     * Adds watch to collection with UI feedback.
     */
    add(watchId) {
        // Ensure we're working with a string ID, not an object
        const id = typeof watchId === 'object' && watchId.id ? watchId.id : String(watchId);
        
        if (!this.exists(id)) {
            this.collection.push(id);
            this.saveCollection();
            this.updateCollectionBadge();
            this.updateHeartState(id, true);
            this.showNotification('Added to Private Collection', 'success');
            console.log(`💎 Added to Private Collection: ${id} | Total items: ${this.collection.length}`);
            
            // If modal is open, re-render it
            if (this.modal?.classList.contains('active')) {
                this.renderCollection();
            }
            
            return true;
        } else {
            this.showNotification('Already in your collection', 'info');
            return false;
        }
    }
    
    /**
     * Removes watch from collection with UI feedback.
     */
    remove(watchId) {
        // Ensure we're working with a string ID
        const id = typeof watchId === 'object' && watchId.id ? watchId.id : String(watchId);
        const index = this.collection.indexOf(id);
        
        if (index > -1) {
            this.collection.splice(index, 1);
            this.saveCollection();
            this.updateCollectionBadge();
            this.updateHeartState(id, false);
            this.showNotification('Removed from Private Collection', 'info');
            
            // Console log
            console.log(`🗑️ Removed from Private Collection: ${id} | Total items: ${this.collection.length}`);
            
            // If modal is open, re-render it
            if (this.modal?.classList.contains('active')) {
                this.renderCollection();
            }
            
            return true;
        }
        
        return false;
    }
    /**
     * Clears entire collection with confirmation.
     */
    clear() {
        if (this.collection.length === 0) return;
        
        if (confirm('Are you sure you want to clear your entire collection?')) {
            // Only process valid string IDs
            const oldCollection = this.collection.filter(id => 
                typeof id === 'string' && id !== 'undefined' && id !== 'null'
            );
            
            this.collection = [];
            this.saveCollection();
            this.updateCollectionBadge();
            
            // Update all heart states
            oldCollection.forEach(watchId => {
                this.updateHeartState(watchId, false);
            });
            
            this.showNotification('Collection cleared', 'info');
            
            // If modal is open, re-render it
            if (this.modal?.classList.contains('active')) {
                this.renderCollection();
            }
        }
    }

    /* ###########################################################
       ###  5. UI Update Methods                              ###
       ########################################################### */

    /**
     * Updates collection count badge in header.
     */
    updateCollectionBadge() {
        if (this.collectionCount) {
            this.collectionCount.textContent = this.collection.length;
            this.collectionCount.style.display = this.collection.length > 0 ? 'block' : 'none';
        }
    }

    /**
     * Updates heart icon state for specific watch.
     */
    updateHeartState(watchId, isInCollection) {
        // Ensure we're working with a string ID
        const id = typeof watchId === 'object' && watchId.id ? watchId.id : String(watchId);
        const cards = document.querySelectorAll(`[data-product-id="${id}"], [data-watch-id="${id}"]`);
        
        cards.forEach(card => {
            const heartBtn = card.querySelector('.btn-add-collection');
            if (heartBtn) {
                if (isInCollection) {
                    heartBtn.classList.add('in-collection');
                    heartBtn.setAttribute('title', 'Remove from collection');
                    
                    // Fill the heart icon
                    const svg = heartBtn.querySelector('svg');
                    if (svg) {
                        svg.setAttribute('fill', 'currentColor');
                    }
                } else {
                    heartBtn.classList.remove('in-collection');
                    heartBtn.setAttribute('title', 'Add to collection');
                    
                    // Unfill the heart icon
                    const svg = heartBtn.querySelector('svg');
                    if (svg) {
                        svg.setAttribute('fill', 'none');
                    }
                }
            }
        });
    }

    /**
     * Updates all heart states on page.
     */
    updateAllHeartStates() {
        // Clean collection first to ensure we only have valid string IDs
        const validIds = this.collection.filter(id => 
            typeof id === 'string' && id !== 'undefined' && id !== 'null'
        );
        
        validIds.forEach(watchId => {
            this.updateHeartState(watchId, true);
        });
    }

    /* ###########################################################
       ###  6. Modal Management Methods                        ###
       ########################################################### */

    /**
     * Opens collection modal and renders content.
     */
    openModal() {
        // Refresh UI references in case DOM has changed
        this.refreshUIReferences();
        
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }
        
        console.log('Opening collection modal');
        
        // Add active class to show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Render collection content
        this.renderCollection();
        
        // Focus management for accessibility
        setTimeout(() => {
            const firstFocusable = this.modal.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }

    /**
     * Closes collection modal.
     */
    closeModal() {
        // Refresh UI references in case DOM has changed
        this.refreshUIReferences();
        
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }
        
        console.log('Closing collection modal');
        
        // Remove active class to hide modal
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to collection button
        if (this.collectionBtn) {
            this.collectionBtn.focus();
        }
    }

    /**
     * Renders collection items in modal.
     */
    renderCollection() {
        const container = document.getElementById('collection-items');
        if (!container) return;
        
        if (this.collection.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }
        
        // Clean up any remaining object entries
        const validIds = this.collection.filter(id => 
            typeof id === 'string' && id !== 'undefined' && id !== 'null'
        );
        
        // Get product data for each item in collection
        const collectionProducts = validIds
            .map(id => this.getProductData(id))
            .filter(Boolean);
        
        if (collectionProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚠️</div>
                    <h3>Unable to load collection</h3>
                    <p>Please refresh the page to load product data.</p>
                </div>
            `;
            return;
        }
        
        // Render the collection items
        container.innerHTML = collectionProducts.map(product => {
            // Use the appropriate price display based on product structure
            const price = this.formatPrice(product);
            
            return `
                <div class="collection-item" data-product-id="${product.id}">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="collection-item-image"
                         onerror="this.src='./images/assets/placeholder-watch.png'">
                    <div class="collection-item-info">
                        <div class="collection-item-brand">${product.brand}</div>
                        <div class="collection-item-name">${product.name}</div>
                        <div class="collection-item-price" data-price-gbp="${product.price || ''}">${price}</div>
                    </div>
                    <button class="btn-remove" 
                            data-product-id="${product.id}"
                            aria-label="Remove ${product.name} from collection">
                        Remove
                    </button>
                </div>
            `;
        }).join('');
    }

    /**
     * Formats product price for display.
     * Handles different price structures from feature-testing-suite format.
     */
    formatPrice(product) {
        // Handle feature-testing-suite price structure
        if (product.price && typeof product.price === 'object') {
            if (product.price.display) {
                return product.price.display;
            }
            if (product.price.amount) {
                return `£${product.price.amount.toLocaleString()}`;
            }
        }
        
        // Handle simpler price structure
        if (product.priceDisplay) {
            return product.priceDisplay;
        }
        
        if (product.price && typeof product.price === 'number') {
            return `£${product.price.toLocaleString()}`;
        }
        
        return "By Private Consultation";
    }

    /**
     * Generates HTML for empty collection state.
     */
    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-icon">💎</div>
                <h3>Your collection is empty</h3>
                <p>Add timepieces to create your private collection</p>
                <button class="btn-primary" onclick="tempusPriveCollection.closeModal(); document.querySelector('[data-section=\\'collection\\']')?.click();">
                    Explore Collection
                </button>
            </div>
        `;
    }

    /* ###########################################################
       ###  7. Notification Methods                            ###
       ########################################################### */

    /**
     * Shows notification to user.
     */
    showNotification(message, type = 'info') {
        // Check if global notification function exists
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Otherwise create our own notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} show`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            transform: translateX(0);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(calc(100% + 20px))';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /* ###########################################################
       ###  8. Public API Methods                              ###
       ########################################################### */

    /**
     * Gets current collection size.
     */
    get size() {
        return this.collection.length;
    }

    /**
     * Gets collection items array.
     */
    get items() {
        return this.getAll();
    }
}

/* ###########################################################
   ###  9. Global Instance and API                         ###
   ########################################################### */

// Create singleton instance
const collectionInstance = new PrivateCollectionManager();

// Expose the instance globally with bound methods
window.tempusPriveCollection = {
    add: (id) => collectionInstance.add(id),
    remove: (id) => collectionInstance.remove(id),
    toggle: (id) => collectionInstance.toggle(id),
    exists: (id) => collectionInstance.exists(id),
    getAll: () => collectionInstance.getAll(),
    get: () => collectionInstance.getAll(), // Alias for compatibility
    has: (id) => collectionInstance.exists(id), // Alias for compatibility
    clear: () => collectionInstance.clear(),
    openModal: () => collectionInstance.openModal(),
    closeModal: () => collectionInstance.closeModal(),
    // Expose size and items as getters
    get size() { return collectionInstance.collection.length; },
    get items() { return collectionInstance.getAll(); }
};

// Make removeFromCollection globally available for onclick handlers
window.removeFromCollection = (watchId) => collectionInstance.remove(watchId);

// Clear any corrupted data on load
setTimeout(() => {
    if (collectionInstance.collection.some(item => typeof item === 'object')) {
        console.log('🔧 Cleaning up corrupted collection data...');
        collectionInstance.loadCollection(); // This will clean up the data
        collectionInstance.updateCollectionBadge();
        collectionInstance.updateAllHeartStates();
    }
    
    // Also ensure the collection button is properly connected
    const btn = document.getElementById('collection-btn');
    if (btn && !btn._directHandlerAttached) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Direct handler: Opening collection');
            window.tempusPriveCollection.openModal();
        });
        btn._directHandlerAttached = true;
    }
}, 100);

console.log('💎 Private Collection Module Loaded - Full Implementation');

/* ###########################################################
   ###        END OF PRIVATE COLLECTION JS MODULE          ###
   ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: PRIVATE COLLECTION MODULE
=======================================================

WISHLIST FUNCTIONALITY:
- Add/remove products
- Duplicate prevention
- Visual feedback
- Counter updates

DATA PERSISTENCE:
- localStorage storage
- JSON serialization
- Error recovery
- Data validation

MODAL INTERFACE:
- Collection display
- Empty state design
- Product cards
- Remove functionality

INTEGRATION:
- Heart button toggles
- Global state sync
- Navigation badge
- Product page support

USER EXPERIENCE:
- Instant feedback
- Smooth animations
- Clear CTAs
- Mobile optimized

ACCESSIBILITY:
- Button states
- Screen reader text
- Focus management
- Keyboard support
=======================================================
*/
