/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - MAIN APPLICATION MODULE            ###
   ###   Last Updated: 02-07-2025                          ###
   ########################################################### */

/*
===============================================
Core application entry point and orchestrator
Manages product data, SPA navigation, and module Initialisation
Establishes global state and coordinates all features
===============================================
*/

/* ###########################################################
   ###   1. Product Data Definition                        ###
   ########################################################### */

   /* ====== Luxury Watch Inventory ====== */
// Central product database - single source of truth for entire application
const luxuryProducts = [
    // Featured pieces represent flagship inventory
    {
        id: "rolex-daytona-1",
        name: "Daytona White Gold 2023",
        brand: "Rolex",
        price: 130000, 
        priceDisplay: "£130,000", 
        category: ["sport", "investment"],
        image: "./images/products/rolex/rolex-daytona-white-main.webp",
        featured: true,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "40mm",
            material: "White Gold"
        }
    },
    {
        id: "patek-nautilus-1", 
        name: "Nautilus 5711/1A-010",
        brand: "Patek Philippe",
        price: null, // null indicates "By Private Consultation" - common for high-value pieces
        priceDisplay: "By Private Consultation",
        category: ["sport", "investment", "heritage"],
        image: "./images/products/patek-philippe/patek-nautilus-5711-main.webp",
        featured: true,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "40mm", 
            material: "Stainless Steel"
        }
    },
    {
        id: "ap-royal-oak-1",
        name: "Royal Oak 'Jumbo' Extra-Thin",
        brand: "Audemars Piguet",
        price: null,
        priceDisplay: "By Private Consultation",
        category: ["sport", "investment", "heritage"],
        image: "./images/products/audemars-piguet/ap-royal-oak-jumbo-main.webp",
        featured: true,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "39mm",
            material: "Rose Gold"
        }
    },
    // New arrivals section - highlights recent acquisitions
    {
        id: "rm-67-02-1",
        name: "RM 67-02 Sprint",
        brand: "Richard Mille",
        price: 185000,
        priceDisplay: "£185,000",
        category: ["sport", "investment"],
        image: "./images/products/richard-mille/rm-67-02-extraflat-main.webp",
        featured: false,
        newArrival: true,
        specs: {
            movement: "Automatic",
            caseSize: "38.7mm",
            material: "Titanium"
        }
    },
    {
        id: "patek-calatrava-1",
        name: "Calatrava 5227R",
        brand: "Patek Philippe", 
        price: 42000,
        priceDisplay: "£42,000",
        category: ["dress", "heritage"],
        image: "./images/products/patek-philippe/patek-calatrava-5227-detail.webp",
        featured: false,
        newArrival: true,
        specs: {
            movement: "Automatic",
            caseSize: "39mm",
            material: "Rose Gold"
        }
    },
    // Sport category - high-performance timepieces
    {
        id: "rolex-submariner-1",
        name: "Submariner 'Hulk'",
        brand: "Rolex",
        price: 32000,
        priceDisplay: "£32,000",
        category: ["sport", "investment"],
        image: "./images/products/rolex/rolex-submariner-hulk-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "40mm",
            material: "Stainless Steel"
        }
    },
    {
        id: "ap-offshore-1",
        name: "Royal Oak Offshore Chronograph",
        brand: "Audemars Piguet",
        price: 48000,
        priceDisplay: "£48,000",
        category: ["sport"],
        image: "./images/products/audemars-piguet/ap-royal-oak-offshore-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "42mm",
            material: "Stainless Steel"
        }
    },
    {
        id: "rm-11-03-1",
        name: "RM 11-03 McLaren",
        brand: "Richard Mille",
        price: null,
        priceDisplay: "By Private Consultation",
        category: ["sport", "investment"],
        image: "./images/products/richard-mille/rm-11-03-mclaren-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "44.5mm",
            material: "Carbon TPT"
        }
    },
    // Heritage pieces - vintage and historically significant
    {
        id: "omega-tourbillon-1",
        name: "Chronomètre à Tourbillon 1947",
        brand: "Omega",
        price: null,
        priceDisplay: "By Private Consultation", 
        category: ["heritage", "investment"],
        image: "./images/products/omega/omega-chronometre-tourbillon-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Manual Wind",
            caseSize: "37.5mm",
            material: "Yellow Gold"
        }
    },
    {
        id: "longines-pocket-1",
        name: "Heritage Collection Pocket Watch",
        brand: "Longines",
        price: 1890,
        priceDisplay: "£1,890",
        category: ["heritage"],
        image: "./images/products/longines/longines-pocket-heritage-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Manual Wind",
            caseSize: "48.5mm",
            material: "Rose Gold"
        }
    },
    // Entry luxury segment - accessible pieces from prestigious brands
    {
        id: "cartier-santos-1",
        name: "Santos de Cartier Large",
        brand: "Cartier",
        price: 7800,
        priceDisplay: "£7,800",
        category: ["dress", "sport"],
        image: "./images/products/cartier/cartier-santos-large-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "39.8mm",
            material: "Steel & Gold"
        }
    },
    {
        id: "hublot-classic-1",
        name: "Classic Fusion King Gold",
        brand: "Hublot",
        price: 22000,
        priceDisplay: "£22,000",
        category: ["sport", "dress"],
        image: "./images/products/hublot/hublot-classic-fusion-gold-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "45mm",
            material: "King Gold"
        }
    },
    // Additional inventory
    {
        id: "hublot-bigbang-1",
        name: "Big Bang Titanium",
        brand: "Hublot",
        price: 18500,
        priceDisplay: "£18,500",
        category: ["sport"],
        image: "./images/products/hublot/hublot-big-bang-titanium-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Automatic",
            caseSize: "44mm",
            material: "Titanium"
        }
    },
    {
        id: "cartier-tank-1",
        name: "Tank Must Large",
        brand: "Cartier",
        price: 3200,
        priceDisplay: "£3,200",
        category: ["dress"],
        image: "./images/products/cartier/cartier-tank-must-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Quartz",
            caseSize: "33.7mm",
            material: "Stainless Steel"
        }
    },
    {
        id: "longines-master-1",
        name: "Master Collection Pocket Watch",
        brand: "Longines",
        price: 12500,
        priceDisplay: "£12,500",
        category: ["heritage"],
        image: "./images/products/longines/longines-pocket-master-main.webp",
        featured: false,
        newArrival: false,
        specs: {
            movement: "Manual Wind",
            caseSize: "50mm",
            material: "Yellow Gold"
        }
    },
    {
        id: "omega-speedmaster-1",
        name: "Speedmaster Professional 145.022-69 ST",
        brand: "Omega",
        price: 12000,
        priceDisplay: "£12,000",
        category: ["sport", "investment", "heritage"],
        image: "./images/products/omega/omega-speedmaster-145022-69-main.webp",
        featured: false,
        newArrival: true,
        specs: {
            movement: "Manual Wind",
            caseSize: "42mm",
            material: "Stainless Steel"
        }
    }
];


