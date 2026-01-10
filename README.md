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

## Implementation

**Architecture:**
- React 18 + TypeScript frontend with Vite build tooling
- Firebase Hosting (SPA) + Cloud Functions (OAuth token exchange)
- OAuth 2.0 flow for Spotify API authentication
- Adaptive API polling: 3s → 5s → 10s intervals with automatic backoff for rate limit responses

**Key Features:**
- Large album artwork display optimized for 1920×1080 TV viewing
- Special song queue highlighting (60 songs mapped to NFC tags from hardware controller)
- Event-specific countdowns: Midnight and Kongens Tale (Danish King's Speech)
- Automated background rotation every 5 minutes with dynamic hue shifting
- WebGL animations pre-rendered to MP4 videos, served from CDN for TV playback

**Deployment (New Year 2025):**
- Display: Chromecast with Google TV running Chromium in kiosk mode
- Integration: Two NFC Party Controller devices (living room + kitchen) via Home Assistant API
- Video delivery: Pre-rendered backgrounds uploaded to Firebase Storage

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

## License

MIT License - See LICENSE file for details

---

*Portfolio project demonstrating full-stack IoT integration for a real-world event deployment.*