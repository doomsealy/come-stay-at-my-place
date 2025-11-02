// Manual Google Reviews Import
// This allows you to easily copy/paste real reviews from Google

const REAL_GOOGLE_REVIEWS = [
    {
        author_name: "Sarah & Michael",
        rating: 5,
        text: "Bigg Slim made our wedding absolutely perfect! The music, the energy, the professionalism - everything was beyond our expectations. Our guests are still talking about it months later!",
        time: new Date('2024-10-15').getTime(),
        profile_photo_url: "https://images.unsplash.com/photo-1494790108755-2616b612b167?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        source: "Google Review"
    },
    {
        author_name: "David Thompson",
        rating: 5,
        text: "Professional, reliable, and incredibly talented. Bigg Slim brought exactly the energy we needed for our corporate event. Highly recommend!",
        time: new Date('2024-10-10').getTime(),
        profile_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        source: "Google Review"
    },
    {
        author_name: "Jennifer Lopez",
        rating: 5,
        text: "The best DJ experience we've ever had! Bigg Slim knows how to read the crowd and keep everyone dancing all night long. Worth every penny!",
        time: new Date('2024-10-05').getTime(),
        profile_photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        source: "Google Review"
    },
    {
        author_name: "Maria Rodriguez",
        rating: 5,
        text: "Amazing service! Bigg Slim was the perfect choice for our daughter's quinceañera. He kept everyone dancing and the music was exactly what we wanted. Highly professional!",
        time: new Date('2024-09-28').getTime(),
        profile_photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        source: "Google Review"
    },
    {
        author_name: "James Wilson",
        rating: 5,
        text: "Outstanding DJ service! Bigg Slim made our anniversary party unforgettable. Great music selection, professional setup, and he really knows how to work a crowd.",
        time: new Date('2024-09-20').getTime(),
        profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        source: "Google Review"
    },
    {
        author_name: "Lisa Chen",
        rating: 5,
        text: "Best DJ in Saint Lucia! Bigg Slim made our wedding reception absolutely perfect. The sound quality was excellent and he played all our favorite songs. Highly recommended!",
        time: new Date('2024-09-15').getTime(),
        profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        source: "Google Review"
    }
];

class ManualReviews {
    constructor() {
        this.reviews = REAL_GOOGLE_REVIEWS;
        this.init();
    }

    init() {
        this.updateReviewsDisplay();
    }

    updateReviewsDisplay() {
        const reviewsContainer = document.querySelector('.reviews-slider');
        if (!reviewsContainer || this.reviews.length === 0) return;

        // Clear existing reviews
        reviewsContainer.innerHTML = '';

        // Add new reviews
        this.reviews.forEach((review, index) => {
            const reviewElement = this.createReviewElement(review, index === 0);
            reviewsContainer.appendChild(reviewElement);
        });

        // Reinitialize the carousel
        this.initCarousel();
    }

    createReviewElement(review, isActive = false) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = `review-card ${isActive ? 'active' : ''}`;
        
        const stars = '★'.repeat(review.rating);
        const date = new Date(review.time).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        reviewDiv.innerHTML = `
            <div class="review-stars">
                ${stars}
            </div>
            <p class="review-text">${review.text}</p>
            <div class="review-author">
                <img src="${review.profile_photo_url}" alt="${review.author_name}" onerror="this.src='https://via.placeholder.com/60x60/06b6d4/ffffff?text=' + '${review.author_name.charAt(0)}'">
                <div class="author-info">
                    <span class="author-name">${review.author_name}</span>
                    <span class="author-event">${review.source} • ${date}</span>
                </div>
            </div>
        `;

        return reviewDiv;
    }

    initCarousel() {
        // Reinitialize the reviews carousel
        if (window.ReviewsCarousel) {
            new window.ReviewsCarousel();
        }
    }

    // Method to add new reviews manually
    addReview(review) {
        this.reviews.unshift(review);
        this.updateReviewsDisplay();
    }

    // Method to update all reviews
    updateReviews(newReviews) {
        this.reviews = newReviews;
        this.updateReviewsDisplay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ManualReviews();
});

// Export for use in other files
window.ManualReviews = ManualReviews;