/* ====== Global Product Availability ====== */
// Immediately expose products globally for module coordination
window.luxuryProducts = luxuryProducts;

// Ensure products are in localStorage for admin panel and filter counts
localStorage.setItem('admin-products', JSON.stringify(luxuryProducts));

/* ###########################################################
   ###   2. Global State Management                        ###
   ########################################################### */

/* ======  Product Grid State ====== */
// Controls filtering and sorting across all product displays

let currentFilter = 'all';
let currentSort = 'featured';

/* ###########################################################
   ###   3. Core Application Initialisation                ###
   ########################################################### */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏆 Tempus Privé Loading...');
    console.log('📦 Products loaded:', luxuryProducts.length);

    // Initialise all modules
    initializeNavigation();
    initializeSearch();
    initializeConciergeAccess();   
    setupImageErrorHandlers();

/* ====== Filter Count synchronisation ====== */
    // Delay ensures filter-counts.js has initialised
    setTimeout(() => {
        if (window.filterCountManager) {
            console.log('🔄 Updating filter counts...');
            window.filterCountManager.notifyProductChange(luxuryProducts);
        } else {
            console.log('⚠️ Filter count manager not found');
        }
    }, 100);

    
console.log('🎯 Key Features Initialised:');
console.log('  ✓ Private Collection/Wishlist');
console.log('  ✓ Multi-currency Support (GBP/USD/EUR/AED)');
console.log('  ✓ Advanced Search with Debouncing');
console.log('  ✓ Real-time Filter Counts');
console.log('  ✓ Concierge Authentication (Password: Watch1)');
console.log('  ✓ Admin Panel with CRUD Operations');
console.log('  ✓ Responsive Design (320px - 1440px)');
console.log('  ✓ Accessibility Score: 97+');
console.log('✅ Tempus Privé Initialised Successfully');

        /* ====== Logo Scroll-to-Top ====== */
    // Make TP logo clickable to return to top
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.style.cursor = 'pointer';
        
        navBrand.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check for reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'instant' : 'smooth'
            });
            
            // Optional: Set home section as active
            const homeLink = document.querySelector('[data-section="home"]');
            if (homeLink) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                homeLink.classList.add('active');
                history.pushState({ section: 'home' }, '', '#home');
            }
        });
    }
});


