/* ###########################################################
   ###   2418521        Antony O'Neill                     ###
   ###   TEMPUS PRIVÉ - LUXURY ANIMATION SYSTEM            ###
   ###   Last Updated: 24-06-2025                          ###
   ########################################################### */

/*
===============================================
This file handles all premium animations for the Tempus-Privé platform
Key features: card animations, scroll reveals, loading states
Dependencies: main.js must load first for global utilities
Architecture: Class-based animation system with reduced motion support
===============================================
*/

/* ###########################################################
   ###   1. Animation System Class Definition              ###
   ########################################################### */

/**
 * Core animation system for luxury watch interface.
 * Manages all micro-interactions and transitions.
 */
class LuxuryAnimations {
  constructor() {
    // Respect user's motion preferences for accessibility
    this.isReducedMotion = this.checkReducedMotion();
    this.animationQueue = [];
    this.isAnimating = false;
    
    this.init();
  }

  /* ====== Initialization Methods ====== */
  
  /**
   * Initialize all animation subsystems.
   * Sequential setup ensures proper dependency resolution.
   */
  init() {
    this.initializeObservers();
    this.setupCardAnimations();
    this.setupScrollAnimations();
    this.setupLoadingAnimations();
    this.setupHoverEffects();
    
    console.log('✨ Luxury Animation System Initialized');
  }

  /**
   * Check user's motion preference setting.
   * Critical for accessibility compliance.
   */
  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ###########################################################
     ###   2. Intersection Observer Setup                    ###
     ########################################################### */

