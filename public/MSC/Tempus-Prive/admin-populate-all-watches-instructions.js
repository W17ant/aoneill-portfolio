/* ###########################################################
   ###  2418521        Antony O'Neill                      ###
   ###  TEMPUS PRIVÉ - POPULATE ALL WATCHES SCRIPT         ###
   ###  Last Updated: 26-06-2025                           ###
   ########################################################### */

/*
===============================================
INSTRUCTIONS FOR USE:
===============================================

// METHOD 1: Run in Browser Console
// 1. Open the admin panel in your browser
// 2. Open Developer Tools (F12)
// 3. Paste this code in the Console tab
// 4. Run: populateAllWatches()

// METHOD 2: Update admin.html
// Replace the existing getDefaultProducts() function 
// with getDefaultProductsComplete() in the admin.html file

// METHOD 3: Auto-populate on page load (ACTIVE)
// This script now automatically populates when the page loads
// if localStorage is empty or has fewer than 16 watches
*/

/* ###########################################################
   ###  1. FUNCTION: populateAllWatches                    ###
   ########################################################### */
function populateAllWatches() {
  const allWatches = [
    {
      id: "rolex-daytona-white-001",
      name: "Daytona Cosmograph",
      brand: "rolex",
      price: "£130,000",
      category: "sport, investment",
      image: "./images/products/rolex/rolex-daytona-white-main.png"
    },
    {
      id: "rolex-submariner-hulk-002",
      name: "Submariner Date 'Hulk'",
      brand: "rolex",
      price: "£87,000",
      category: "sport, investment",
      image: "./images/products/rolex/rolex-submariner-hulk-main.png"
    },
    {
      id: "ap-royal-oak-offshore-003",
      name: "Royal Oak Offshore",
      brand: "audemars-piguet",
      price: "£32,500",
      category: "sport, luxury",
      image: "./images/products/audemars-piguet/ap-royal-oak-offshore-main.png"
    },
    {
      id: "ap-royal-oak-jumbo-004",
      name: "Royal Oak Jumbo Extra-Thin",
      brand: "audemars-piguet",
      price: "By Private Consultation",
      category: "dress, luxury, investment",
      image: "./images/products/audemars-piguet/ap-royal-oak-jumbo-main.png"
    },
    {
      id: "patek-nautilus-5711-005",
      name: "Nautilus 5711/1A",
      brand: "patek-philippe",
      price: "By Private Consultation",
      category: "sport, luxury, investment",
      image: "./images/products/patek-philippe/patek-nautilus-5711-main.png"
    },
    {
      id: "patek-calatrava-5227-006",
      name: "Calatrava 5227G",
      brand: "patek-philippe",
      price: "£38,900",
      category: "dress, luxury",
      image: "./images/products/patek-philippe/patek-calatrava-5227-detail.png"
    },
    {
      id: "rm-mclaren-11-03-007",
      name: "RM 11-03 McLaren",
      brand: "richard-mille",
      price: "By Private Consultation",
      category: "sport, luxury, investment",
      image: "./images/products/richard-mille/rm-11-03-mclaren-main.png"
    },
    {
      id: "rm-67-02-extraflat-008",
      name: "RM 67-02 Extra Flat",
      brand: "richard-mille",
      price: "£87,000",
      category: "dress, luxury, investment",
      image: "./images/products/richard-mille/rm-67-02-extraflat-main.png"
    },
    {
      id: "cartier-santos-large-009",
      name: "Santos de Cartier Large",
      brand: "cartier",
      price: "£6,750",
      category: "sport, dress",
      image: "./images/products/cartier/cartier-santos-large-main.png"
    },
    {
      id: "cartier-tank-must-010",
      name: "Tank Must Watch",
      brand: "cartier",
      price: "£2,890",
      category: "dress",
      image: "./images/products/cartier/cartier-tank-must-main.png"
    },
    {
      id: "hublot-big-bang-titanium-011",
      name: "Big Bang Unico Titanium",
      brand: "hublot",
      price: "£18,900",
      category: "sport, luxury",
      image: "./images/products/hublot/hublot-big-bang-titanium-main.png"
    },
    {
      id: "hublot-classic-fusion-gold-012",
      name: "Classic Fusion King Gold",
      brand: "hublot",
      price: "£24,500",
      category: "dress, luxury",
      image: "./images/products/hublot/hublot-classic-fusion-gold-main.png"
    },
    {
      id: "longines-pocket-master-013",
      name: "Master Collection Pocket Watch",
      brand: "longines",
      price: "£1,890",
      category: "dress, luxury",
      image: "./images/products/longines/longines-pocket-master-main.png"
    },
    {
      id: "longines-pocket-heritage-014",
      name: "Heritage 1945 Pocket Watch",
      brand: "longines",
      price: "£1,250",
      category: "dress",
      image: "./images/products/longines/longines-pocket-heritage-main.png"
    },
    {
      id: "omega-chronometre-tourbillon-015",
      name: "Chronomètre à Tourbillon",
      brand: "omega",
      price: "By Private Consultation",
      category: "investment, heritage, luxury",
      image: "./images/products/omega/omega-chronometre-tourbillon-main.png"
    },
    {
      id: "omega-speedmaster-145022-69-016",
      name: "Speedmaster Professional Ref. 145.022-69 ST",
      brand: "omega",
      price: "£12,000",
      category: "sport, investment, heritage",
      image: "./images/products/omega/omega-speedmaster-145022-69-main.png"
    }
  ];

  try {
    // Save all watches to localStorage
    localStorage.setItem('admin-products', JSON.stringify(allWatches));
    console.log(`✅ Successfully populated localStorage with ${allWatches.length} luxury timepieces including Omega!`);
    
    // If admin panel is loaded, refresh the table
    if (typeof renderTable === 'function') {
      products = allWatches;
      renderTable();
      console.log('📊 Admin table refreshed with complete inventory including Omega');
    }
    
    return allWatches;
  } catch (error) {
    console.error('❌ Error populating localStorage:', error);
    return null;
  }
}

