// Disturbia Mas - Website JavaScript
// Handles scroll effects and form submissions

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const observerOptions = {
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
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== FORM SUBMISSION =====
class DisturbiaSignup {
    constructor() {
        this.form = document.getElementById('disturbiaSignupForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.submit-button');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this.form);
            const data = {
                firstName: formData.get('firstName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                interest: formData.get('interest'),
                timestamp: serverTimestamp(),
                source: 'disturbia-mas-website',
                status: 'new',
                campaign: 'carnival-2026'
            };

            // Save to Firebase
            const docRef = await addDoc(collection(db, 'disturbia_signups'), data);
            console.log('Signup saved with ID: ', docRef.id);

            // Show success message
            this.showSuccess();
            this.form.reset();

            // Track conversion (if you have analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-XXXXX/XXXXX',
                    'value': 1.0,
                    'currency': 'USD'
                });
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showError();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Success! You're on the list. We'll contact you as soon as registration opens.
        `;
        
        this.form.parentNode.insertBefore(successDiv, this.form.nextSibling);

        // Remove message after 8 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 8000);
    }

    showError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'success-message';
        errorDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            Something went wrong. Please try again or email us directly at info@disturbiamas.com
        `;
        
        this.form.parentNode.insertBefore(errorDiv, this.form.nextSibling);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 8000);
    }
}

// ===== PHONE NUMBER FORMATTING =====
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as +1 (XXX) XXX-XXXX for Caribbean numbers
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `+1 (${value}`;
            } else if (value.length <= 6) {
                value = `+1 (${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `+1 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        e.target.value = value;
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Disturbia Mas - Loading...');
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup smooth scrolling
    setupSmoothScroll();
    
    // Initialize signup form
    new DisturbiaSignup();
    
    // Setup phone formatting
    setupPhoneFormatting();
    
    console.log('✨ Disturbia Mas - Ready!');
});

// ===== EXPORT FOR USE IN OTHER FILES =====
export { DisturbiaSignup };

