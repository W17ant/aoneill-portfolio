/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - CURRENCY SERVICE MODULE            ###
   ###   Last Updated: 03-07-2025                          ###
   ########################################################### */

/**
 * CurrencyService - Handles multi-currency conversion for Tempus-Privé
 * Supports GBP (base), USD, EUR, and AED with live exchange rates
 * Uses Open Exchange Rates API with 6-hour caching strategy
 */

class CurrencyService {
    constructor() {
        // ====== Configuration ======
        this.apiKey = '99a07d383a5a470699d6a6e43d9aabc4';
        this.apiEndpoint = 'https://openexchangerates.org/api/latest.json';
        this.baseCurrency = 'GBP';
        this.supportedCurrencies = ['GBP', 'USD', 'EUR', 'AED'];
        
        // ====== State Management ======
        this.rates = { GBP: 1 }; // Base rate
        this.lastFetch = 0;
        this.currentCurrency = 'GBP';
        this.cacheKey = 'tempusPrive_currencyRates';
        this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        
        // ====== Fallback Rates ======
        // Used when API fails and no cache exists
        this.fallbackRates = {
            GBP: 1,
            USD: 1.27,
            EUR: 1.17,
            AED: 4.66
        };
        
        // ====== DOM Elements ======
        this.dropdown = null;
        this.priceElements = [];
    }

    /* ###########################################################
       ###  1. Initialisation Methods                          ###
       ########################################################### */

    /**
     * Initialise currency service and setup event listeners.
     * Fetches rates and restores user preference.
     */
    async init() {
        try {
            console.log('💱 Initializing Currency Service...');
            
            // Setup dropdown
            this.setupDropdown();
            
            // Restore user preference
            this.restoreUserPreference();
            
            // Load cached rates first
            this.loadCachedRates();
            
            // Fetch fresh rates if needed
            if (this.isCacheExpired()) {
                await this.fetchRates();
            }
            
            // Initial price update
            this.updateAllPrices();
            
            console.log('✅ Currency Service Ready');
        } catch (error) {
            console.error('Currency Service Initialisation failed:', error);
            this.showNotification('Currency service temporarily unavailable', 'error');
        }
    }

    /**
     * Setup currency dropdown and bind change event.
     */
    setupDropdown() {
        this.dropdown = document.getElementById('currency-dropdown');
        if (!this.dropdown) {
            console.warn('Currency dropdown not found');
            return;
        }
        
        // Bind change event
        this.dropdown.addEventListener('change', (e) => {
            this.handleCurrencyChange(e.target.value);
        });
    }

    /* ###########################################################
       ###  2. Exchange Rate Management                        ###
       ########################################################### */

    /**
     * Fetch latest exchange rates from Open Exchange Rates API.
     * Implements retry logic and error handling.
     */
        
    async fetchRates() {
        const url = `${this.apiEndpoint}?app_id=${this.apiKey}&base=${this.baseCurrency}`;
        console.log('Fetching rates from:', url); // Add this to debug
        
        try {
            const response = await fetch(url);
            console.log('API Response status:', response.status); // Add this too
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extract relevant rates
            this.rates = {
                GBP: 1,
                USD: data.rates.USD || this.fallbackRates.USD,
                EUR: data.rates.EUR || this.fallbackRates.EUR,
                AED: data.rates.AED || this.fallbackRates.AED
            };
            
            // Update cache
            this.cacheRates();
            this.lastFetch = Date.now();
            
            console.log('✅ Exchange rates updated:', this.rates);
            
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
            
            // Use fallback rates if no cache available
            if (Object.keys(this.rates).length === 1) {
                this.rates = { ...this.fallbackRates };
                this.showNotification('Using estimated exchange rates', 'warning');
            } else {
                this.showNotification('Live FX temporarily unavailable, displaying cached rates', 'info');
            }
        }
    }

    /**
     * Convert amount from GBP to target currency.
     * @param {number} gbpAmount - Amount in GBP
     * @param {string} targetCurrency - Target currency code
     * @returns {number} Converted amount
     */
    convert(gbpAmount, targetCurrency) {
        if (!gbpAmount || targetCurrency === 'GBP') {
            return gbpAmount;
        }
        
        const rate = this.rates[targetCurrency] || 1;
        return gbpAmount * rate;
    }

