// ===== MINNESOTA PAGE FUNCTIONALITY =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileNavigation();
    new SmoothScrolling();
    new NavbarScrollEffect();
    new ContactForm();
    new ScrollAnimations();
    new MinnesotaContactForm();

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

// ===== MINNESOTA CONTACT FORM =====
class MinnesotaContactForm {
    constructor() {
        this.form = document.getElementById('minnesota-contact-form');
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
        
        // Add Minnesota specific data
        data.serviceType = 'Minnesota Events';
        data.location = 'Minnesota';
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
            console.error('Error sending Minnesota inquiry:', error);
            this.showErrorMessage();
        } finally {
            // Reset button
            const submitBtn = this.form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div style="background: #10b981; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                <i class="fas fa-check-circle"></i>
                Thank you! We've received your inquiry and will contact you soon.
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
                Sorry, there was an error sending your message. Please try again or call us directly at 1-612-239-0394.
            </div>
        `;
        
        this.form.appendChild(message);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

