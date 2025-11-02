# Bigg Slim Events - Deployment Guide

## Quick Setup (Today!)

### 1. Firebase Setup (5 minutes)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: "bigg-slim-events"
3. Enable Firestore Database
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the config
6. Update `firebase-config.js` with your actual credentials

### 2. Stripe Setup (5 minutes)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your Publishable Key and Secret Key
3. Update `backend-integration.js` with your publishable key
4. Update `api/create-payment-intent.js` with your secret key

### 3. Vercel Deployment (10 minutes)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Set environment variables in Vercel dashboard:
   - `STRIPE_SECRET_KEY`
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

### 4. Domain Setup (5 minutes)
1. Buy domain from your preferred registrar
2. In Vercel dashboard, go to Domains
3. Add your domain and follow DNS instructions
4. SSL certificate will be automatically provisioned

## Environment Variables

### Firebase Config
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### Stripe Keys
- Publishable Key: `pk_test_...` (for frontend)
- Secret Key: `sk_test_...` (for backend API)

## Features Included

✅ **Contact Forms** - All forms save to Firebase
✅ **Booking System** - Calendar with availability checking
✅ **Payment Processing** - Stripe integration for deposits
✅ **Mobile Responsive** - Works on all devices
✅ **SEO Optimized** - Meta tags and structured data
✅ **Fast Loading** - Optimized images and code
✅ **Analytics Ready** - Google Analytics integration ready

## Testing Checklist

- [ ] Contact forms submit successfully
- [ ] Booking calendar works
- [ ] Payment processing works (test mode)
- [ ] Mobile responsiveness
- [ ] All pages load correctly
- [ ] Images load properly
- [ ] Navigation works

## Support

If you need help with any step, the code is well-documented and follows best practices. All forms have error handling and user feedback.

## Next Steps After Deployment

1. Test all functionality
2. Set up Google Analytics
3. Configure email notifications
4. Set up backup procedures
5. Monitor performance and user feedback