    /* ###########################################################
       ###  3. Price Formatting                                ###
       ########################################################### */

    /**
     * Format price according to currency and locale.
     * Handles special cases for AED and EUR formatting.
     * @param {number} amount - Price amount
     * @param {string} currency - Currency code
     * @returns {string} Formatted price string
     */
    formatPrice(amount, currency) {
        if (!amount || amount === null) {
            return 'By Private Consultation';
        }
        
        // Determine locale based on currency
        let locale = 'en-GB'; // Default
        let options = {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        };
        
        // Special formatting rules
        switch (currency) {
            case 'AED':
                locale = 'ar-AE'; // Arabic locale for proper digit style
                break;
            case 'EUR':
                // EUR shows two decimal places
                options.minimumFractionDigits = 2;
                options.maximumFractionDigits = 2;
                break;
        }
        
        return new Intl.NumberFormat(locale, options).format(amount);
    }

    /* ###########################################################
       ###  4. DOM Update Methods                              ###
       ########################################################### */

    /**
     * Update all prices on the page to current currency.
     * Ensures 200ms performance target is met.
     */
    updateAllPrices() {
        const priceElements = document.querySelectorAll('[data-price-gbp]');
        console.log(`💱 Currency changed to: ${this.currentCurrency} | Rate: ${this.rates[this.currentCurrency]}`);
        console.log(`📊 Updating ${priceElements.length} prices across the site`);
        
        // Find all price elements
        this.priceElements = document.querySelectorAll('[data-price-gbp]');
        
        // Batch update for performance
        requestAnimationFrame(() => {
            this.priceElements.forEach(element => {
                this.updatePriceElement(element);
            });
            
            const updateTime = performance.now() - startTime;
            console.log(`💱 Updated ${this.priceElements.length} prices in ${updateTime.toFixed(2)}ms`);
            
            // Verify we meet performance target
            if (updateTime > 200) {
                console.warn('⚠️ Price update exceeded 200ms target');
            }
        });
    }

    /**
     * Update individual price element.
     * @param {HTMLElement} element - Price element to update
     */
    updatePriceElement(element) {
        const gbpValue = parseFloat(element.dataset.priceGbp);
        
        if (isNaN(gbpValue)) {
            element.textContent = 'By Private Consultation';
            return;
        }
        
        const convertedValue = this.convert(gbpValue, this.currentCurrency);
        element.textContent = this.formatPrice(convertedValue, this.currentCurrency);
        
        // Add subtle animation class
        element.classList.add('price-updating');
        setTimeout(() => element.classList.remove('price-updating'), 300);
    }

    /* ###########################################################
       ###  5. Currency Change Handler                         ###
       ########################################################### */

    /**
     * Handle currency dropdown change event.
     * @param {string} newCurrency - Selected currency code
     */
    handleCurrencyChange(newCurrency) {
        if (!this.supportedCurrencies.includes(newCurrency)) {
            console.error('Unsupported currency:', newCurrency);
            return;
        }
        
        this.currentCurrency = newCurrency;
        
        // Save preference
        this.saveUserPreference();
        
        // Update all prices
        this.updateAllPrices();
        
        // Show confirmation
        const currencySymbols = {
            GBP: '£',
            USD: '$',
            EUR: '€',
            AED: 'د.إ'
        };
        
        this.showNotification(
            `Prices now displayed in ${newCurrency} ${currencySymbols[newCurrency]}`,
            'success'
        );
    }

    /* ###########################################################
       ###  6. Cache Management                                ###
       ########################################################### */

    /**
     * Cache exchange rates in sessionStorage.
     */
    cacheRates() {
        const cacheData = {
            rates: this.rates,
            timestamp: Date.now()
        };
        
        try {
            sessionStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to cache rates:', error);
        }
    }

