// ===== EQUIPMENT RENTALS PAGE FUNCTIONALITY =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileNavigation();
    new SmoothScrolling();
    new NavbarScrollEffect();
    new ContactForm();
    new ScrollAnimations();
    new EquipmentRentalForm();

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

// ===== EQUIPMENT RENTAL FORM =====
class EquipmentRentalForm {
    constructor() {
        this.form = document.getElementById('equipment-rental-form');
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
        
        // Collect all selected equipment (multiple checkboxes)
        const selectedEquipment = [];
        const checkboxes = this.form.querySelectorAll('input[name="equipment-needed"]:checked');
        checkboxes.forEach(checkbox => {
            selectedEquipment.push(checkbox.value);
        });
        
        // Validate that at least one equipment item is selected
        if (selectedEquipment.length === 0) {
            this.showValidationError('Please select at least one equipment item.');
            return;
        }
        
        // Add equipment rental specific data
        data.serviceType = 'Equipment Rental';
        data.equipmentSelected = selectedEquipment; // Array of selected equipment
        data.equipmentNeeded = selectedEquipment.join(', '); // Also as comma-separated string for compatibility
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
            console.error('Error sending equipment rental inquiry:', error);
            this.showErrorMessage();
        } finally {
            // Reset button
            const submitBtn = this.form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Request Quote';
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
                Thank you! We've received your equipment rental request and will contact you soon with a quote.
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

    showValidationError(errorMessage) {
        // Remove any existing validation messages
        const existingMessage = this.form.querySelector('.validation-error');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = 'validation-error';
        message.innerHTML = `
            <div style="background: #f59e0b; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                <i class="fas fa-exclamation-triangle"></i>
                ${errorMessage}
            </div>
        `;
        
        this.form.insertBefore(message, this.form.querySelector('button[type="submit"]'));
        
        // Scroll to error message
        message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// ===== EQUIPMENT CARD INTERACTIONS =====
class EquipmentCardInteractions {
    constructor() {
        this.init();
    }

    init() {
        // Add hover effects and click tracking
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
            
            card.addEventListener('click', () => {
                this.trackEquipmentInterest(card);
            });
        });
    }

    trackEquipmentInterest(card) {
        const equipmentName = card.querySelector('h3').textContent;
        console.log('Equipment interest:', equipmentName);
        
        // Map equipment names to checkbox values
        const equipmentMap = {
            'Sound Systems': 'sound-system',
            'Wireless Microphones': 'microphones',
            'LED Lighting': 'lighting',
            'DJ Equipment': 'dj-equipment',
            'Mixers & Audio Control': 'mixers',
            'Special Effects': 'special-effects'
        };
        
        // Find matching checkbox and toggle it
        const checkboxValue = equipmentMap[equipmentName];
        if (checkboxValue) {
            const checkbox = document.querySelector(`input[name="equipment-needed"][value="${checkboxValue}"]`);
            if (checkbox) {
                checkbox.checked = !checkbox.checked; // Toggle checkbox
                // Trigger change event to update styling
                checkbox.dispatchEvent(new Event('change'));
            }
        }
        
        // Scroll to contact form
        document.getElementById('contact').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// ===== INITIALIZE EQUIPMENT RENTALS PAGE COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    new EquipmentCardInteractions();
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

