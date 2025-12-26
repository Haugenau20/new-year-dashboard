# New Year's Party Dashboard

A real-time music visualization dashboard for parties, designed to run on a TV. Connects directly to Spotify to display currently playing music with dynamic animated backgrounds and countdown timers.

## Features

- **Large Album Art Display**: Prominent currently playing track with album art visible from across the room
- **Real-Time Spotify Integration**: Direct Spotify API integration with OAuth authentication
- **Dynamic Backgrounds**: Animated backgrounds that change based on what's playing
- **Special Song Detection**: Automatically detects special songs and displays them in the queue
- **Countdown Timers**: Midnight countdown and Kongens Tale (King's Speech) countdown for New Year's Eve
- **Adaptive Rate Limiting**: Smart polling with automatic backoff to stay within Spotify API limits
- **TV-Optimized UI**: Designed for 1920x1080 fullscreen display with dark party theme

## Tech Stack

- React 18 + TypeScript
- Vite for fast development and building
- Spotify Web API with OAuth 2.0 authentication
- Firebase Cloud Functions for secure token exchange
- Modern CSS with gradient effects and animations

## Prerequisites

- Node.js 18+ and npm
- Spotify account (any account, not limited to specific users)
- Spotify Developer App credentials
- Firebase project (for Cloud Functions token exchange)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd new-year-dashboard
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your credentials:

#### Frontend Configuration (`.env`):
1. **VITE_SPOTIFY_CLIENT_ID**: Your Spotify application Client ID
2. **VITE_SPOTIFY_REDIRECT_URI**: OAuth callback URL (default: `http://127.0.0.1:5173/callback`)
3. **VITE_FIREBASE_FUNCTIONS_URL**: Your Firebase Functions URL (e.g., `https://us-central1-your-project.cloudfunctions.net`)

#### Backend Configuration (`functions/.env.local`):
1. **SPOTIFY_CLIENT_ID**: Your Spotify application Client ID (same as frontend)
2. **SPOTIFY_CLIENT_SECRET**: Your Spotify application Client Secret

To get Spotify credentials:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (choose "Web API")
3. In app settings, add your redirect URI to "Redirect URIs"
   - For local development: `http://127.0.0.1:5173/callback`
   - For production: `https://your-firebase-project.web.app/callback` or your custom domain
   - Note: Spotify requires `127.0.0.1`, not `localhost` for local development
4. Copy the Client ID and Client Secret

**Important**: Never commit your `.env` or `functions/.env.local` files to git! They contain secrets.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### Firebase Hosting Deployment

The site is configured to automatically deploy to Firebase Hosting when you push to the `main` branch.

#### Initial Setup:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project (if not already done): `firebase init`
4. Configure your Firebase Functions environment variables in `functions/.env.local`

#### Automatic Deployment (GitHub Actions):

The project includes GitHub Actions workflows that automatically:
- Build the project
- Deploy to Firebase Hosting
- Deploy Cloud Functions for OAuth token exchange
- Trigger on pushes to `main` or pull requests

#### Manual Deployment:

```bash
npm run build
firebase deploy
```

**Note:** Environment variables (`.env` and `functions/.env.local`) are not committed to git. Firebase Functions uses environment configuration for secrets.

### Deployment on Raspberry Pi

#### Option 1: Direct Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy the `dist` folder to your Raspberry Pi

3. Serve using a simple HTTP server:
   ```bash
   npx serve -s dist -p 3000
   ```

4. Open Chromium in kiosk mode:
   ```bash
   chromium-browser --kiosk --app=http://localhost:3000
   ```

### Option 2: Auto-start on Boot

Create a systemd service or add to `/etc/xdg/lxsession/LXDE-pi/autostart`:

```bash
@chromium-browser --kiosk --app=http://localhost:3000 --start-fullscreen --start-maximized
```

## Project Structure

```
new-year-dashboard/
├── src/
│   ├── components/          # React components (NowPlaying, QueueDisplay, etc.)
│   ├── hooks/
│   │   ├── useSpotify.ts         # Spotify playback polling hook
│   │   └── useBackgroundRotation.ts  # Background animation management
│   ├── services/
│   │   └── spotify.ts            # Spotify API service
│   ├── types/
│   │   └── spotify.ts            # TypeScript type definitions
│   ├── config/
│   │   ├── backgrounds.ts        # Background configurations
│   │   └── specialSongs.ts       # Special song detection
│   ├── pages/
│   │   ├── SpotifyCallback.tsx   # OAuth callback handler
│   │   └── BackgroundRecorder.tsx # Dev tool for recording backgrounds
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── functions/
│   └── src/
│       └── spotify-auth.ts  # Firebase Cloud Functions for token exchange
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### TypeScript Types

The project includes comprehensive TypeScript types for Spotify entities:

- `SpotifyPlaybackState` - Current playback state and track information
- `SpotifyQueue` - Queue information
- `SpotifyTrack` - Track metadata (name, artists, album, URI)
- `SpotifyTokens` - OAuth token storage

### Rate Limiting

The app implements intelligent rate limiting to stay within Spotify API quotas:

- **Normal polling**: 3 seconds (40 requests/minute)
- **After 1st rate limit**: 5 seconds (24 requests/minute)
- **After 2nd+ rate limits**: 10 seconds (12 requests/minute)
- **Automatic reset**: Rate limit counter resets after 24 hours

The app automatically handles 429 responses by pausing requests during the `Retry-After` period.

## Troubleshooting

### Authentication Issues

- **"Missing Spotify API configuration"**: Check that your `.env` file exists and contains `VITE_SPOTIFY_CLIENT_ID`
- **OAuth redirect fails**: Verify the redirect URI in your Spotify Developer Dashboard matches your `.env` configuration
- **Token refresh fails**: Check that Firebase Functions are deployed and `VITE_FIREBASE_FUNCTIONS_URL` is correct

### No Music Showing

- Make sure you're actively playing music on Spotify
- The app requires an active Spotify session (Premium or Free)
- Check browser console for API errors

### Rate Limiting

- If you see "Rate limited" warnings, the app will automatically back off
- Multiple instances using the same Spotify Developer App share rate limits
- Consider using separate Spotify Developer Apps for each instance if running multiple dashboards

## Future Enhancements

- [ ] Party statistics (tracks played, guests' NFC card taps)
- [ ] Track history/recent plays
- [ ] Queue display
- [ ] Custom themes
- [ ] Multi-language support
- [ ] Guest song requests via QR code

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! This is also a portfolio piece, so suggestions for improvements are appreciated.

---

Built with React, TypeScript, and Spotify Web API for an awesome New Year's party experience!