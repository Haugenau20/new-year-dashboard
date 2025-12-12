# Firebase Migration Guide
### Migrating New Year Dashboard from GitHub Pages to Firebase

This guide walks you through migrating your New Year Dashboard from GitHub Pages to Firebase Hosting with Cloud Functions for secure OAuth handling.

---

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Node.js 18+ installed
- Existing Firebase account
- Spotify Client ID and Client Secret

---

## Part 1: Firebase Project Setup

### Step 1.1: Initialize Firebase in Your Project

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase in the project
firebase init
```

When prompted, select:
- ✅ **Hosting**: Configure files for Firebase Hosting
- ✅ **Functions**: Configure a Cloud Functions directory

### Step 1.2: Configuration Prompts

**For Hosting:**
- Use an existing project or create a new one
- Public directory: `dist` (Vite's build output)
- Configure as single-page app: **Yes**
- Set up automatic builds with GitHub: **No** (we'll do manual deploys for now)
- Don't overwrite `dist/index.html` if it exists: **No**

**For Functions:**
- Language: **TypeScript** (recommended) or JavaScript
- Use ESLint: **Yes** (optional but recommended)
- Install dependencies now: **Yes**

### Step 1.3: Update `firebase.json`

After initialization, verify/update your `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  }
}
```

---

## Part 2: Create Cloud Function for Spotify OAuth

### Step 2.1: Navigate to Functions Directory

```bash
cd functions
```

### Step 2.2: Install Required Dependencies

```bash
npm install axios cors
npm install --save-dev @types/cors
```

### Step 2.3: Create the OAuth Exchange Function

Create `functions/src/spotify-auth.ts` (or `.js` if using JavaScript):

**TypeScript version:**

```typescript
import * as functions from 'firebase-functions';
import * as cors from 'cors';
import axios from 'axios';

const corsHandler = cors({ origin: true });

interface TokenRequest {
  code: string;
  redirectUri: string;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export const exchangeSpotifyToken = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const { code, redirectUri } = req.body as TokenRequest;

    if (!code || !redirectUri) {
      res.status(400).json({ error: 'Missing code or redirectUri' });
      return;
    }

    // Get secrets from Firebase environment config
    const clientId = functions.config().spotify.client_id;
    const clientSecret = functions.config().spotify.client_secret;

    if (!clientId || !clientSecret) {
      console.error('Spotify credentials not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    try {
      // Exchange code for token
      const tokenResponse = await axios.post<SpotifyTokenResponse>(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Return tokens to client
      res.json({
        access_token: tokenResponse.data.access_token,
        token_type: tokenResponse.data.token_type,
        expires_in: tokenResponse.data.expires_in,
        refresh_token: tokenResponse.data.refresh_token,
        scope: tokenResponse.data.scope,
      });
    } catch (error: any) {
      console.error('Token exchange error:', error.response?.data || error.message);
      res.status(500).json({
        error: 'Failed to exchange token',
        details: error.response?.data?.error_description || 'Unknown error',
      });
    }
  });
});
```

**JavaScript version:**

```javascript
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const axios = require('axios');

exports.exchangeSpotifyToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
      res.status(400).json({ error: 'Missing code or redirectUri' });
      return;
    }

    const clientId = functions.config().spotify.client_id;
    const clientSecret = functions.config().spotify.client_secret;

    if (!clientId || !clientSecret) {
      console.error('Spotify credentials not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    try {
      const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      res.json({
        access_token: tokenResponse.data.access_token,
        token_type: tokenResponse.data.token_type,
        expires_in: tokenResponse.data.expires_in,
        refresh_token: tokenResponse.data.refresh_token,
        scope: tokenResponse.data.scope,
      });
    } catch (error) {
      console.error('Token exchange error:', error.response?.data || error.message);
      res.status(500).json({
        error: 'Failed to exchange token',
        details: error.response?.data?.error_description || 'Unknown error',
      });
    }
  });
});
```

### Step 2.4: Export the Function

In `functions/src/index.ts` (or `index.js`):

```typescript
export { exchangeSpotifyToken } from './spotify-auth';
```

---

## Part 3: Set Firebase Environment Secrets

### Step 3.1: Set Spotify Credentials

From your project root directory:

```bash
firebase functions:config:set \
  spotify.client_id="YOUR_SPOTIFY_CLIENT_ID" \
  spotify.client_secret="YOUR_SPOTIFY_CLIENT_SECRET"