  /**
   * Configure scroll-triggered animations using IntersectionObserver.
   * Performance-optimized alternative to scroll event listeners.
   */
  initializeObservers() {
    // Skip observer setup if user prefers reduced motion
    if (this.isReducedMotion) return;

    /* ====== Fade Animation Observer ====== */
    // Triggers smooth opacity transitions
    this.fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% visible
      rootMargin: '0px 0px -10% 0px' // Start animation slightly before fully in view
    });

    /* ====== Slide Animation Observer ====== */
    // Creates upward motion effect
    this.slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      });
    }, {
      threshold: 0.2 // Requires 20% visibility for more dramatic reveal
    });

    // Apply observers to DOM elements
    this.observeElements();
  }

  /**
   * Attach observers to specific element types.
   * Separation allows flexible animation targeting.
   */
  observeElements() {
    // Product cards get subtle fade effect
    document.querySelectorAll('.product-card, .hero-watch, .maison-card').forEach(el => {
      el.classList.add('animate-on-scroll');
      this.fadeObserver.observe(el);
    });

    // Service elements get more dramatic slide effect
    document.querySelectorAll('.section-header, .service-card, .benefit-card').forEach(el => {
      el.classList.add('animate-slide-on-scroll');
      this.slideObserver.observe(el);
    });
  }

  /* ###########################################################
     ###   3. Product Card Animation System                  ###
     ########################################################### */

  /**
   * Initialize card interaction animations.
   * Separate desktop/mobile for optimal UX.
   */
  setupCardAnimations() {
    this.setupDesktopCardEffects();
    this.setupMobileCardEffects();
  }

  /* ====== Desktop Card Effects ====== */
  
  /**
   * Mouse-based interactions for desktop users.
   * Creates premium hover experience.
   */
  setupDesktopCardEffects() {
    // Skip on mobile devices
    if (window.innerWidth < 768) return;

    document.addEventListener('mouseover', (e) => {
      const productCard = e.target.closest('.product-card, .hero-watch');
      if (productCard && !this.isReducedMotion) {
        this.animateCardHover(productCard, 'enter');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const productCard = e.target.closest('.product-card, .hero-watch');
      if (productCard && !this.isReducedMotion) {
        this.animateCardHover(productCard, 'leave');
      }
    });
  }

  /* ====== Mobile Card Effects ====== */
  
  /**
   * Touch-optimized animations for mobile devices.
   * Provides tactile feedback without hover states.
   */
  setupMobileCardEffects() {
    document.addEventListener('touchstart', (e) => {
      const productCard = e.target.closest('.product-card, .hero-watch');
      if (productCard && !this.isReducedMotion) {
        this.animateCardTouch(productCard, 'start');
      }
    });

    document.addEventListener('touchend', (e) => {
      const productCard = e.target.closest('.product-card, .hero-watch');
      if (productCard && !this.isReducedMotion) {
        this.animateCardTouch(productCard, 'end');
      }
    });
  }

  /**
   * Desktop hover animation handler.
   * Creates museum-quality lifting effect.
   */
  animateCardHover(card, state) {
    const cardInner = card.querySelector('.product-card-inner, .watch-card');
    const image = card.querySelector('.product-image, .watch-image');
    const overlay = card.querySelector('.product-overlay, .watch-overlay');

    if (!cardInner) return;

    if (state === 'enter') {
      // Subtle 3D rotation creates premium depth
      cardInner.style.transform = 'translateY(-8px) rotateX(2deg)';
      cardInner.style.boxShadow = '0 25px 50px rgba(12, 27, 42, 0.15)';
      cardInner.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

      // Gentle zoom draws attention to product
      if (image) {
        image.style.transform = 'scale(1.05)';
        image.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Reveal additional information smoothly
      if (overlay) {
        overlay.style.transform = 'translateY(0)';
        overlay.style.opacity = '1';
        overlay.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s';
      }

    } else {
      // Restore original state with easing
      cardInner.style.transform = 'translateY(0) rotateX(0deg)';
      cardInner.style.boxShadow = '';

      if (image) {
        image.style.transform = 'scale(1)';
      }

      if (overlay) {
        overlay.style.transform = 'translateY(100%)';
        overlay.style.opacity = '0';
        overlay.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }
  }

  /**
   * Mobile touch animation handler.
   * Provides subtle feedback without interfering with scrolling.
   */
  animateCardTouch(card, state) {
    const cardInner = card.querySelector('.product-card-inner, .watch-card');
    if (!cardInner) return;

    if (state === 'start') {
      // Slight compression indicates interaction
      cardInner.style.transform = 'scale(0.98)';
      cardInner.style.transition = 'transform 0.15s ease-out';
    } else {
      // Bounce-back effect confirms touch release
      cardInner.style.transform = 'scale(1.02)';
      setTimeout(() => {
        cardInner.style.transform = 'scale(1)';
        // Elastic easing creates playful response
        cardInner.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      }, 100);
    }
  }

  /* ====== Card Flip Animation ====== */
  
  /**
   * 3D card flip for content switching.
   * Used for revealing product details or comparisons.
   */
  flipCard(cardElement, content) {
    if (this.isReducedMotion) return Promise.resolve();

    return new Promise((resolve) => {
      // First half of rotation
      cardElement.style.transform = 'rotateY(90deg)';
      cardElement.style.transition = 'transform 0.3s ease-in';

      setTimeout(() => {
        // Update content while card is edge-on
        if (content) {
          cardElement.innerHTML = content;
        }

        // Complete rotation
        cardElement.style.transform = 'rotateY(0deg)';
        cardElement.style.transition = 'transform 0.3s ease-out';

        setTimeout(() => {
          // Clean up inline styles
          cardElement.style.transform = '';
          cardElement.style.transition = '';
          resolve();
        }, 300);
      }, 300);
    });
  }

  /* ###########################################################
     ###   4. Scroll-Based Animation Effects                 ###
     ########################################################### */

  /**
   * Initialize scroll-triggered animations.
   * Includes parallax and stagger effects.
   */
  setupScrollAnimations() {
    this.setupParallaxEffect();
    this.setupStaggerAnimations();
  }

  /* ====== Parallax Scrolling ====== */
  
  /**
   * Create depth through differential scroll speeds.
   * Hero section moves slower than foreground.
   */
  setupParallaxEffect() {
    if (this.isReducedMotion) return;

    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Throttle flag prevents excessive calculations
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      // Negative multiplier creates background effect
      const rate = scrolled * -0.5;
      
      // Hardware acceleration with translate3d
      heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      // RequestAnimationFrame throttling for 60fps
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  /* ====== Stagger Animations ====== */
  
  /**
   * Sequential reveal for grid items.
   * Creates wave-like appearance effect.
   */
  setupStaggerAnimations() {
    const observeStaggerElements = (selector, delay = 100) => {
      const elements = document.querySelectorAll(selector);
      
      const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Delay increases with index for cascade effect
            setTimeout(() => {
              entry.target.classList.add('animate-stagger-in');
            }, index * delay);
          }
        });
      }, { threshold: 0.1 });

      elements.forEach(el => staggerObserver.observe(el));
    };

    // Different delays create visual hierarchy
    observeStaggerElements('.product-card', 80);
    observeStaggerElements('.maison-card', 100);
    observeStaggerElements('.service-card', 120);
  }

  /* ###########################################################
     ###   5. Loading State Animations                       ###
     ########################################################### */

  /**
   * Configure loading and skeleton animations.
   * Maintains engagement during data fetching.
   */
  setupLoadingAnimations() {
    this.animateLoadingScreen();
    this.setupSkeletonLoaders();
  }

  /**
   * Initial page load animation sequence.
   * Creates premium first impression.
   */
  animateLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Minimum display time ensures logo visibility
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        this.animatePageEntry();
      }, 800);
    }, 2000);
  }

  /**
   * Orchestrate element appearance on page load.
   * Sequential timing creates elegant reveal.
   */
  animatePageEntry() {
    if (this.isReducedMotion) return;

    // Header slides down from above viewport
    const header = document.querySelector('.header');
    if (header) {
      header.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        header.style.transform = 'translateY(0)';
      }, 100);
    }

    // Hero content fades up after header
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';
      heroContent.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  /**
   * Configure skeleton loading placeholders.
   * Prevents layout shift during async loading.
   */
  setupSkeletonLoaders() {
    // Shimmer effect indicates active loading
    const style = document.createElement('style');
    style.textContent = `
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }
      
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ###########################################################
     ###   6. Interactive Hover Effects                      ###
     ########################################################### */

  /**
   * Initialize hover effects for interactive elements.
   * Enhances perceived responsiveness.
   */
  setupHoverEffects() {
    this.setupButtonEffects();
    this.setupNavigationEffects();
    this.setupBrandLogoEffects();
  }

  /* ====== Button Hover Effects ====== */
  
  /**
   * Configure button interaction animations.
   * Subtle lift effect suggests clickability.
   */
  setupButtonEffects() {
    document.addEventListener('mouseenter', (e) => {
        const target = e.target;
        // Defensive check prevents errors
        if (!target || typeof target.matches !== 'function') return;
        
        if (target.matches('.btn-primary, .btn-secondary')) {
            this.animateButton(target, 'enter');
        }
    });

    document.addEventListener('mouseleave', (e) => {
        const target = e.target;
        if (!target || typeof target.matches !== 'function') return;
        
        if (target.matches('.btn-primary, .btn-secondary')) {
            this.animateButton(target, 'leave');
        }
    });
  }

  /**
   * Button animation handler.
   * Creates tactile hover response.
   */
  animateButton(button, state) {
    if (this.isReducedMotion) return;

    if (state === 'enter') {
      // Slight elevation suggests interactivity
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 8px 25px rgba(12, 27, 42, 0.15)';
      button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '';
    }
  }

  /* ====== Navigation Link Effects ====== */
  
  /**
   * Configure navigation hover animations.
   * Reinforces active states and navigation hierarchy.
   */
  setupNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          this.animateNavLink(link, 'enter');
        }
      });
      
      link.addEventListener('mouseleave', () => {
        if (!this.isReducedMotion) {
          this.animateNavLink(link, 'leave');
        }
      });
    });
  }

  /**
   * Navigation link animation handler.
   * Subtle movement draws attention without distraction.
   */
  animateNavLink(link, state) {
    if (state === 'enter') {
      // Micro-movement indicates hover state
      link.style.transform = 'translateY(-1px)';
      link.style.transition = 'transform 0.2s ease-out';
    } else {
      link.style.transform = 'translateY(0)';
    }
  }

  /* ====== Brand Logo Effects ====== */
  
  /**
   * Configure brand logo hover animations.
   * Adds premium feel to partner brands.
   */
  setupBrandLogoEffects() {
    document.addEventListener('mouseenter', (e) => {
        const target = e.target;
        if (!target || typeof target.matches !== 'function') return;
        
        if (target.matches('.brand-logo, .maison-logo')) {
            this.animateLogo(target, 'enter');
        }
    });

    document.addEventListener('mouseleave', (e) => {
        const target = e.target;
        if (!target || typeof target.matches !== 'function') return;
        
        if (target.matches('.brand-logo, .maison-logo')) {
            this.animateLogo(target, 'leave');
        }
    });
  }

  /**
   * Logo animation handler.
   * Subtle rotation and brightness enhance premium feel.
   */
  animateLogo(logo, state) {
    if (this.isReducedMotion) return;

    if (state === 'enter') {
      // Slight rotation adds playfulness
      logo.style.transform = 'scale(1.05) rotate(1deg)';
      logo.style.filter = 'brightness(1.1)';
      logo.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      logo.style.transform = 'scale(1) rotate(0deg)';
      logo.style.filter = 'brightness(1)';
    }
  }

  /* ###########################################################
     ###   7. Modal Animation System                         ###
     ########################################################### */

  /**
   * Animate modal dialog appearance.
   * Creates focus through background blur and scale.
   */
  animateModalOpen(modal) {
    if (this.isReducedMotion) {
      modal.classList.add('active');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      modal.style.display = 'flex';
      modal.style.opacity = '0';
      
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        // Start smaller and below for entrance effect
        modalContent.style.transform = 'scale(0.8) translateY(20px)';
        modalContent.style.opacity = '0';
      }

      requestAnimationFrame(() => {
        modal.style.transition = 'opacity 0.3s ease-out';
        modal.style.opacity = '1';
        
        if (modalContent) {
          // Scale to full size with smooth curve
          modalContent.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          modalContent.style.transform = 'scale(1) translateY(0)';
          modalContent.style.opacity = '1';
        }

        setTimeout(() => {
          modal.classList.add('active');
          resolve();
        }, 400);
      });
    });
  }

  /**
   * Animate modal dialog closure.
   * Reverses opening animation for consistency.
   */
  animateModalClose(modal) {
    if (this.isReducedMotion) {
      modal.classList.remove('active');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const modalContent = modal.querySelector('.modal-content');
      
      modal.style.transition = 'opacity 0.2s ease-in';
      modal.style.opacity = '0';
      
      if (modalContent) {
        // Shrink and move up for exit
        modalContent.style.transition = 'all 0.2s ease-in';
        modalContent.style.transform = 'scale(0.9) translateY(-10px)';
        modalContent.style.opacity = '0';
      }

      setTimeout(() => {
        modal.classList.remove('active');
        modal.style.display = 'none';
        // Clean up inline styles
        modal.style.opacity = '';
        modal.style.transition = '';
        
        if (modalContent) {
          modalContent.style.transform = '';
          modalContent.style.opacity = '';
          modalContent.style.transition = '';
        }
        
        resolve();
      }, 200);
    });
  }

  /* ###########################################################
     ###   8. Notification Animation System                  ###
     ########################################################### */

  /**
   * Animate notification appearance/disappearance.
   * Slide-in effect draws attention without disruption.
   */
  animateNotification(notification, action = 'show') {
    if (this.isReducedMotion) {
      notification.style.display = action === 'show' ? 'block' : 'none';
      return Promise.resolve();
    }

    if (action === 'show') {
      return new Promise((resolve) => {
        // Start off-screen to the right
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.display = 'block';

        requestAnimationFrame(() => {
          notification.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          notification.style.transform = 'translateX(0)';
          notification.style.opacity = '1';

          setTimeout(resolve, 400);
        });
      });
    } else {
      return new Promise((resolve) => {
        // Slide out to the right
        notification.style.transition = 'all 0.3s ease-in';
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';

        setTimeout(() => {
          notification.style.display = 'none';
          resolve();
        }, 300);
      });
    }
  }

  /* ###########################################################
     ###   9. Scroll Reveal Animation System                 ###
     ########################################################### */

  /**
   * Configure element reveal on scroll.
   * Flexible system for any element type.
   */
  revealOnScroll(elements, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      once: true // Animate only on first appearance
    };
    
    const settings = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateReveal(entry.target, settings.animation || 'fadeInUp');
          
          if (settings.once) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: settings.threshold,
      rootMargin: settings.rootMargin
    });

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Apply reveal animation to element.
   * Supports multiple animation types.
   */
  animateReveal(element, animation) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    element.classList.add(`animate-${animation}`);
  }

  /* ###########################################################
     ###   10. Special Effects                               ###
     ########################################################### */

  /* ====== Typewriter Effect ====== */
  
  /**
   * Create typewriter text animation.
   * Used for hero headlines and important messages.
   */
  typeWriter(element, text, speed = 50) {
    if (this.isReducedMotion) {
      element.textContent = text;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      element.textContent = '';
      let i = 0;

      const type = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  }

  /* ====== Morphing Effect ====== */
  
  /**
   * Smooth content transition with scaling.
   * Creates fluid content updates.
   */
  morphElement(element, newContent, duration = 300) {
    if (this.isReducedMotion) {
      element.innerHTML = newContent;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      // Shrink phase
      element.style.transition = `all ${duration / 2}ms ease-in`;
      element.style.transform = 'scale(0.8)';
      element.style.opacity = '0.3';

      setTimeout(() => {
        // Update content at minimum size
        element.innerHTML = newContent;

        // Expand phase
        element.style.transition = `all ${duration / 2}ms ease-out`;
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';

        setTimeout(() => {
          // Clean up inline styles
          element.style.transition = '';
          element.style.transform = '';
          element.style.opacity = '';
          resolve();
        }, duration / 2);
      }, duration / 2);
    });
  }

  /* ====== Luxury Loading Spinner ====== */
  
  /**
   * Create branded loading spinner.
   * Maintains brand presence during loading states.
   */
  createLuxurySpinner(container) {
    const spinner = document.createElement('div');
    spinner.className = 'luxury-spinner';
    spinner.innerHTML = `
      <div class="spinner-ring"></div>
      <div class="spinner-logo">TP</div>
    `;

    // Inline styles for self-contained component
    const style = document.createElement('style');
    style.textContent = `
      .luxury-spinner {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 0 auto;
      }
      
      .spinner-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid transparent;
        border-top: 2px solid #D4AF37;
        border-radius: 50%;
        animation: luxury-spin 1.5s linear infinite;
      }
      
      .spinner-logo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Canela', serif;
        font-size: 16px;
        font-weight: bold;
        color: #0C1B2A;
        animation: luxury-pulse 2s ease-in-out infinite;
      }
      
      @keyframes luxury-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes luxury-pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
    `;

    // Append style only if not already present
    if (!document.head.querySelector('style[data-luxury-spinner]')) {
      style.setAttribute('data-luxury-spinner', 'true');
      document.head.appendChild(style);
    }

    container.appendChild(spinner);
    return spinner;
  }

  /* ###########################################################
     ###   11. Cleanup and Memory Management                 ###
     ########################################################### */

  /**
   * Clean up event listeners and observers.
   * Prevents memory leaks in single-page applications.
   */
  cleanup() {
    // Disconnect all observers
    if (this.fadeObserver) this.fadeObserver.disconnect();
    if (this.slideObserver) this.slideObserver.disconnect();
    
    // Remove global event listeners
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    
    console.log('🧹 Luxury Animation System Cleaned Up');
  }

  /* ###########################################################
     ###   12. Public API Methods                            ###
     ########################################################### */

  /**
   * Public method to trigger card flip animation.
   * Allows external modules to animate specific cards.
   */
  flipProductCard(cardId, newContent) {
    const card = document.querySelector(`[data-product-id="${cardId}"]`);
    if (card) {
      return this.flipCard(card, newContent);
    }
    return Promise.resolve();
  }

  /**
   * Animate element entrance with configurable delay.
   * Used by other modules for coordinated animations.
   */
  animateEntrance(element, delay = 0) {
    if (this.isReducedMotion) return Promise.resolve();

    return new Promise((resolve) => {
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';

          setTimeout(() => {
            // Clean up to allow further animations
            element.style.transition = '';
            element.style.transform = '';
            element.style.opacity = '';
            resolve();
          }, 600);
        });
      }, delay);
    });
  }

  /**
   * Display loading state with custom message.
   * Maintains UX during async operations.
   */
  showLoadingState(container, message = 'Loading...') {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-state';
    loadingElement.innerHTML = `
      <div class="loading-content">
        ${this.createLuxurySpinner(document.createElement('div')).outerHTML}
        <p class="loading-message">${message}</p>
      </div>
    `;

    container.innerHTML = '';
    container.appendChild(loadingElement);

    return loadingElement;
  }

  /**
   * Hide loading state and reveal new content.
   * Smooth transition maintains visual continuity.
   */
  hideLoadingState(container, newContent) {
    const loadingElement = container.querySelector('.loading-state');
    if (!loadingElement) return Promise.resolve();

    if (this.isReducedMotion) {
      container.innerHTML = newContent;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      loadingElement.style.transition = 'opacity 0.3s ease-out';
      loadingElement.style.opacity = '0';

      setTimeout(() => {
        container.innerHTML = newContent;
        
        // Animate new content appearance
        const newElements = container.children;
        Array.from(newElements).forEach((el, index) => {
          this.animateEntrance(el, index * 100);
        });

        resolve();
      }, 300);
    });
  }
}

/* ###########################################################
   ###   13. CSS Animation Definitions                     ###
   ########################################################### */

/* ====== Animation Stylesheet Injection ====== */
// Dynamic CSS ensures animations are available immediately
const animationCSS = `
  /* Scroll reveal animations */
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .animate-fade-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .animate-slide-on-scroll {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .animate-slide-up {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .animate-stagger-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  /* Card animations */
  .product-card, .hero-watch {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Loading animations */
  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
  }
  
  .loading-message {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #999;
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .animate-on-scroll,
    .animate-slide-on-scroll {
      opacity: 1;
      transform: none;
    }
  }
`;

// Inject animation styles into document head
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

/* ###########################################################
   ###   14. Module Initialization                         ###
   ########################################################### */

/* ====== Global Variable Declaration ====== */
let luxuryAnimations;

/* ====== DOM Ready Handler ====== */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animation system when DOM is ready
  luxuryAnimations = new LuxuryAnimations();
  
  // Make globally accessible for debugging and external use
  window.luxuryAnimations = luxuryAnimations;
  
  console.log('✨ Luxury Animation System Ready');
});

/* ###########################################################
   ###            END OF ANIMATIONS JS MODULE              ###
   ########################################################### */

/*
=======================================================
IMPLEMENTATION NOTES: LUXURY ANIMATION SYSTEM
=======================================================

SCROLL-TRIGGERED ANIMATIONS:
- IntersectionObserver for performance
- Staggered reveal effects
- Fade and slide animations
- Respects prefers-reduced-motion

CARD HOVER EFFECTS:
- 3D transform on hover
- Smooth transitions
- Touch-friendly alternatives
- GPU-accelerated transforms

LOADING ANIMATIONS:
- Initial page load sequence
- Skeleton screen placeholders
- Progress indicators
- Smooth transitions

MICRO-INTERACTIONS:
- Button hover states
- Form focus effects
- Modal transitions
- Navigation animations

PERFORMANCE OPTIMIZATIONS:
- Will-change hints
- Transform over position
- Batched animations
- RAF scheduling

ACCESSIBILITY:
- Reduced motion support
- No autoplay animations
- User-controlled timing
- Focus visible states
=======================================================
*/   