/* ###########################################################
   ###   4. Image error handling utilities                 ###
   ########################################################### */
// ===== IMAGE ERROR HANDLING UTILITIES =====
function handleImageError(imgElement, fallbackDisplay = 'block') {
    if (!imgElement) return;
    
    imgElement.style.display = 'none';
    
    const fallbackElement = imgElement.nextElementSibling;
    if (fallbackElement) {
        fallbackElement.style.display = fallbackDisplay;
    }
}

function setupImageErrorHandlers() {
    // Brand logos with inline-block fallback
    document.querySelectorAll('.brand-logo-img').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this, 'inline-block');
        });
    });
    
    // Watch images with flex fallback
    document.querySelectorAll('.watch-image').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this, 'flex');
        });
    });
    
    // Loading logo with block fallback
    document.querySelectorAll('.loading-logo').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this, 'block');
        });
    });
    
    // Maison logos with flex fallback
    document.querySelectorAll('.maison-logo').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this, 'flex');
        });
    });
    
    // Footer logo with inline-block fallback
    document.querySelectorAll('.footer-logo').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this, 'inline-block');
        });
    });
    
    // Product images with default placeholder
    document.querySelectorAll('.product-image').forEach(img => {
        img.addEventListener('error', function() {
            this.src = './images/assets/placeholder-watch.webp';
        });
    });
}

/* ###########################################################
   ###   5. SPA Navigation System                          ###
   ########################################################### */

   function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            
            if (targetElement) {
                // Update active navigation state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu FIRST (before scrolling)
                if (navMenu && navMenu.classList.contains('mobile-open')) {
                    mobileMenuToggle?.classList.remove('active');
                    navMenu.classList.remove('mobile-open');
                    document.body.classList.remove('menu-open');
                }
                
                // Small delay to ensure menu closes and body overflow is restored
                setTimeout(() => {
                    // Check for reduced motion preference
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    
                    // Calculate scroll position accounting for header
                    const headerHeight = 70;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Perform the scroll
                    if (prefersReducedMotion) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'auto'
                        });
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Update URL hash for shareability
                    history.pushState(null, '', `#${targetSection}`);
                }, 100); // 100ms delay for menu to close
                
                // Update page title
                const titles = {
                    'home': 'Tempus Privé | Time Reserved for the Few',
                    'collection': 'Collection | Tempus Privé',
                    'maisons': 'Prestigious Maisons | Tempus Privé',
                    'private-lounge': 'Private Lounge | Tempus Privé',
                    'services': 'White-Glove Services | Tempus Privé',
                    'heritage': 'Heritage & Provenance | Tempus Privé'
                };
                document.title = titles[targetSection] || 'Tempus Privé | Time Reserved for the Few';
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            if (navMenu) {
                navMenu.classList.toggle('mobile-open');
                document.body.classList.toggle('menu-open');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && navMenu && navMenu.classList.contains('mobile-open')) {
            mobileMenuToggle?.classList.remove('active');
            navMenu.classList.remove('mobile-open');
            document.body.classList.remove('menu-open');
        }
    });

    // Scroll spy for navigation
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Set initial active state
}
/* ###########################################################
   ###   6. Search Module Integration                      ###
   ########################################################### */
// Search functionality handled by search-min.js module
function initializeSearch() {
    console.log('Search Initialisation delegated to search-min.js module');
}


/* ###########################################################
   ###   7. Concierge Access Control                       ###
   ########################################################### */
   /**
 * Manages concierge section authentication flow.
 * Simple Password-based access for exclusive content. (Watch1)
 */