```

Replace `YOUR_SPOTIFY_CLIENT_ID` and `YOUR_SPOTIFY_CLIENT_SECRET` with your actual values.

### Step 3.2: Verify Configuration

```bash
firebase functions:config:get
```

You should see:

```json
{
  "spotify": {
    "client_id": "your-client-id",
    "client_secret": "your-client-secret"
  }
}
```

### Step 3.3: Create Local Config for Testing (Optional)

For local development:

```bash
cd functions
firebase functions:config:get > .runtimeconfig.json
```

**⚠️ Important:** Add `.runtimeconfig.json` to `.gitignore`!

---

## Part 4: Update Frontend Code

### Step 4.1: Update Environment Variables

Update `.env` file (keep for local development only):

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
# Remove VITE_SPOTIFY_CLIENT_SECRET - no longer needed in frontend!
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3001/callback
VITE_FIREBASE_FUNCTIONS_URL=http://127.0.0.1:5001/YOUR_PROJECT_ID/us-central1
```

For production, you'll update this to your deployed function URL.

### Step 4.2: Locate SpotifyService

Find where you currently exchange the auth code for tokens. This is likely in:
- `src/services/spotify.ts` or `src/services/spotify.js`
- Look for the `handleCallback` method or similar

### Step 4.3: Update the Token Exchange Logic

**Current code (insecure - uses client secret in frontend):**

```typescript
// ❌ OLD - Don't use this
async handleCallback(code: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret, // ❌ Secret exposed!
    }),
  });
  // ...
}
```

**New code (secure - calls Cloud Function):**

```typescript
// ✅ NEW - Use this
async handleCallback(code: string) {
  // Determine the Cloud Function URL
  const functionsUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL
    || 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net';

  const response = await fetch(`${functionsUrl}/exchangeSpotifyToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: code,
      redirectUri: this.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to authenticate with Spotify');
  }

  const data = await response.json();

  // Store tokens as before
  localStorage.setItem('spotify_access_token', data.access_token);
  if (data.refresh_token) {
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
  }
  localStorage.setItem('spotify_token_expiry', String(Date.now() + data.expires_in * 1000));
}
```

### Step 4.4: Remove Client Secret from Frontend

In your SpotifyService constructor or initialization:

```typescript
// ❌ Remove this line
// clientSecret: string;

// ✅ Keep only these
constructor(config: {
  clientId: string;
  // clientSecret: string; ← Remove this
  redirectUri: string;
}) {
  this.clientId = config.clientId;
  // this.clientSecret = config.clientSecret; ← Remove this
  this.redirectUri = config.redirectUri;
}
```

### Step 4.5: Update App.tsx

Remove the client secret environment variable:

```typescript
// ❌ Remove this line
// const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';

// Update SpotifyService initialization
const service = new SpotifyService({
  clientId: SPOTIFY_CLIENT_ID,
  // clientSecret: SPOTIFY_CLIENT_SECRET, ← Remove this
  redirectUri: SPOTIFY_REDIRECT_URI,
});
```

---

## Part 5: Update Spotify App Settings

### Step 5.1: Update Redirect URIs in Spotify Dashboard

1. Go to https://developer.spotify.com/dashboard
2. Select your app
3. Click "Edit Settings"
4. Add redirect URIs:
   - `http://localhost:3001/callback` (local development)
   - `http://127.0.0.1:3001/callback` (local development)
   - `https://YOUR_PROJECT_ID.web.app/callback` (Firebase production)
   - `https://YOUR_CUSTOM_DOMAIN.com/callback` (if you have a custom domain)

---

## Part 6: Test Locally

### Step 6.1: Start Firebase Emulators

From project root:

```bash
# Build the frontend first
npm run build

# Start Firebase emulators
firebase emulators:start
```

