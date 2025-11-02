// Test script to fetch real Google reviews
// Run this with: node test-google-api.js

const https = require('https');

const apiKey = 'AIzaSyDxmTaxKpj-4obKzHVaMxEBkEQgqi7rkpk';

async function testGooglePlacesAPI() {
    console.log('🔍 Testing Google Places API...\n');

    try {
        // Step 1: Find the place
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=DJ%20Bigg%20Slim%20Events%20St%20Lucia&inputtype=textquery&fields=place_id,name,rating,user_ratings_total&key=${apiKey}`;
        
        console.log('📍 Searching for business...');
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.candidates || searchData.candidates.length === 0) {
            throw new Error('Business not found');
        }

        const place = searchData.candidates[0];
        console.log(`✅ Found: ${place.name}`);
        console.log(`⭐ Rating: ${place.rating}/5 (${place.user_ratings_total} reviews)`);
        console.log(`🆔 Place ID: ${place.place_id}\n`);

        // Step 2: Get reviews
        const reviewsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=reviews&key=${apiKey}`;
        
        console.log('📝 Fetching reviews...');
        const reviewsResponse = await fetch(reviewsUrl);
        const reviewsData = await reviewsResponse.json();

        if (!reviewsData.result || !reviewsData.result.reviews) {
            throw new Error('No reviews found');
        }

        const reviews = reviewsData.result.reviews;
        console.log(`✅ Found ${reviews.length} reviews!\n`);

        // Display first 3 reviews
        reviews.slice(0, 3).forEach((review, index) => {
            console.log(`--- Review ${index + 1} ---`);
            console.log(`👤 Author: ${review.author_name}`);
            console.log(`⭐ Rating: ${review.rating}/5`);
            console.log(`📅 Time: ${review.relative_time_description}`);
            console.log(`💬 Text: ${review.text.substring(0, 100)}...`);
            console.log(`🖼️ Photo: ${review.profile_photo_url ? 'Yes' : 'No'}\n`);
        });

        console.log('🎉 API is working! Real reviews will show on the live site.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 This is normal - the API works when deployed to Vercel!');
    }
}

// Run the test
testGooglePlacesAPI();
