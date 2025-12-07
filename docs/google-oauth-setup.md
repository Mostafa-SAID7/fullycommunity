# Google OAuth Setup Guide

## Issue: "Can't continue with google.com - Something went wrong"

This error occurs when the Google OAuth app isn't properly configured in Google Cloud Console.

## Solution: Configure Google OAuth Consent Screen

### Step 1: Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Select your project or create a new one

### Step 2: Configure OAuth Consent Screen
1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (or Internal if using Google Workspace)
3. Click **Create**

### Step 3: Fill in App Information
- **App name**: CommunityCar
- **User support email**: Your email
- **App logo**: (Optional) Upload your logo
- **App domain**: 
  - Application home page: `http://localhost:4200`
  - Privacy policy: `http://localhost:4200/privacy`
  - Terms of service: `http://localhost:4200/terms`
- **Authorized domains**: 
  - Add `localhost` (for development)
  - Add your production domain when deploying
- **Developer contact information**: Your email

### Step 4: Add Scopes
1. Click **Add or Remove Scopes**
2. Select these scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
3. Click **Update**

### Step 5: Add Test Users (for External apps in Testing mode)
1. Click **Add Users**
2. Add email addresses of users who can test the app
3. Click **Save**

### Step 6: Configure OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Configure:
   - **Name**: CommunityCar Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:4200`
     - `http://localhost:5000`
     - Add your production URL when deploying
   - **Authorized redirect URIs**:
     - `http://localhost:4200`
     - `http://localhost:4200/auth/callback`
     - Add production URLs when deploying
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### Step 7: Update Configuration
Update your `appsettings.json` with the credentials:
```json
"SocialAuth": {
  "Google": {
    "ClientId": "YOUR_CLIENT_ID_HERE",
    "ClientSecret": "YOUR_CLIENT_SECRET_HERE"
  }
}
```

Update `index.html` with the Client ID:
```html
<meta name="google-signin-client_id" content="YOUR_CLIENT_ID_HERE">
```

Update `login.component.ts` with the Client ID:
```typescript
const clientId = 'YOUR_CLIENT_ID_HERE';
```

### Step 8: Publish Your App (Optional - for production)
1. Go back to **OAuth consent screen**
2. Click **Publish App**
3. Submit for verification if needed

## Testing
1. Clear browser cache and cookies
2. Try logging in with Google
3. Check browser console for detailed error messages
4. Verify the test user email is added in Google Cloud Console

## Common Issues

### "Access blocked: This app's request is invalid"
- Check that authorized JavaScript origins include your current URL
- Verify the Client ID matches in all places

### "Error 400: redirect_uri_mismatch"
- Add the exact redirect URI to authorized redirect URIs in Google Cloud Console

### "This app isn't verified"
- This is normal for apps in testing mode
- Click "Advanced" > "Go to CommunityCar (unsafe)" to proceed
- Or publish the app for production use

## Current Configuration
- Client ID: `17907224065-uh092qone9dbr179d7sj184ptn0vf9d8.apps.googleusercontent.com`
- Make sure this matches in:
  - Google Cloud Console OAuth credentials
  - `index.html` meta tag
  - `login.component.ts` clientId variable
  - `appsettings.json` SocialAuth.Google.ClientId