This will start:
- Hosting emulator (usually on http://localhost:5000)
- Functions emulator (usually on http://localhost:5001)

### Step 6.2: Test the Auth Flow

1. Open http://localhost:5000 in your browser
2. Click "Connect to Spotify"
3. Authorize the app
4. Verify you're redirected back and tokens are received
5. Check the Functions emulator logs for any errors

### Step 6.3: Debug Tips

**Check Function Logs:**
```bash
firebase functions:log
```

**Common Issues:**
- **CORS errors**: Make sure the `cors` package is properly configured
- **404 on function**: Check the function URL matches your code
- **500 errors**: Check Firebase Functions logs for detailed error messages
- **Cold start delay**: First function call may take 1-2 seconds

---

## Part 7: Deploy to Firebase

### Step 7.1: Build Your Frontend

```bash
npm run build
```

This creates the `dist/` directory with your production build.

### Step 7.2: Deploy Everything

```bash
# Deploy both hosting and functions
firebase deploy

# Or deploy separately:
firebase deploy --only functions
firebase deploy --only hosting
```

### Step 7.3: Get Your Production URLs

After deployment, Firebase will show:
- **Hosting URL**: `https://YOUR_PROJECT_ID.web.app`
- **Functions URL**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net`

### Step 7.4: Update Production Environment Variables

Create `.env.production`:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=https://YOUR_PROJECT_ID.web.app/callback
VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net
```

Then rebuild and redeploy:

```bash
npm run build
firebase deploy --only hosting
```

---

## Part 8: Verify Security

### Step 8.1: Check Deployed JavaScript

1. Open your deployed site: `https://YOUR_PROJECT_ID.web.app`
2. Open browser DevTools → Sources/Debugger
3. Search through JavaScript files for your client secret
4. ✅ You should NOT find it anywhere

### Step 8.2: Verify Function Works

1. Open browser DevTools → Network tab
2. Connect to Spotify
3. Look for the `exchangeSpotifyToken` request
4. Verify it's calling the Cloud Function (not Spotify directly)
5. Check that the response contains access tokens

---

## Part 9: Clean Up GitHub Pages (Optional)

If you're fully migrating away from GitHub Pages:

### Step 9.1: Remove GitHub Pages Configuration

Remove from `vite.config.ts`:

```typescript
// Remove this line:
// base: '/new-year-dashboard/',
```

### Step 9.2: Remove GitHub Pages Files

```bash
# Remove if you have these
rm -f public/404.html
```

### Step 9.3: Update Repository Settings

1. Go to your GitHub repo → Settings → Pages
2. Set Source to "None"
3. Your GitHub Pages site will be deactivated

---

## Part 10: Maintenance & Troubleshooting

### Viewing Logs

```bash
# Stream function logs in real-time
firebase functions:log --only exchangeSpotifyToken

# View hosting logs (requires Blaze plan)
firebase hosting:logs
```

### Updating Environment Variables

```bash
# Update a secret
firebase functions:config:set spotify.client_id="new_value"

# Redeploy functions for changes to take effect
firebase deploy --only functions
```

### Rollback a Deployment

```bash
# List hosting releases
firebase hosting:releases:list

# Rollback to previous release
firebase hosting:rollback
```

### Cost Monitoring

- Firebase Console → Project → Usage
- Monitor Functions invocations
- Monitor Hosting bandwidth
- Set up budget alerts (recommended)

---

## Common Issues & Solutions

### Issue: Cold Start Delays

**Problem:** First function call after inactivity takes 1-2 seconds

**Solutions:**
- Accept it (it's normal for free tier)
- Upgrade to Blaze plan and set minimum instances
- Implement retry logic in frontend

### Issue: CORS Errors

**Problem:** Browser blocks function calls

**Solution:**
```typescript
// Ensure cors is properly configured in function
const corsHandler = cors({ origin: true });
```

### Issue: Function Not Found

**Problem:** 404 when calling function

**Solutions:**
- Check function name matches in code and URL
- Verify function deployed: `firebase functions:list`
- Check region (default is us-central1)

### Issue: Secrets Not Working

**Problem:** Function can't read credentials

**Solutions:**
- Verify config: `firebase functions:config:get`
- Redeploy after setting config
- Check for typos in config keys

---

## Next Steps

After successful migration:

1. **Set up CI/CD** (optional): Automate deployments with GitHub Actions
2. **Add custom domain** (optional): Configure custom domain in Firebase Console
3. **Enable Firebase Analytics** (optional): Track usage
4. **Set up monitoring** (optional): Set up error alerts

---

## Useful Commands Reference

```bash
# Local development
npm run dev                              # Start Vite dev server
firebase emulators:start                 # Start Firebase emulators

# Functions
firebase functions:log                   # View function logs
firebase functions:config:get            # View environment config
firebase functions:config:set key=value  # Set environment variable

# Deployment
npm run build                            # Build frontend
firebase deploy                          # Deploy everything
firebase deploy --only functions         # Deploy only functions
firebase deploy --only hosting           # Deploy only hosting

# Debugging
firebase functions:shell                 # Interactive function testing
firebase hosting:channel:deploy preview  # Deploy to preview channel
```

---

## Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Cloud Functions Guide**: https://firebase.google.com/docs/functions
- **Firebase Hosting**: https://firebase.google.com/docs/hosting
- **Spotify Web API**: https://developer.spotify.com/documentation/web-api

---

## Security Checklist

- ✅ Client secret removed from frontend code
- ✅ Client secret stored in Firebase environment config
- ✅ CORS properly configured in Cloud Function
- ✅ Redirect URIs whitelisted in Spotify Dashboard
- ✅ Environment variables not committed to Git
- ✅ .runtimeconfig.json added to .gitignore
- ✅ Production URLs updated in environment variables
- ✅ Verified secret not visible in deployed JavaScript

---

**Good luck with your migration!** 🎉

Remember to test thoroughly in the emulator before deploying to production!