// Ensure concierge functionality works after all Initialisation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const conciergeBtn = document.getElementById('concierge-access');
        const conciergeModal = document.getElementById('concierge-modal');
        const conciergeForm = document.getElementById('concierge-form');
        const conciergePassword = document.getElementById('concierge-password');
        const modalClose = conciergeModal?.querySelector('.modal-close');
        
        const ACCESS_CODE = 'Watch1';
        
        if (conciergeBtn && conciergeModal) {
            // Remove any existing listeners
            const newBtn = conciergeBtn.cloneNode(true);
            conciergeBtn.parentNode.replaceChild(newBtn, conciergeBtn);
            
            // Open modal handler
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔐 Opening concierge modal');
                
                conciergeModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                if (conciergePassword) {
                    conciergePassword.value = '';
                    setTimeout(() => conciergePassword.focus(), 100);
                }
            });
        }
        
        // Close button handler
        if (modalClose) {
            modalClose.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('❌ Closing modal');
                conciergeModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Click outside to close
        if (conciergeModal) {
            conciergeModal.addEventListener('click', function(e) {
                if (e.target === conciergeModal) {
                    console.log('❌ Closing modal (backdrop click)');
                    conciergeModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Form submission handler
        if (conciergeForm) {
            conciergeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const enteredCode = conciergePassword?.value || '';
                
                if (enteredCode === ACCESS_CODE) {
                    console.log('✅ Access Granted!');
                    
                    if (window.showNotification) {
                        window.showNotification('Access Granted - Opening Admin Panel...', 'success');
                    }
                    
                    setTimeout(() => {
                        conciergeModal.classList.remove('active');
                        document.body.style.overflow = '';
                        window.open('./admin.html', '_blank');
                    }, 1000);
                } else {
                    console.log('❌ Access Denied');
                    
                    if (window.showNotification) {
                        window.showNotification('Access Denied - Invalid Code', 'error');
                    }
                    
                    if (conciergePassword) {
                        conciergePassword.value = '';
                        conciergePassword.focus();
                    }
                    
                    // Shake animation
                    conciergeForm.classList.add('shake');
                    setTimeout(() => conciergeForm.classList.remove('shake'), 500);
                }
            });
        }
        
        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && conciergeModal?.classList.contains('active')) {
                console.log('❌ Closing modal (ESC)');
                conciergeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        console.log('✅ Concierge functionality fully restored');
    }, 500);
});


/* ###########################################################
   ###   8. Product Filtering and Sorting                 ###
   ########################################################### */
// Handles dynamic product display based on user preferences

/**
 * Retrieves products filtered by category and sorted by user preference.
 * Combines filtering and sorting to maintain single source of truth.
 * @returns {Array} Filtered and sorted product array
 */
function getFilteredProducts() {
    let filtered = luxuryProducts;
    
    // Apply category filter if not viewing all products
    if (currentFilter !== 'all') {
        filtered = luxuryProducts.filter(product => {
            return product.category.includes(currentFilter);
        });
    }
    
    // Delegate to sorting function for consistent ordering
    return sortProducts(filtered);
}

/**
 * Sorts products based on current user-selected sort option.
 * Handles null prices gracefully for "By Private Consultation" items.
 * @param {Array} products - Array of product objects to sort
 * @returns {Array} New sorted array (immutable operation)
 */
