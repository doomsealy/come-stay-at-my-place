// Backend Integration for Bigg Slim Events & Entertainment
// Handles Firebase Firestore and Stripe payments

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

// ===== FIREBASE INTEGRATION =====
class FirebaseService {
    constructor() {
        this.db = db;
    }

    // Save contact form submission
    async saveContactForm(formData) {
        try {
            const docRef = await addDoc(collection(this.db, 'contact_inquiries'), {
                ...formData,
                timestamp: serverTimestamp(),
                status: 'new',
                source: 'website'
            });
            console.log('Contact form saved with ID: ', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error saving contact form: ', error);
            return { success: false, error: error.message };
        }
    }

    // Save booking request
    async saveBookingRequest(bookingData) {
        try {
            const docRef = await addDoc(collection(this.db, 'booking_requests'), {
                ...bookingData,
                timestamp: serverTimestamp(),
                status: 'pending',
                source: 'website'
            });
            console.log('Booking request saved with ID: ', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error saving booking request: ', error);
            return { success: false, error: error.message };
        }
    }

    // Save payment record
    async savePaymentRecord(paymentData) {
        try {
            const docRef = await addDoc(collection(this.db, 'payments'), {
                ...paymentData,
                timestamp: serverTimestamp(),
                status: 'completed'
            });
            console.log('Payment record saved with ID: ', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error saving payment record: ', error);
            return { success: false, error: error.message };
        }
    }

    // Check date availability
    async checkDateAvailability(date) {
        try {
            const q = query(
                collection(this.db, 'booking_requests'),
                where('eventDate', '==', date),
                where('status', 'in', ['confirmed', 'pending'])
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty; // true if available
        } catch (error) {
            console.error('Error checking date availability: ', error);
            return false;
        }
    }
}

// ===== STRIPE INTEGRATION =====
class StripeService {
    constructor() {
        this.stripePromise = stripePromise;
    }

    // Create payment intent
    async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // Convert to cents
                    currency,
                    metadata
                })
            });

            const { clientSecret } = await response.json();
            return { success: true, clientSecret };
        } catch (error) {
            console.error('Error creating payment intent: ', error);
            return { success: false, error: error.message };
        }
    }

    // Process payment
    async processPayment(clientSecret, elements, confirmParams) {
        try {
            const stripe = await this.stripePromise;
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams,
                redirect: 'if_required'
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, paymentIntent };
        } catch (error) {
            console.error('Error processing payment: ', error);
            return { success: false, error: error.message };
        }
    }
}

// ===== FORM HANDLERS =====
class FormHandlers {
    constructor() {
        this.firebase = new FirebaseService();
        this.stripe = new StripeService();
        this.init();
    }

    init() {
        this.setupContactForms();
        this.setupBookingForms();
        this.setupPaymentForms();
    }

    setupContactForms() {
        document.querySelectorAll('.inquiry-form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleContactForm(e));
        });
    }

    setupBookingForms() {
        document.querySelectorAll('.wedding-booking-form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleBookingForm(e));
        });
    }

    setupPaymentForms() {
        // Payment forms will be set up when Stripe Elements are loaded
    }

    async handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add additional metadata
            data.pageUrl = window.location.href;
            data.userAgent = navigator.userAgent;
            data.timestamp = new Date().toISOString();

            const result = await this.firebase.saveContactForm(data);
            
            if (result.success) {
                this.showSuccessMessage('Thank you! Your inquiry has been sent successfully. We\'ll get back to you within 24 hours!');
                form.reset();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            this.showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleBookingForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add additional metadata
            data.pageUrl = window.location.href;
            data.userAgent = navigator.userAgent;
            data.timestamp = new Date().toISOString();
            data.totalAmount = this.calculateTotal(data);

            // Check date availability
            if (data.eventDate) {
                const isAvailable = await this.firebase.checkDateAvailability(data.eventDate);
                if (!isAvailable) {
                    throw new Error('Sorry, this date is no longer available. Please select another date.');
                }
            }

            const result = await this.firebase.saveBookingRequest(data);
            
            if (result.success) {
                this.showBookingConfirmation(data);
                form.reset();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error submitting booking form:', error);
            this.showErrorMessage(error.message || 'Sorry, there was an error processing your booking. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    calculateTotal(data) {
        const packagePrices = {
            industry: 2499,
            ceremony: 3199,
            ultimate: 4499
        };

        const addonPrices = {
            'ceremony-audio': 349,
            'cold-sparks': 299,
            'wireless-uplights': 299,
            'extra-hour': 300,
            'dancefloor-lighting': 399
        };

        let total = 0;
        
        // Add package price
        if (data.package && packagePrices[data.package]) {
            total += packagePrices[data.package];
        }

        // Add addon prices
        if (data.addons) {
            const addons = Array.isArray(data.addons) ? data.addons : [data.addons];
            addons.forEach(addon => {
                if (addonPrices[addon]) {
                    total += addonPrices[addon];
                }
            });
        }

        return total;
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <div style="
                background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                margin: 1rem 0;
                text-align: center;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            ">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                ${message}
            </div>
        `;
        
        // Insert after the form
        const form = document.querySelector('.inquiry-form, .wedding-booking-form');
        if (form) {
            form.parentNode.insertBefore(messageDiv, form.nextSibling);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    showBookingConfirmation(bookingData) {
        const confirmation = document.createElement('div');
        confirmation.className = 'booking-confirmation';
        confirmation.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 3rem;
                    border-radius: 20px;
                    max-width: 500px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #10b981, #059669);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 2rem;
                    ">
                        <i class="fas fa-check" style="font-size: 2rem; color: white;"></i>
                    </div>
                    <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: #1a1a1a;">
                        Booking Request Received!
                    </h3>
                    <p style="margin-bottom: 1.5rem; color: #4a5568; line-height: 1.6;">
                        Thank you ${bookingData.name || 'for your interest'}! We've received your booking request for 
                        <strong>${bookingData.eventDate || 'your event'}</strong>. We'll contact you within 24 hours to confirm 
                        availability and arrange payment.
                    </p>
                    <div style="
                        background: #f8fafc;
                        padding: 1.5rem;
                        border-radius: 8px;
                        margin-bottom: 2rem;
                        text-align: left;
                    ">
                        <p><strong>Package:</strong> ${bookingData.package || 'Custom'}</p>
                        <p><strong>Total:</strong> $${bookingData.totalAmount || 'TBD'}</p>
                        <p><strong>Email:</strong> ${bookingData.email || 'N/A'}</p>
                    </div>
                    <button onclick="this.closest('.booking-confirmation').remove()" style="
                        background: linear-gradient(135deg, #06b6d4, #0ea5e9);
                        color: white;
                        border: none;
                        padding: 0.75rem 2rem;
                        border-radius: 50px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(confirmation);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.remove();
            }
        }, 10000);
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    new FormHandlers();
});

// Export for use in other files
export { FirebaseService, StripeService, FormHandlers };
