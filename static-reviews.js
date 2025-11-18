// Static Google Reviews for DJ Bigg Slim Events
// Last updated: November 10, 2024
// To add new reviews: Copy this format and add them to the array

const staticReviews = [
    {
        "author_name": "LaToya L",
        "rating": 5,
        "text": "I can't lie I was so nervous not having met the Dj or knowing his work prior to or wedding. As a bride you want everything PERFECT. Words can not describe how amazing DJ Bigg Slim was for our wedding. He felt our energy and gave what needed to be given!!! We tried to not let the party end!!!\n\nTHANK YOU!!!!!! -Mrs.Alexander",
        "time": 1752848518000,
        "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjXYyPnwES9yRmhDOnvMSiASUBITbdbROVINSZ82Z9_EcBc_jH2p=s128-c0x00000000-cc-rp-mo",
        "relative_time_description": "3 months ago"
    },
    {
        "author_name": "Rhiana Barrows",
        "rating": 5,
        "text": "DJ Big Slim was so fun and kept the vibes high allll night! He introduced everyone I wanted and made everyone feel special! I highly recommend him for your wedding or any fun event that you want to have good music at!",
        "time": 1761571149000,
        "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjUn03bvgj_Yu0Rv55iP_uhWeZXI6A9FkfSu7vXnp3fFQKSreL5G=s128-c0x00000000-cc-rp-mo",
        "relative_time_description": "a week ago"
    },
    {
        "author_name": "Christina St. Fleur",
        "rating": 5,
        "text": "The Best Sound Team in St. Lucia!\n\nWorking with DJ Big Slim and his team was an absolute dream! Sound was one of the most important aspects of our wedding—especially for a Haitian wedding where music and energy are everything—and they delivered flawlessly.\n\nThe sound quality was crystal clear and perfectly balanced, making every moment—from the ceremony to the party—feel like a world-class production. As the groom is a DJ and sound engineer, having top-tier sound was non-negotiable, and DJ Big Slim did not disappoint!\n\nEven though we had our own DJ, we would hire this team in a heartbeat for DJ services because their energy and professionalism are unmatched. Not only did they handle our sound seamlessly, but the entire team partied and vibed with us, which made the experience that much more special.\n\nIf you want a worry-free, unforgettable, and next-level sound experience, this is hands down the best sound company on the island!",
        "time": 1753975216000,
        "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjXcY3E5KaAYOtlluJQupkY47nHZq3VFdgjVy-kiItT5_ZPMgCMEqg=s128-c0x00000000-cc-rp-mo-ba2",
        "relative_time_description": "3 months ago"
    },
    {
        "author_name": "Sarah Newell",
        "rating": 5,
        "text": "DJ Bigg Slim was EVERYTHING!\nWe had the absolute best time at our wedding at the Royalton Saint Lucia, and a huge part of that was thanks to DJ Bigg Slim. He MADE the night! From start to finish, the energy was incredible—our friends and family were on the dance floor the entire time. He was not only so fun but also incredibly professional.\n\nWe gave him a general idea of the music we were into, and he completely understood our vibe. He pulled out the perfect songs, kept the momentum going all night, and made sure everyone—young and old—was having a blast. The transitions were smooth, the song choices were spot-on, and when the night was supposed to end, he even gave us a few encore tracks to keep the party going just a little longer.\n\nWe seriously couldn't have imagined a better night or a better DJ. If you're lucky enough to have DJBiggSlim at your event—prepare for a wild time. Five stars isn't enough!\n\nThank you!!\nSarah & Chris",
        "time": 1744933767000,
        "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjULVWHMcGcGlYtlray4pMUN4eeabdF1JkeJsN33SLk4Dus3IB7T=s128-c0x00000000-cc-rp-mo",
        "relative_time_description": "6 months ago"
    },
    {
        "author_name": "Lauren Copper",
        "rating": 5,
        "text": "DJ Bigg Slim.\nOur wedding DJ at thr Royalton Resort!\nDown to earth, attentive to the tracks chosen, noticed where we missed tracks and ensured it was picked up before we began.\nFrom the moment we were introduced we knew it was going to be a vibe!\nA vibe it was, all evening!\nWe were a smaller wedding but the music felt big and everyone was pretty much dancing all night.\nReally cannot thank him so much.\n\nMr & Mrs Powell",
        "time": 1748345379000,
        "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjWN_EwtGNRtRe52IajossjLJw5z7Mu28VEaOlA8Fg_DowYFZ14x=s128-c0x00000000-cc-rp-mo",
        "relative_time_description": "5 months ago"
    }
];

// Function to create review HTML
function createReviewCard(review, isActive = false) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    return `
        <div class="review-card ${isActive ? 'active' : ''}">
            <div class="review-stars">
                ${stars.split('').map(star => `<i class="fas fa-star${star === '☆' ? '-o' : ''}"></i>`).join('')}
            </div>
            <p class="review-text">${review.text}</p>
            <div class="review-author">
                <img src="${review.profile_photo_url}" alt="${review.author_name}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=0298dd&color=fff'">
                <div class="author-info">
                    <span class="author-name">${review.author_name}</span>
                    <span class="author-event">Google Review • ${review.relative_time_description}</span>
                </div>
            </div>
        </div>
    `;
}

// Function to initialize the reviews carousel
function initializeReviewsCarousel() {
    const reviewsSlider = document.querySelector('.reviews-slider');
    
    if (reviewsSlider && staticReviews.length > 0) {
        // Inject all reviews into the slider
        reviewsSlider.innerHTML = staticReviews.map((review, index) => 
            createReviewCard(review, index === 0)
        ).join('');
        
        console.log(`✅ Loaded ${staticReviews.length} static Google reviews`);
        
        // Wait for ReviewsCarousel to be available
        function tryInitCarousel(attempts = 0) {
            if (window.ReviewsCarousel && typeof window.ReviewsCarousel === 'function') {
                // Stop existing carousel if it exists
                if (window.reviewsCarouselInstance) {
                    window.reviewsCarouselInstance.stopCarousel();
                }
                
                // Create new carousel instance
                window.reviewsCarouselInstance = new window.ReviewsCarousel();
                console.log('✅ Reviews carousel initialized successfully');
            } else if (attempts < 20) {
                // Retry after 50ms (max 20 attempts = 1 second total)
                setTimeout(() => tryInitCarousel(attempts + 1), 50);
            } else {
                console.error('❌ ReviewsCarousel class not found after 1 second');
            }
        }
        
        // Start trying to initialize
        tryInitCarousel();
    } else {
        console.error('❌ Reviews slider not found or no reviews to load');
    }
}

// Load reviews when DOM is ready
document.addEventListener('DOMContentLoaded', initializeReviewsCarousel);

// Export for use elsewhere if needed
if (typeof window !== 'undefined') {
    window.staticReviews = staticReviews;
}

