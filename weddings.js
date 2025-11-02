// ===== WEDDING PAGE FUNCTIONALITY =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileNavigation();
    new SmoothScrolling();
    new NavbarScrollEffect();
    new ContactForm();
    new ScrollAnimations();

    // Initialize backend integration
    import('./backend-integration.js').then(() => {
        console.log('Backend integration loaded');
    }).catch(error => {
        console.warn('Backend integration not available:', error);
    });

    // Add page loaded class
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

// ===== PACKAGE SELECTION TRACKING =====
class PackageSelection {
    constructor() {
        this.selectedPackage = null;
        this.init();
    }

    init() {
        // Track package clicks
        document.querySelectorAll('.package-cta').forEach(button => {
            button.addEventListener('click', (e) => {
                const packageCard = e.target.closest('.package-card');
                const packageName = packageCard.querySelector('.package-name').textContent;
                const packagePrice = packageCard.querySelector('.package-price').textContent;
                
                this.selectedPackage = {
                    name: packageName,
                    price: packagePrice
                };
                
                // Scroll to contact form
                document.getElementById('contact').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                
                // Pre-fill the form
                this.prefillContactForm();
            });
        });
    }

    prefillContactForm() {
        if (this.selectedPackage) {
            const packageSelect = document.getElementById('package-interest');
            if (packageSelect) {
                // Find matching option
                const options = packageSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.textContent.includes(this.selectedPackage.name)) {
                        option.selected = true;
                    }
                });
            }
        }
    }
}

// ===== CONTACT FORM ENHANCEMENTS =====
class WeddingContactForm {
    constructor() {
        this.form = document.getElementById('wedding-contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Add wedding-specific data
        data.serviceType = 'Wedding';
        data.timestamp = new Date().toISOString();
        
        try {
            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send to backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showSuccessMessage();
                this.form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending wedding inquiry:', error);
            this.showErrorMessage();
        } finally {
            // Reset button
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="background: #10b981; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                <i class="fas fa-check-circle"></i>
                Thank you! We've received your wedding inquiry and will contact you soon.
            </div>
        `;
        
        this.form.appendChild(message);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div style="background: #ef4444; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                <i class="fas fa-exclamation-circle"></i>
                Sorry, there was an error sending your message. Please try again or call us directly.
            </div>
        `;
        
        this.form.appendChild(message);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// ===== PACKAGE COMPARISON =====
class PackageComparison {
    constructor() {
        this.init();
    }

    init() {
        // Add comparison functionality if needed
        this.addPackageHoverEffects();
    }

    addPackageHoverEffects() {
        document.querySelectorAll('.package-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('popular')) {
                    card.style.transform = 'translateY(-5px) scale(1.05)';
                } else {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }
}

// ===== PRICING CALCULATOR =====
class WeddingPricingCalculator {
    constructor() {
        this.basePrices = {
            'industry-standard': 2499,
            'ceremony-support': 3199,
            'ultimate-party': 4499
        };
        this.init();
    }

    init() {
        // Add any pricing calculation logic here
        this.addPricingTooltips();
    }

    addPricingTooltips() {
        document.querySelectorAll('.package-price').forEach(priceElement => {
            priceElement.addEventListener('mouseenter', () => {
                this.showPricingBreakdown(priceElement);
            });
            
            priceElement.addEventListener('mouseleave', () => {
                this.hidePricingBreakdown();
            });
        });
    }

    showPricingBreakdown(element) {
        // Add tooltip with pricing breakdown
        const tooltip = document.createElement('div');
        tooltip.className = 'pricing-tooltip';
        tooltip.innerHTML = `
            <div style="position: absolute; background: #1a1a1a; color: white; padding: 0.5rem; border-radius: 4px; font-size: 0.8rem; z-index: 1000; white-space: nowrap;">
                All-inclusive pricing • No hidden fees
            </div>
        `;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
    }

    hidePricingBreakdown() {
        document.querySelectorAll('.pricing-tooltip').forEach(tooltip => {
            tooltip.remove();
        });
    }
}

// ===== INITIALIZE WEDDING PAGE COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    new PackageSelection();
    new WeddingContactForm();
    new PackageComparison();
    new WeddingPricingCalculator();
});

// ===== PERFORMANCE OPTIMIZATIONS =====
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

// Throttled scroll handler for performance
const throttledScrollHandler = throttle(() => {
    // Add any scroll-based functionality here
}, 16);

window.addEventListener('scroll', throttledScrollHandler);
