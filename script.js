// ===== HERO VIDEO =====
class HeroVideo {
    constructor() {
        this.video = document.getElementById('hero-video');
        this.unmuteBtn = document.getElementById('unmute-btn');
        this.heroContent = document.querySelector('.hero-content');
        this.navbar = document.querySelector('.navbar');
        this.heroScroll = document.querySelector('.hero-scroll');
        this.fullscreenBranding = document.querySelector('.fullscreen-branding');
        this.isFullscreenMode = false;
        this.cursorTimer = null;
        this.soundEnabled = false;
        this.init();
    }

    init() {
        if (this.video) {
            // Handle video load success
            this.video.addEventListener('loadeddata', () => {
                console.log('Hero video loaded successfully');
            });

            // Handle video load failure
            this.video.addEventListener('error', () => {
                console.log('Hero video failed to load');
            });

            // Ensure video plays on mobile
            this.video.addEventListener('canplay', () => {
                this.video.play().catch(e => {
                    console.log('Autoplay prevented on this device');
                });
            });

            // Handle unmute button
            if (this.unmuteBtn) {
                this.unmuteBtn.addEventListener('click', () => {
                    this.toggleMute();
                });
            }

            // Handle mouse movement for fullscreen mode
            document.addEventListener('mousemove', () => {
                this.handleMouseMove();
            });

            // Handle clicks to exit fullscreen mode
            document.addEventListener('click', (e) => {
                if (this.isFullscreenMode && !e.target.closest('.unmute-button')) {
                    this.exitFullscreenMode();
                }
            });

            // Handle escape key to exit fullscreen mode
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isFullscreenMode) {
                    this.exitFullscreenMode();
                }
            });
        }
    }

    toggleMute() {
        if (this.video.muted) {
            // Unmute video
            this.video.muted = false;
            this.unmuteBtn.innerHTML = '<i class="fas fa-volume-up"></i> Sound On!';
            this.unmuteBtn.classList.add('unmuted');
            this.unmuteBtn.title = 'Mute video';
            this.soundEnabled = true;
            
            // Start the fullscreen mode timer
            this.startFullscreenTimer();
        } else {
            // Mute video
            this.video.muted = true;
            this.unmuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Sound On!';
            this.unmuteBtn.classList.remove('unmuted');
            this.unmuteBtn.title = 'Unmute video';
            this.soundEnabled = false;
            
            // Exit fullscreen mode if active
            this.exitFullscreenMode();
        }
    }

    handleMouseMove() {
        if (this.soundEnabled) {
            // Show UI elements when mouse moves
            this.showUI();
            
            // Reset the timer
            this.startFullscreenTimer();
        }
    }

    startFullscreenTimer() {
        // Clear existing timer
        if (this.cursorTimer) {
            clearTimeout(this.cursorTimer);
        }

        // Set new timer for 2 seconds
        this.cursorTimer = setTimeout(() => {
            if (this.soundEnabled && !this.isFullscreenMode) {
                this.enterFullscreenMode();
            }
        }, 2000);
    }

    enterFullscreenMode() {
        this.isFullscreenMode = true;
        document.body.classList.add('fullscreen-video-mode');
        
        // Hide UI elements and show branding
        if (this.heroContent) this.heroContent.style.opacity = '0';
        if (this.navbar) this.navbar.style.opacity = '0';
        if (this.heroScroll) this.heroScroll.style.opacity = '0';
        
        // Hide cursor after a moment
        setTimeout(() => {
            if (this.isFullscreenMode) {
                document.body.style.cursor = 'none';
            }
        }, 1000);
    }

    exitFullscreenMode() {
        this.isFullscreenMode = false;
        document.body.classList.remove('fullscreen-video-mode');
        document.body.style.cursor = 'default';
        
        // Show UI elements
        this.showUI();
    }

    showUI() {
        if (this.heroContent) this.heroContent.style.opacity = '1';
        if (this.navbar) this.navbar.style.opacity = '1';
        if (this.heroScroll) this.heroScroll.style.opacity = '1';
        document.body.style.cursor = 'default';
    }
}


// ===== REVIEWS CAROUSEL =====
class ReviewsCarousel {
    constructor() {
        this.reviews = document.querySelectorAll('.review-card');
        this.currentReview = 0;
        this.reviewInterval = null;
        this.prevBtn = document.querySelector('.review-prev');
        this.nextBtn = document.querySelector('.review-next');
        this.indicatorsContainer = document.querySelector('.review-indicators');
        this.init();
    }

    init() {
        if (this.reviews.length > 1) {
            this.createIndicators();
            this.addEventListeners();
            this.startCarousel();
        }
    }

