#!/usr/bin/env node

// Setup script for Bigg Slim Events website
// This script helps configure Firebase and Stripe credentials

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🎵 Bigg Slim Events - Website Setup');
console.log('=====================================\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function setupFirebase() {
    console.log('🔥 Firebase Setup');
    console.log('1. Go to https://console.firebase.google.com/');
    console.log('2. Create a new project called "bigg-slim-events"');
    console.log('3. Enable Firestore Database');
    console.log('4. Go to Project Settings > General > Your apps');
    console.log('5. Add a web app and copy the config\n');

    const apiKey = await askQuestion('Enter your Firebase API Key: ');
    const authDomain = await askQuestion('Enter your Firebase Auth Domain: ');
    const projectId = await askQuestion('Enter your Firebase Project ID: ');
    const storageBucket = await askQuestion('Enter your Firebase Storage Bucket: ');
    const messagingSenderId = await askQuestion('Enter your Firebase Messaging Sender ID: ');
    const appId = await askQuestion('Enter your Firebase App ID: ');

    const firebaseConfig = `// Firebase Configuration
const firebaseConfig = {
    apiKey: "${apiKey}",
    authDomain: "${authDomain}",
    projectId: "${projectId}",
    storageBucket: "${storageBucket}",
    messagingSenderId: "${messagingSenderId}",
    appId: "${appId}"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);

export { db, functions };`;

    fs.writeFileSync('firebase-config.js', firebaseConfig);
    console.log('✅ Firebase config saved!\n');
}

async function setupStripe() {
    console.log('💳 Stripe Setup');
    console.log('1. Go to https://dashboard.stripe.com/');
    console.log('2. Get your Publishable Key and Secret Key');
    console.log('3. Use test keys for now (pk_test_... and sk_test_...)\n');

    const publishableKey = await askQuestion('Enter your Stripe Publishable Key: ');
    const secretKey = await askQuestion('Enter your Stripe Secret Key: ');

    // Update backend-integration.js
    let backendIntegration = fs.readFileSync('backend-integration.js', 'utf8');
    backendIntegration = backendIntegration.replace(
        "const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');",
        `const stripePromise = loadStripe('${publishableKey}');`
    );
    fs.writeFileSync('backend-integration.js', backendIntegration);

    // Update API route
    let apiRoute = fs.readFileSync('api/create-payment-intent.js', 'utf8');
    apiRoute = apiRoute.replace(
        "const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);",
        `const stripe = require('stripe')('${secretKey}');`
    );
    fs.writeFileSync('api/create-payment-intent.js', apiRoute);

    console.log('✅ Stripe config saved!\n');
}

async function createEnvFile() {
    console.log('📝 Creating environment file...');
    
    const envContent = `# Environment Variables for Vercel Deployment
# Copy these to your Vercel dashboard

STRIPE_SECRET_KEY=your_stripe_secret_key_here
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
FIREBASE_APP_ID=your_firebase_app_id_here
GOOGLE_PLACES_API_KEY=AIzaSyDxmTaxKpj-4obKzHVaMxEBkEQgqi7rkpk`;

    fs.writeFileSync('.env.example', envContent);
    console.log('✅ Environment file created (.env.example)\n');
}

async function main() {
    try {
        console.log('This script will help you configure Firebase and Stripe for your website.\n');
        
        const setupFirebaseChoice = await askQuestion('Do you want to set up Firebase now? (y/n): ');
        if (setupFirebaseChoice.toLowerCase() === 'y') {
            await setupFirebase();
        }

        const setupStripeChoice = await askQuestion('Do you want to set up Stripe now? (y/n): ');
        if (setupStripeChoice.toLowerCase() === 'y') {
            await setupStripe();
        }

        await createEnvFile();

        console.log('🎉 Setup Complete!');
        console.log('\nNext steps:');
        console.log('1. Test your website: npm run dev');
        console.log('2. Deploy to Vercel: vercel');
        console.log('3. Add environment variables in Vercel dashboard');
        console.log('4. Configure your custom domain');
        console.log('\nFor detailed instructions, see DEPLOYMENT_GUIDE.md');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

main();
