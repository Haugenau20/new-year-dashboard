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
- Automatic background rotation (5-minute intervals with hue shifting)

## What It Does

Built for New Year 2025 celebration with 12 guests, displaying:
- **Now Playing**: Large album artwork with artist and track info visible across room
- **Special Songs**: Highlights tracks queued via NFC cards (60 songs, 12 guests)
- **Dynamic Backgrounds**: Rotating video backgrounds with hue shifting
- **Countdown Timers**: Midnight and Kongens Tale (King's Speech) countdowns
- **Real-time Sync**: Updates every 3-10 seconds based on API rate limits

## Deployment

The dashboard was deployed for New Year 2025 using the following setup:

**Infrastructure**:
- **Frontend**: Firebase Hosting (React SPA)
- **Backend**: Firebase Cloud Functions (OAuth token exchange)
- **Display**: Chromecast with Google TV running Chromium in kiosk mode
- **Resolution**: 1920×1080 fullscreen on living room TV

**Integration**:
- Spotify Web API for real-time playback data
- Home Assistant REST API for NFC tag detection
- Two NFC Party Controller devices (living room + kitchen)
- 60 pre-configured special songs mapped to NFC tags

**Performance**:
- Background videos pre-rendered and uploaded to Firebase Storage
- Videos played from CDN instead of real-time WebGL rendering
- Adaptive polling (3-10s) to stay within Spotify API rate limits
- Automatic OAuth token refresh via Cloud Functions

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
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── functions/
│   └── src/
│       └── spotify-auth.ts  # Firebase Cloud Functions for token exchange
├── public/
│   └── assets/
│       └── videos/
│           └── README.md    # Video recording instructions (MP4s deployed separately)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Note**: Dev tools (`src/dev/`) and video files (`*.mp4`) are not tracked in git. Videos were pre-rendered and deployed to Firebase Storage for production.

## Running Locally

To run the dashboard locally (requires Spotify Developer credentials):

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (create `.env` from `.env.example`):
   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
   VITE_FIREBASE_FUNCTIONS_URL=your_firebase_functions_url
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

4. **Visit** `http://localhost:5173` and authenticate with Spotify

**Note**: Special song detection requires Home Assistant integration with NFC Party Controller hardware. Without it, the dashboard will still display now playing information and backgrounds.

## Development Notes

**Rate Limiting**: Implements adaptive polling (3s → 5s → 10s) with automatic backoff to handle Spotify API rate limits (429 responses).

**TypeScript Types**: Full type coverage for Spotify API entities (playback state, tracks, queue, tokens).

**Build**: Vite for fast development and optimized production builds with automatic code splitting.

## License

MIT License - See LICENSE file for details

---

*Portfolio project demonstrating full-stack IoT integration for a real-world event deployment.*