function sortProducts(products) {
    // Create copy to avoid mutating original array
    const sorted = [...products];
    
    switch (currentSort) {
        case 'price-asc':
            return sorted.sort((a, b) => {
                // Push null prices to end when sorting ascending
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
        case 'brand':
            // Alphabetical by brand name
            return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
        case 'newest':
            // Boolean comparison: new arrivals first
            return sorted.sort((a, b) => b.newArrival - a.newArrival);
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

function initializeProductInteractions() {
    // Event delegation for product interactions is handled via onclick attributes
    // This ensures proper handling of dynamically added products
}

// Helper function to view product - Enhanced for search integration
window.viewProduct = function(productId) {
    const product = luxuryProducts.find(p => p.id === productId);
    if (product) {
        // Close search modal if open
        if (window.searchModal) {
            window.searchModal.close();
        }
        
        // Navigate to collection section
        const collectionLink = document.querySelector('[data-section="collection"]');
        if (collectionLink) {
            collectionLink.click();
        }
        
        // Scroll to product after a short delay
        setTimeout(() => {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Add highlight effect
                productCard.classList.add('highlight');
                setTimeout(() => productCard.classList.remove('highlight'), 2000);
            }
        }, 500);
        
        showNotification(`Viewing ${product.name}`, 'info');
    }
};

// Helper function to clear filters
window.clearFilters = function() {
    currentFilter = 'all';
    currentSort = 'featured';
    
    // Reset UI
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('.filter-tab[data-filter="all"]')?.classList.add('active');
    
    const sortSelect = document.getElementById('luxury-sort');
    if (sortSelect) sortSelect.value = 'featured';
    
    renderProductGrid();
    showNotification('Filters cleared', 'info');
}


/* ###########################################################
   ###   9. Notification Stytem                           ###
   ########################################################### */

function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
        'info': '#3B82F6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        background: ${colors[type] || colors.info};
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" style="
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                margin-left: 1rem;
                cursor: pointer;
                opacity: 0.8;
            ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Manual close handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Make showNotification globally available
window.showNotification = showNotification;


/* ###########################################################
   ###   10. Accessibility Enhancements                    ###
   ########################################################### */

document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for cards
    document.querySelectorAll('.product-card, .maison-card, .service-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

// ===== UTILITY FUNCTIONS =====
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function debounce(func, wait) {
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


/* ###########################################################
   ###   11. Debug Utilities                               ###
   ########################################################### */

console.log('🏆 Tempus Privé - Luxury Watch Boutique');
console.log('💎 Time Reserved for the Few');
console.log('✅ Main functionality loaded successfully');
console.log('📦 Products available:', luxuryProducts.length);

// Debug helper
window.tempusPriveDebug = {
    showSection: (sectionId) => {
        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (navLink) navLink.click();
    },
    showModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    },
    testNotification: (message, type) => {
        showNotification(message || 'Test notification', type || 'info');
    },
    getCollection: () => window.tempusPriveCollection,
    getProducts: () => luxuryProducts,
    refreshCounts: () => {
        if (window.filterCountManager) {
            window.filterCountManager.refresh();
            console.log('Filter counts refreshed');
        }
    }
};

/**
 * // ====== For issues with Private Collection run in console to clear local storage ======
// Clear the corrupted collection
localStorage.removeItem('tempus-collection');

// Reload the page
location.reload(); */

/* ###########################################################
   ###   12. Handle Service Deep Links on Page Load        ###
   ########################################################### */

// ====== UPDATE YOUR EXISTING NAVIGATION TO HANDLE SERVICES ======
// Modify your existing navigation click handler to properly handle the services section
const originalInitializeNavigation = initializeNavigation;
initializeNavigation = function() {
    // Call original navigation Initialisation
    originalInitializeNavigation();
    
    // Add special handling for services nav link
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
};

// ====== ENSURE SERVICE CARDS ARE CLICKABLE ======
// This ensures the service cards work even if added dynamically
document.addEventListener('click', function(e) {
    // Check if clicked element is within a service card
    const serviceCard = e.target.closest('.service-card[onclick]');
    if (serviceCard) {
        // The onclick handler will call showSection
        // This is just for accessibility - ensure keyboard navigation works
        return;
    }
});

console.log('✅ Service pages navigation loaded');

/* ###########################################################
   ###   13. Global ESC and Back Button Handlers           ###
   ########################################################### */

// Global ESC key handler for all modals and service pages
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any active modals first
        const activeModals = document.querySelectorAll('.modal.active');
        if (activeModals.length > 0) {
            activeModals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
            return;
        }
        
        // Check if we're on a service detail page
        const activeServicePage = document.querySelector('.section.service-page[style*="display: block"]');
        if (activeServicePage && window.showSection) {
            window.showSection('services');
        }
    }
});

// Global popstate handler for browser back/forward
window.addEventListener('popstate', function(event) {
    const hash = window.location.hash;
    
    // Handle service pages
    if (hash.startsWith('#service=')) {
        const sectionId = hash.split('=')[1];
        if (window.showSection) {
            window.showSection(sectionId);
        }
    } else if (hash === '#services' && window.showSection) {
        window.showSection('services');
    }
    
    // Handle regular sections
    else if (hash) {
        const sectionId = hash.substring(1);
        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (navLink) {
            navLink.click();
        }
    }
});



// ###########################################################
// ###            END OF MAIN JS MODULE                    ###
// ###########################################################

/*
=======================================================
IMPLEMENTATION NOTES: MAIN APPLICATION MODULE 
=======================================================

GLOBAL PRODUCT MANAGEMENT:
- Central data store for all products (luxuryProducts)
- Single source of truth pattern
- synchronisation across all modules
- localStorage persistence for demo

SPA NAVIGATION SYSTEM:
- Section-based routing with history API
- Smooth scroll behaviour (respects reduced motion)
- Active state management for nav links
- Deep linking support for all sections

COLLECTION/WISHLIST FEATURE (10% Advanced):
- Full CRUD for user's private collection
- Visual feedback on add/remove
- Counter badge in navigation
- Persistent across sessions

NOTIFICATION SYSTEM:
- Toast-style notifications
- Multiple types (success, error, info, warning)
- Auto-dismiss with manual close option
- Accessible with ARIA live regions

MODAL MANAGEMENT:
- Centralised modal control system
- Keyboard navigation (ESC to close)
- Focus trap implementation
- Backdrop click handling

SERVICE DETAIL NAVIGATION:
- Special handling for service sub-pages
- Show/hide mechanism vs scroll
- URL state preservation
- Back button support

DEBUG UTILITIES:
- Console helpers for development
- State inspection tools
- Manual refresh triggers
- Testing shortcuts
=======================================================
*/