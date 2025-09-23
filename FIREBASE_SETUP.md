# Firebase Authentication Setup

This guide will help you set up Firebase Authentication for the Procurement Intelligence Dashboard.

## Prerequisites

- A Google account
- Access to the Firebase Console

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "procurement-dashboard")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:

### Google Authentication
- Click on "Google"
- Toggle "Enable"
- Add your project's public-facing name
- Add your project support email
- Click "Save"

### Email/Password Authentication
- Click on "Email/Password"
- Toggle "Enable"
- Optionally enable "Email link (passwordless sign-in)" if desired
- Click "Save"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Procurement Dashboard")
6. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration.

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. In the "Authorized domains" section, add your domain:
   - For development: `localhost`
   - For production: your actual domain

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your application
3. You should see the login screen
4. Click "Sign in with Google"
5. Complete the authentication flow
6. You should be redirected to the dashboard

## Features Included

- ✅ Google OAuth authentication
- ✅ Email/Password authentication
- ✅ User registration with email verification
- ✅ Password reset functionality
- ✅ Protected routes (all pages require authentication)
- ✅ User profile display in header
- ✅ Logout functionality
- ✅ Loading states during authentication
- ✅ Error handling with toast notifications
- ✅ Responsive design
- ✅ Password visibility toggle
- ✅ Form validation

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Make sure your domain is added to the authorized domains list in Firebase Console

2. **"Firebase: Error (auth/api-key-not-valid)"**
   - Verify your API key is correct in the `.env` file

3. **Login button not working**
   - Check browser console for errors
   - Ensure all environment variables are set correctly

### Development Tips

- The app will show a login screen for unauthenticated users
- All routes are protected by default
- User information is displayed in the header when logged in
- Logout functionality is available in the header

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your Firebase API keys in production
- Configure proper security rules in Firebase Console

## Next Steps

- Customize the login page design
- Add additional authentication providers (email/password, etc.)
- Implement role-based access control
- Add user profile management features