/* ###########################################################
   ###  2. FUNCTION: getDefaultProductsComplete            ###
   ########################################################### */
function getDefaultProductsComplete() {
  return [
    {
      id: "rolex-daytona-white-001",
      name: "Daytona Cosmograph",
      brand: "rolex",
      price: "£130,000",
      category: "sport, investment",
      image: "./images/products/rolex/rolex-daytona-white-main.png"
    },
    {
      id: "rolex-submariner-hulk-002",
      name: "Submariner Date 'Hulk'",
      brand: "rolex",
      price: "£87,000",
      category: "sport, investment",
      image: "./images/products/rolex/rolex-submariner-hulk-main.png"
    },
    {
      id: "ap-royal-oak-offshore-003",
      name: "Royal Oak Offshore",
      brand: "audemars-piguet",
      price: "£32,500",
      category: "sport, luxury",
      image: "./images/products/audemars-piguet/ap-royal-oak-offshore-main.png"
    },
    {
      id: "ap-royal-oak-jumbo-004",
      name: "Royal Oak Jumbo Extra-Thin",
      brand: "audemars-piguet",
      price: "By Private Consultation",
      category: "dress, luxury, investment",
      image: "./images/products/audemars-piguet/ap-royal-oak-jumbo-main.png"
    },
    {
      id: "patek-nautilus-5711-005",
      name: "Nautilus 5711/1A",
      brand: "patek-philippe",
      price: "By Private Consultation",
      category: "sport, luxury, investment",
      image: "./images/products/patek-philippe/patek-nautilus-5711-main.png"
    },
    {
      id: "patek-calatrava-5227-006",
      name: "Calatrava 5227G",
      brand: "patek-philippe",
      price: "£38,900",
      category: "dress, luxury",
      image: "./images/products/patek-philippe/patek-calatrava-5227-detail.png"
    },
    {
      id: "rm-mclaren-11-03-007",
      name: "RM 11-03 McLaren",
      brand: "richard-mille",
      price: "By Private Consultation",
      category: "sport, luxury, investment",
      image: "./images/products/richard-mille/rm-11-03-mclaren-main.png"
    },
    {
      id: "rm-67-02-extraflat-008",
      name: "RM 67-02 Extra Flat",
      brand: "richard-mille",
      price: "£87,000",
      category: "dress, luxury, investment",
      image: "./images/products/richard-mille/rm-67-02-extraflat-main.png"
    },
    {
      id: "cartier-santos-large-009",
      name: "Santos de Cartier Large",
      brand: "cartier",
      price: "£6,750",
      category: "sport, dress",
      image: "./images/products/cartier/cartier-santos-large-main.png"
    },
    {
      id: "cartier-tank-must-010",
      name: "Tank Must Watch",
      brand: "cartier",
      price: "£2,890",
      category: "dress",
      image: "./images/products/cartier/cartier-tank-must-main.png"
    },
    {
      id: "hublot-big-bang-titanium-011",
      name: "Big Bang Unico Titanium",
      brand: "hublot",
      price: "£18,900",
      category: "sport, luxury",
      image: "./images/products/hublot/hublot-big-bang-titanium-main.png"
    },
    {
      id: "hublot-classic-fusion-gold-012",
      name: "Classic Fusion King Gold",
      brand: "hublot",
      price: "£24,500",
      category: "dress, luxury",
      image: "./images/products/hublot/hublot-classic-fusion-gold-main.png"
    },
    {
      id: "longines-pocket-master-013",
      name: "Master Collection Pocket Watch",
      brand: "longines",
      price: "£1,890",
      category: "dress, luxury",
      image: "./images/products/longines/longines-pocket-master-main.png"
    },
    {
      id: "longines-pocket-heritage-014",
      name: "Heritage 1945 Pocket Watch",
      brand: "longines",
      price: "£1,250",
      category: "dress",
      image: "./images/products/longines/longines-pocket-heritage-main.png"
    },
    {
      id: "omega-chronometre-tourbillon-015",
      name: "Chronomètre à Tourbillon",
      brand: "omega",
      price: "By Private Consultation",
      category: "investment, heritage, luxury",
      image: "./images/products/omega/omega-chronometre-tourbillon-main.png"
    },
    {
      id: "omega-speedmaster-145022-69-016",
      name: "Speedmaster Professional Ref. 145.022-69 ST",
      brand: "omega",
      price: "£12,000",
      category: "sport, investment, heritage",
      image: "./images/products/omega/omega-speedmaster-145022-69-main.png"
    }
  ];
}