    createIndicators() {
        // Create dot indicators for each review
        this.reviews.forEach((review, index) => {
            const indicator = document.createElement('div');
            indicator.className = `review-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToReview(index));
            this.indicatorsContainer.appendChild(indicator);
        });
        this.indicators = document.querySelectorAll('.review-indicator');
    }

    addEventListeners() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevReview();
                this.resetAutoplay();
            });
        }

        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextReview();
                this.resetAutoplay();
            });
        }
    }

    showReview(index) {
        // Remove active class from all reviews and indicators
        this.reviews.forEach(review => review.classList.remove('active'));
        if (this.indicators) {
            this.indicators.forEach(indicator => indicator.classList.remove('active'));
        }
        
        // Add active class to current review and indicator
        this.reviews[index].classList.add('active');
        if (this.indicators && this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }
    }

    nextReview() {
        this.currentReview = (this.currentReview + 1) % this.reviews.length;
        this.showReview(this.currentReview);
    }

    prevReview() {
        this.currentReview = (this.currentReview - 1 + this.reviews.length) % this.reviews.length;
        this.showReview(this.currentReview);
    }

    goToReview(index) {
        this.currentReview = index;
        this.showReview(this.currentReview);
        this.resetAutoplay();
    }

    startCarousel() {
        this.reviewInterval = setInterval(() => {
            this.nextReview();
        }, 8000); // Change review every 8 seconds
    }

    resetAutoplay() {
        // Stop current autoplay
        this.stopCarousel();
        // Restart autoplay after user interaction
        this.startCarousel();
    }

    stopCarousel() {
        if (this.reviewInterval) {
            clearInterval(this.reviewInterval);
        }
    }
}

// ===== MOBILE NAVIGATION =====
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = this.hamburger.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('active'));
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        
        const bars = this.hamburger.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('active'));
    }
}

// ===== NAVBAR SCROLL EFFECT =====
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        if (this.navbar) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        // Handle navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Handle hero scroll button
        const heroScroll = document.querySelector('.hero-scroll');
        if (heroScroll) {
            heroScroll.addEventListener('click', () => {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .stat, .review-card, .contact-method');
        this.init();
    }

    init() {
        this.createObserver();
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);

        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// ===== CONTACT FORM HANDLER =====
class ContactForm {
    constructor() {
        this.form = document.querySelector('.inquiry-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            this.showSuccessMessage();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.form.reset();
        }, 2000);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                margin-top: 1rem;
                text-align: center;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
            ">
                <i class="fas fa-check-circle"></i>
                Thank you! Your inquiry has been sent successfully. We'll get back to you soon!
            </div>
        `;
        
        this.form.appendChild(message);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// ===== PARALLAX EFFECT =====
class ParallaxEffect {
    constructor() {
        this.parallaxElements = document.querySelectorAll('.teaser-background, .hero-slideshow');
        this.init();
    }

    init() {
        if (this.parallaxElements.length > 0) {
            window.addEventListener('scroll', () => this.handleParallax());
        }
    }

    handleParallax() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ===== LOADING ANIMATIONS =====
class LoadingAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Add staggered animation to service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });

        // Stats section loaded - no animation needed
    }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new HeroVideo(); // This will handle both video and slideshow
    window.reviewsCarouselInstance = new ReviewsCarousel();
    new MobileNavigation();
    new NavbarScrollEffect();
    new SmoothScrolling();
    new ScrollAnimations();
    new ContactForm();
    new ParallaxEffect();
    new LoadingAnimations();

    // Initialize backend integration
    import('./backend-integration.js').then(() => {
        console.log('Backend integration loaded');
    }).catch(error => {
        console.warn('Backend integration not available:', error);
    });

    // Initialize Google Places API reviews (real Google reviews)
    import('./google-reviews.js').then(() => {
        console.log('Google Places API reviews loaded');
    }).catch(error => {
        console.warn('Google Places API reviews not available:', error);
        // Fallback to manual reviews
        import('./manual-reviews.js').then(() => {
            console.log('Fallback manual reviews loaded');
        }).catch(fallbackError => {
            console.warn('Manual reviews also not available:', fallbackError);
        });
    });

    // Add page loaded class for any additional animations
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events for better performance
function throttle(func, wait) {
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

// Apply throttling to scroll-heavy functions
const throttledScroll = throttle(() => {
    // Any additional scroll handlers can go here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// Focus management for mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileNav = document.querySelector('.nav-menu.active');
        if (mobileNav) {
            mobileNav.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Script error:', e.error);
});

// Handle image loading errors
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.style.display = 'none';
        console.warn('Failed to load image:', img.src);
    });
}); 