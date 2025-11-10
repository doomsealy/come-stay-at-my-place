// Script to fetch Google reviews once and save them to a file
// Run this with: node fetch-and-save-reviews.js

async function fetchAndSaveReviews() {
    console.log('🔍 Fetching Google reviews...\n');

    try {
        const apiKey = 'AIzaSyDxmTaxKpj-4obKzHVaMxEBkEQgqi7rkpk';
        
        // First, search for the place
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=DJ%20Bigg%20Slim%20Events%20St%20Lucia&inputtype=textquery&fields=place_id,name,rating,user_ratings_total&key=${apiKey}`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.candidates || searchData.candidates.length === 0) {
            throw new Error('Place not found');
        }

        const place = searchData.candidates[0];
        console.log(`✅ Found: ${place.name}`);
        console.log(`⭐ Rating: ${place.rating} (${place.user_ratings_total} total reviews)\n`);

        // Get the reviews
        const reviewsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=reviews,name,rating,user_ratings_total&key=${apiKey}`;
        
        const reviewsResponse = await fetch(reviewsUrl);
        const reviewsData = await reviewsResponse.json();

        if (!reviewsData.result || !reviewsData.result.reviews) {
            throw new Error('No reviews found');
        }

        const reviews = reviewsData.result.reviews.map(review => ({
            author_name: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.time * 1000, // Convert to milliseconds
            profile_photo_url: review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=0298dd&color=fff`,
            relative_time_description: review.relative_time_description
        }));

        console.log(`📦 Fetched ${reviews.length} reviews\n`);
        
        // Display the reviews in a format you can copy
        console.log('========================================');
        console.log('COPY THE REVIEWS BELOW:');
        console.log('========================================\n');
        
        console.log('const staticReviews = ' + JSON.stringify(reviews, null, 4) + ';');
        
        console.log('\n========================================');
        console.log('✅ Done! Copy the code above and paste it into your reviews file.');
        console.log('========================================');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fetchAndSaveReviews();

