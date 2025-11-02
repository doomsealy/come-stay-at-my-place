// ===== BOOKING CALENDAR FUNCTIONALITY =====
class BookingCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.bookedDates = new Set([
            '2025-01-15', '2025-01-22', '2025-02-14', '2025-02-28',
            '2025-03-15', '2025-03-29', '2025-04-12', '2025-04-26'
        ]); // Example booked dates
        this.limitedDates = new Set([
            '2025-01-18', '2025-02-08', '2025-03-08', '2025-04-05'
        ]); // Example limited availability dates
        
        this.init();
    }

    init() {
        this.renderCalendar();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    renderCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentMonth = document.getElementById('currentMonth');
        currentMonth.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const firstDayWeekday = firstDayOfMonth.getDay();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayWeekday; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const dateString = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const today = new Date();

            // Don't allow booking past dates
            if (dayDate < today) {
                dayElement.classList.add('other-month');
            } else if (this.bookedDates.has(dateString)) {
                dayElement.classList.add('booked');
            } else if (this.limitedDates.has(dateString)) {
                dayElement.classList.add('limited');
            } else {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => this.selectDate(dateString, dayElement));
            }

            if (this.selectedDate === dateString) {
                dayElement.classList.add('selected');
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    selectDate(dateString, dayElement) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection to clicked day
        dayElement.classList.add('selected');
        this.selectedDate = dateString;

        // Update the selected date input
        const selectedDateInput = document.getElementById('selectedDate');
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        selectedDateInput.value = formattedDate;
    }
}

// ===== PACKAGE PRICING CALCULATOR =====
class PricingCalculator {
    constructor() {
        this.packagePrices = {
            industry: 2499,
            ceremony: 3199,
            ultimate: 4499
        };

        this.addonPrices = {
            'ceremony-audio': 349,
            'cold-sparks': 299,
            'wireless-uplights': 299,
            'extra-hour': 300,
            'dancefloor-lighting': 399,
            'large-crowd-sound': 0 // Quote-based, no fixed price
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTotal();
    }

    setupEventListeners() {
        // Package selection listeners
        document.querySelectorAll('input[name="package"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateTotal());
        });

        // Add-on selection listeners
        document.querySelectorAll('input[name="addons"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateTotal());
        });

        // Standalone option listeners
        document.querySelectorAll('input[name="standalone"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    // Uncheck all package options
                    document.querySelectorAll('input[name="package"]').forEach(pkg => pkg.checked = false);
                }
                this.updateTotal();
            });
        });

        // Package selection should uncheck standalone
        document.querySelectorAll('input[name="package"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    document.querySelectorAll('input[name="standalone"]').forEach(standalone => standalone.checked = false);
                }
                this.updateTotal();
            });
        });
    }

    updateTotal() {
        // Get selected package or standalone option
        const selectedPackage = document.querySelector('input[name="package"]:checked');
        const selectedStandalone = document.querySelector('input[name="standalone"]:checked');
        
        let packagePrice = 0;
        let packageLabel = '';
        
        if (selectedPackage) {
            packagePrice = this.packagePrices[selectedPackage.value];
            packageLabel = 'Package Total:';
        } else if (selectedStandalone) {
            packagePrice = 1599; // DJ-only price
            packageLabel = 'DJ Services:';
        }

        // Get selected add-ons
        const selectedAddons = document.querySelectorAll('input[name="addons"]:checked');
        let addonsPrice = 0;
        let hasQuoteItem = false;
        
        selectedAddons.forEach(addon => {
            if (addon.value === 'large-crowd-sound') {
                hasQuoteItem = true;
            } else {
                addonsPrice += this.addonPrices[addon.value] || 0;
            }
        });

        // Update package label
        const packageTotalLabel = document.querySelector('.total-line:first-child span:first-child');
        if (packageTotalLabel) {
            packageTotalLabel.textContent = packageLabel;
        }

        // Update display
        document.getElementById('packageTotal').textContent = `$${packagePrice.toLocaleString()}`;
        
        if (hasQuoteItem) {
            document.getElementById('addonsTotal').textContent = `$${addonsPrice.toLocaleString()} + Quote`;
            document.getElementById('finalTotal').textContent = `$${(packagePrice + addonsPrice).toLocaleString()} + Quote`;
        } else {
            document.getElementById('addonsTotal').textContent = `$${addonsPrice.toLocaleString()}`;
            document.getElementById('finalTotal').textContent = `$${(packagePrice + addonsPrice).toLocaleString()}`;
        }
    }
}

// ===== BOOKING FORM HANDLER =====
class BookingFormHandler {
    constructor() {
        this.form = document.querySelector('.wedding-booking-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate date selection
        const selectedDate = document.getElementById('selectedDate').value;
        if (!selectedDate) {
            alert('Please select a wedding date from the calendar.');
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const bookingData = {
            date: selectedDate,
            package: formData.get('package'),
            addons: formData.getAll('addons'),
            clientName: formData.get('clientName'),
            clientEmail: formData.get('clientEmail'),
            clientPhone: formData.get('clientPhone'),
            guestCount: formData.get('guestCount'),
            venue: formData.get('venue'),
            specialRequests: formData.get('specialRequests'),
            total: document.getElementById('finalTotal').textContent
        };

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate booking processing
        setTimeout(() => {
            this.showBookingConfirmation(bookingData);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
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
                        Thank you ${bookingData.clientName}! We've received your wedding booking request for 
                        <strong>${bookingData.date}</strong>. We'll contact you within 24 hours to confirm 
                        availability and arrange payment.
                    </p>
                    <div style="
                        background: #f8fafc;
                        padding: 1.5rem;
                        border-radius: 8px;
                        margin-bottom: 2rem;
                        text-align: left;
                    ">
                        <p><strong>Package:</strong> ${bookingData.package}</p>
                        <p><strong>Total:</strong> ${bookingData.total}</p>
                        <p><strong>Email:</strong> ${bookingData.clientEmail}</p>
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
            
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

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
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
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
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
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
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .pricing-card, .feature-item');
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

// ===== SAINT LUCIA VIDEO =====
class SaintLuciaVideo {
    constructor() {
        this.video = document.getElementById('saint-lucia-video');
        this.init();
    }

    init() {
        if (this.video) {
            // Handle video load success
            this.video.addEventListener('loadeddata', () => {
                console.log('Saint Lucia video loaded successfully');
            });

            // Handle video load failure
            this.video.addEventListener('error', () => {
                console.log('Saint Lucia video failed to load, using fallback image');
            });

            // Ensure video plays on mobile (muted by default)
            this.video.addEventListener('canplay', () => {
                this.video.play().catch(e => {
                    console.log('Autoplay prevented on this device');
                });
            });
        }
    }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new SaintLuciaVideo();
    new BookingCalendar();
    new PricingCalculator();
    new BookingFormHandler();
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

const throttledScroll = throttle(() => {
    // Additional scroll handlers
}, 16);

window.addEventListener('scroll', throttledScroll);

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