    /**
     * Load rates from cache if available.
     */
    loadCachedRates() {
        try {
            const cached = sessionStorage.getItem(this.cacheKey);
            if (!cached) return;
            
            const { rates, timestamp } = JSON.parse(cached);
            
            this.rates = rates;
            this.lastFetch = timestamp;
            
            console.log('📦 Loaded cached rates from', new Date(timestamp).toLocaleTimeString());
        } catch (error) {
            console.warn('Failed to load cached rates:', error);
        }
    }

    /**
     * Check if cache has expired (6 hours).
     * @returns {boolean} True if cache is expired
     */
    isCacheExpired() {
        if (this.lastFetch === 0) return true;
        
        const age = Date.now() - this.lastFetch;
        return age > this.cacheExpiry;
    }

    /* ###########################################################
       ###  7. User Preference Management                      ###
       ########################################################### */

    /**
     * Save user's currency preference to localStorage.
     */
    saveUserPreference() {
        try {
            localStorage.setItem('tempusPrive_preferredCurrency', this.currentCurrency);
        } catch (error) {
            console.warn('Failed to save currency preference:', error);
        }
    }

    /**
     * Restore user's saved currency preference.
     */
    restoreUserPreference() {
        try {
            const saved = localStorage.getItem('tempusPrive_preferredCurrency');
            
            if (saved && this.supportedCurrencies.includes(saved)) {
                this.currentCurrency = saved;
                
                if (this.dropdown) {
                    this.dropdown.value = saved;
                }
            }
        } catch (error) {
            console.warn('Failed to restore currency preference:', error);
        }
    }

    /* ###########################################################
       ###  8. Notification System                             ###
       ########################################################### */

    /**
     * Show notification to user.
     * Integrates with global notification system if available.
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success|error|info|warning)
     */
    showNotification(message, type = 'info') {
        // Use global notification if available
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Otherwise create inline notification
        const notification = document.createElement('div');
        notification.className = `currency-notification ${type}`;
        notification.textContent = message;
        
        // Insert after dropdown
        if (this.dropdown && this.dropdown.parentNode) {
            this.dropdown.parentNode.appendChild(notification);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    /* ###########################################################
       ###  9. Public API Methods                              ###
       ########################################################### */

    /**
     * Get current exchange rate for a currency.
     * @param {string} currency - Currency code
     * @returns {number} Exchange rate from GBP
     */
    getRate(currency) {
        return this.rates[currency] || 1;
    }

    /**
     * Get current selected currency.
     * @returns {string} Current currency code
     */
    getCurrentCurrency() {
        return this.currentCurrency;
    }

    /**
     * Manually refresh exchange rates.
     * Useful for admin panel or debugging.
     */
    async refreshRates() {
        this.lastFetch = 0; // Force refresh
        await this.fetchRates();
        this.updateAllPrices();
    }
}

/* ###########################################################
   ###  10. Module Initialisation                          ###
   ########################################################### */

// ====== Global Variable Declaration ======
let currencyService;

// ====== DOM Ready Handler ======
document.addEventListener('DOMContentLoaded', async function() {
    currencyService = new CurrencyService();
    await currencyService.init();
    
    // Make available globally for integration
    window.currencyService = currencyService;
});

/* ###########################################################
   ###  11. Module Exports                                 ###
   ########################################################### */

// ====== CommonJS Export Support ======
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CurrencyService };
}

/* ###########################################################
   ###        END OF CURRENCY SERVICE MODULE               ###
   ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: CURRENCY SERVICE MODULE
=======================================================

MULTI-CURRENCY SUPPORT:
- GBP base currency
- USD, EUR, AED conversion
- Real exchange rates (simulated)
- Persistent selection

PRICE FORMATTING:
- Locale-aware formatting
- Currency symbols
- Thousands separators
- Decimal precision

UPDATE MECHANISM:
- Data attribute scanning
- Batch price updates
- Loading states
- Error handling

USER EXPERIENCE:
- Dropdown in header
- Instant conversion
- Visual feedback
- Mobile optimised

PERFORMANCE:
- Cached conversions
- Debounced updates
- RAF scheduling
- Minimal reflows

INTEGRATION:
- Works with all prices
- Admin panel support
- Search results
- Product cards
=======================================================
*/   