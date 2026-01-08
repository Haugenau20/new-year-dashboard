# New Year Dashboard

> Real-time music visualization for New Year 2025 celebration

Event dashboard built for New Year 2025 party, displaying real-time Spotify playback with dynamic backgrounds and special song detection. Integrates with NFC Party Controller hardware for a complete smart home party experience.

**Deployed**: New Year 2025 (12 guests)
**Tech Stack**: React 18, TypeScript, Vite, Spotify Web API, Home Assistant API, Firebase Functions

## Related Project: Hardware Integration

This dashboard was built to complement a physical NFC-based music controller:

**[NFC Party Controller](https://github.com/Haugenau20/nfc-party-controller)** - Battery-powered ESP32 hardware:
- Tap NFC cards to trigger playlists
- Physical volume control and pause button
- Two devices (living room + kitchen)
- Built with ESPHome and Home Assistant

The dashboard provides visual feedback when guests scan NFC cards, creating a complete party experience. Together, they demonstrate a full-stack IoT system from embedded hardware to modern web frontend.

## Technical Highlights

**Frontend Architecture**:
- React 18 with TypeScript for type safety
- Vite for fast development and optimized production builds
- Real-time polling with adaptive rate limiting (handles Spotify API quotas)
- Responsive design optimized for 1920×1080 TV display

**API Integration**:
- OAuth 2.0 flow with Firebase Cloud Functions for secure token exchange
- Spotify Web API for playback state and queue information
- Home Assistant REST API for special song detection (NFC tag integration)
- Intelligent rate limiting with exponential backoff (3s → 5s → 10s intervals)

**Performance Optimization**:
- WebGL animation pre-rendering: Record complex animations on powerful machine → convert to MP4
- TV-optimized video playback instead of real-time WebGL rendering
- Seamless video looping with CSS crossfade transitions
- Dynamic hue shifting for color variety without re-encoding videos

**Event-Driven Features**:
- Midnight countdown timer (New Year specific)
- Kongens Tale countdown (Danish King's Speech tradition)
- Special song queue detection (highlights songs triggered by NFC cards)
- Dynamic background rotation synchronized with music changes

## What It Does

Built for New Year 2025 celebration with 12 guests, displaying:
- **Now Playing**: Large album artwork with artist and track info visible across room
- **Special Songs**: Highlights tracks queued via NFC cards (60 songs, 12 guests)
- **Dynamic Backgrounds**: Rotating video backgrounds with hue shifting
- **Countdown Timers**: Midnight and Kongens Tale (King's Speech) countdowns
- **Real-time Sync**: Updates every 3-10 seconds based on API rate limits

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
│   ├── components/          # React components (NowPlaying, QueueDisplay, AnimatedBackground)
│   ├── hooks/
│   │   ├── useSpotify.ts         # Spotify playback polling hook
│   │   ├── useNFCQueue.ts        # NFC queue integration with Home Assistant
│   │   └── useBackgroundRotation.ts  # Background animation management
│   ├── services/
│   │   ├── spotify.ts            # Spotify API service
│   │   └── homeAssistant.ts      # Home Assistant API integration
│   ├── types/
│   │   └── spotify.ts            # TypeScript type definitions
│   ├── config/
│   │   ├── backgrounds.ts        # Background video configurations
│   │   └── specialSongs.ts       # 60 special songs (NFC tag mappings)
│   ├── pages/
│   │   └── SpotifyCallback.tsx   # OAuth callback handler
│   ├── dev/                 # Dev tools (not tracked in git)
│   │   ├── components/      # WebGL animation components for recording
│   │   ├── pages/           # BackgroundRecorder, BorderRecorder
│   │   └── config/          # Recording configurations
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── functions/
│   └── src/
│       └── spotify-auth.ts  # Firebase Cloud Functions for token exchange
├── public/
│   └── assets/
│       └── videos/          # Pre-rendered background videos (MP4)
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