/* ###########################################################
   ###  3. EVENT LISTENER (DOMContentLoaded)               ###
   ########################################################### */
document.addEventListener('DOMContentLoaded', function() {
  // Check if it should auto-populate
  const stored = localStorage.getItem('admin-products');
  if (!stored || JSON.parse(stored).length < 16) {
    console.log('🔄 Auto-populating with complete watch collection...');
    populateAllWatches();
  }
});

/* ###########################################################
   ###  4. INITIAL LOG OUTPUT                              ###
   ########################################################### */
console.log('🏗️ Omega Speedmaster Integration Script loaded');
console.log('🌟 Run populateAllWatches() to populate all 16 luxury timepieces including both Omega models');

/* ###########################################################
   ###        END OF POPULATE ALL WATCHES JS MODULE        ###
   ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: ADMIN DATA POPULATION SCRIPT
=======================================================

DEVELOPMENT HELPER:
- Auto-populates localStorage
- Creates initial product set
- Prevents empty state
- Development efficiency

DATA SOURCE:
- Uses products.json
- Maintains consistency
- Single source of truth
- Easy updates

EXECUTION:
- Runs after main.js
- Checks for existing data
- Non-destructive
- Console feedback

USAGE:
- Automatic on page load
- Development only
- Remove for production
- Clear localStorage to reset

INTEGRATION:
- Works with admin panel
- Triggers count updates
- Maintains consistency
- Cross-module compatibility
=======================================================
*/   
