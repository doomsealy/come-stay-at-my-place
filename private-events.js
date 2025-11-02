// ===== PRIVATE EVENTS PAGE FUNCTIONALITY =====

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

// ===== CONTACT FORM ENHANCEMENTS =====
class PrivateEventsContactForm {
    constructor() {
        this.form = document.getElementById('private-events-contact-form');
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
        
        // Add private events specific data
        data.serviceType = 'Private Events';
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
            console.error('Error sending private events inquiry:', error);
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
                Thank you! We've received your private event inquiry and will contact you soon.
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

// ===== EVENT TYPE SELECTION TRACKING =====
class EventTypeSelection {
    constructor() {
        this.init();
    }

    init() {
        // Track event type card clicks
        document.querySelectorAll('.event-type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const eventType = card.querySelector('h3').textContent;
                this.selectEventType(eventType);
            });
        });
    }

    selectEventType(eventType) {
        const eventTypeSelect = document.getElementById('event-type');
        if (eventTypeSelect) {
            // Find matching option
            const options = eventTypeSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.textContent.toLowerCase().includes(eventType.toLowerCase())) {
                    option.selected = true;
                }
            });
            
            // Scroll to contact form
            document.getElementById('contact').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }
}

// ===== PACKAGE CARD INTERACTIONS =====
class PackageCardInteractions {
    constructor() {
        this.init();
    }

    init() {
        // Add hover effects and click tracking
        document.querySelectorAll('.package-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            
            card.addEventListener('click', () => {
                this.trackPackageInterest(card);
            });
        });
    }

    trackPackageInterest(card) {
        const packageName = card.querySelector('.package-name').textContent;
        console.log('Package interest:', packageName);
        
        // You could send this data to analytics or store it for later use
        // For now, just log it
    }
}

// ===== INITIALIZE PRIVATE EVENTS PAGE COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    new PrivateEventsContactForm();
    new EventTypeSelection();
    new PackageCardInteractions();
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
