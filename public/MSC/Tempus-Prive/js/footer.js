/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - FOOTER NAVIGATION MODULE           ###
   ###   Last Updated: 30-06-2025                          ###
   ########################################################### */

/*
===============================================
Complete footer navigation functionality
Handles collection filters and section navigation
Replaces footer functionality from main.js
Manages luxury brand footer interactions
===============================================
*/

/* ###########################################################
   ###   1. Module Overview & Dependencies                 ###
   ########################################################### */

// Module operates independently without external dependencies
// Leverages existing DOM elements from index.html
// Integrates with main navigation system from main.js
// Uses global showNotification if available for user feedback

/* ###########################################################
   ###   2. Footer Navigation Initialization               ###
   ########################################################### */

/* ====== DOM Ready Handler ====== */
// Ensures all DOM elements are loaded before initialization
document.addEventListener('DOMContentLoaded', function() {
    
    /* ###########################################################
       ###   3. Collection Filter Links                        ###
       ########################################################### */
    
    /**
     * Handles footer collection links with specific filters.
     * Navigates to collection section then activates the filter.
     * Uses data-collection-filter attribute to specify filter type.
     * @param {Event} e - Click event from footer link
     */
    document.querySelectorAll('a[data-collection-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract filter type from data attribute
            const filter = this.dataset.collectionFilter;
            const targetSection = 'collection';
            
            // Navigate to collection section first
            const navLink = document.querySelector(`[data-section="${targetSection}"]`);
            if (navLink) {
                // Trigger main navigation click event
                navLink.click();
                
                /**
                 * Activate filter after navigation completes.
                 * Delay ensures smooth scroll finishes before filter change.
                 * 300ms matches typical smooth scroll duration.
                 */
                setTimeout(() => {
                    // Find and activate the corresponding filter tab
                    const filterTab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
                    if (filterTab && !filterTab.classList.contains('active')) {
                        filterTab.click();
                    }
                }, 300); // Wait for smooth scroll animation to complete
            }
        });
    });
    
    /* ###########################################################
       ###   4. General Navigation Links                       ###
       ########################################################### */
    
    /**
     * Handles other footer navigation links (Services, etc.).
     * Excludes collection filter links which are handled above.
     * Uses main navigation system for consistency.
     * @param {Event} e - Click event from footer navigation link
     */
    document.querySelectorAll('.footer-section a[href^="#"]:not([data-collection-filter])').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract section name from href attribute
            const targetSection = this.getAttribute('href').substring(1);
            
            // Find corresponding main navigation element
            const navLink = document.querySelector(`[data-section="${targetSection}"]`);
            
            // Delegate to main navigation system for consistent behavior
            if (navLink) {
                navLink.click();
            }
        });
    });
    
    /* ###########################################################
       ###   5. Legal Links Placeholder                        ###
       ########################################################### */
    
    /**
     * Temporary handler for legal links (Privacy, Terms, etc.).
     * Shows notification in development environment.
     * Replace with actual page navigation in production.
     * @param {Event} e - Click event from legal link
     */
    document.querySelectorAll('.legal-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract link text for notification message
            const linkText = this.textContent;
            
            // Use global notification system if available
            // Falls back silently if notification system not loaded
            if (typeof showNotification === 'function') {
                showNotification(`${linkText} would open in full implementation`, 'info');
            }
        });
    });
});

/* ###########################################################
   ###          END OF FOOTER NAVIGATION MODULE            ###
   ########################################################### */

   /*
=======================================================
IMPLEMENTATION NOTES: FOOTER NAVIGATION MODULE
=======================================================

CONCIERGE ACCESS:
- Hidden admin entry point
- Logo button trigger
- Modal authentication
- Password validation

FOOTER NAVIGATION:
- Quick links to sections
- Collection filtering
- Service shortcuts
- Contact information

SCROLL TO TOP:
- Smooth scroll behavior
- Appears on scroll down
- Fixed positioning
- Mobile friendly

EASTER EGG:
- Admin access discovery
- Professional presentation
- Security through obscurity
- User delight factor

RESPONSIVE DESIGN:
- Multi-column desktop
- Single column mobile
- Touch targets
- Readable typography
=======================================================
*/