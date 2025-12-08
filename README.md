# New Year's Party Dashboard

A real-time music and smart home status display for parties, designed to run on a TV via Raspberry Pi. Connects to Home Assistant to display currently playing music from Spotify, active speakers, playlists, and more.

## Features

- **Large Album Art Display**: Prominent currently playing track with album art visible from across the room
- **Real-Time Updates**: Live WebSocket connection to Home Assistant for instant updates
- **Multi-Speaker Support**: Shows status of multiple Bang & Olufsen speakers
- **Playlist Information**: Current playlist/genre display
- **Volume Control Display**: Visual volume indicator
- **Automatic Reconnection**: Handles connection drops gracefully
- **TV-Optimized UI**: Designed for 1920x1080 fullscreen display with dark party theme

## Tech Stack

- React 18 + TypeScript
- Vite for fast development and building
- home-assistant-js-websocket for real-time Home Assistant integration
- Modern CSS with gradient effects and animations

## Prerequisites

- Node.js 18+ and npm
- Home Assistant instance (local network)
- Spotify integration configured in Home Assistant
- Long-lived access token from Home Assistant

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

#### Home Assistant Configuration:
1. **VITE_HA_URL**: Your Home Assistant URL (e.g., `http://homeassistant.local:8123` or `http://192.168.1.100:8123`)
2. **VITE_HA_TOKEN**: Long-lived access token
   - Go to your Home Assistant profile: `http://YOUR_HA_IP:8123/profile`
   - Scroll down to "Long-Lived Access Tokens"
   - Click "Create Token"
   - Copy the token and paste it into your `.env` file

#### Spotify API Configuration:
1. **VITE_SPOTIFY_CLIENT_ID**: Your Spotify application Client ID
2. **VITE_SPOTIFY_CLIENT_SECRET**: Your Spotify application Client Secret
3. **VITE_SPOTIFY_REDIRECT_URI**: OAuth callback URL (default: `http://127.0.0.1:3001/callback`)

To get Spotify credentials:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (choose "Web API")
3. In app settings, add `http://127.0.0.1:3001/callback` to "Redirect URIs"
   - Note: Spotify requires `127.0.0.1`, not `localhost`
   - Use port 3001 (or whatever port your dev server is running on)
4. Copy the Client ID and Client Secret to your `.env` file

**Important**: Never commit your `.env` file to git! It contains secrets.

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

## Required Home Assistant Entities

The dashboard expects these entities to be available:

- `media_player.spotify_soren_kjaedegaard_haug` - Main Spotify player
- `media_player.beoplay_m5_kontor` - Bang & Olufsen M5 (Office)
- `media_player.beoconnect_core_stue` - Bang & Olufsen Core (Living Room)
- `input_select.playlist_selector` - Playlist selector

### Customizing Entity IDs

If your entity IDs are different, edit `src/hooks/useHomeAssistant.ts`:

```typescript
const ENTITY_IDS = {
  MAIN_PLAYER: 'media_player.your_spotify_player',
  KONTOR_SPEAKER: 'media_player.your_speaker_1',
  STUE_SPEAKER: 'media_player.your_speaker_2',
  PLAYLIST_SELECTOR: 'input_select.your_playlist_selector',
};
```

## Deployment

### GitHub Pages Deployment

The site is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

#### Initial Setup:

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push your changes to the `main` branch

The GitHub Actions workflow will automatically:
- Build the project
- Deploy to GitHub Pages
- Make the site available at `https://haugenau20.github.io/new-year-dashboard/`

#### Manual Deployment:

If you prefer to deploy manually without GitHub Actions:

```bash
npm install -g gh-pages
npm run deploy
```

Note: Environment variables (.env) are not included in the GitHub Pages deployment. You'll need to configure API keys and tokens separately if your deployment requires them at runtime.

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
│   ├── components/          # React components (future expansion)
│   ├── hooks/
│   │   └── useHomeAssistant.ts  # Custom hook for HA connection
│   ├── services/
│   │   └── homeAssistant.ts     # WebSocket service
│   ├── types/
│   │   └── homeAssistant.ts     # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
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

The project includes comprehensive TypeScript types for Home Assistant entities:

- `MediaPlayerEntity` - Media player state and attributes
- `InputSelectEntity` - Input select state and options
- `DashboardState` - Complete dashboard state

## Troubleshooting

### Connection Issues

- **"Connection Error"**: Verify your Home Assistant URL and token
- **"Disconnected"**: The app will automatically try to reconnect every 5 seconds
- **CORS Issues**: Home Assistant should allow WebSocket connections from your network

### Album Art Not Showing

- Ensure the Spotify integration is properly configured in Home Assistant
- Check that the `entity_picture` attribute is available on your media player entity
- Verify the Home Assistant URL in the configuration (should match HTTP/HTTPS with WS/WSS)

### Entities Not Found

- Check entity IDs in Home Assistant Developer Tools → States
- Update entity IDs in `src/hooks/useHomeAssistant.ts` if different

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

Built with React, TypeScript, and Home Assistant for an awesome New Year's party experience!