import {
  SpotifyTokens,
  SpotifyConfig,
  SpotifyPlaybackState,
  SpotifyQueue,
  SpotifyPlaylist,
} from '../types/spotify';

const TOKEN_STORAGE_KEY = 'spotify_tokens';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com';

export class SpotifyService {
  private config: SpotifyConfig;
  private tokens: SpotifyTokens | null = null;
  private rateLimitedUntil: number = 0;
  private rateLimitCount: number = 0;
  private rateLimitFirstOccurrence: number = 0;

  constructor(config: SpotifyConfig) {
    this.config = config;
    this.loadTokensFromStorage();
  }

  // OAuth Flow
  startAuthFlow(): void {
    const scopes = [
      'user-read-playback-state',
      'user-read-currently-playing',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative',
    ];

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: scopes.join(' '),
      show_dialog: 'false',
    });

    window.location.href = `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<void> {
    // Determine the Cloud Function URL
    const functionsUrl = this.config.functionsUrl ||
      import.meta.env.VITE_FIREBASE_FUNCTIONS_URL ||
      'https://us-central1-new-year-dashboard.cloudfunctions.net';

    const response = await fetch(`${functionsUrl}/exchangeSpotifyToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        redirectUri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to authenticate with Spotify' }));
      throw new Error(error.error || 'Failed to exchange code for tokens');
    }

    const data = await response.json();
    this.tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };

    this.saveTokensToStorage();
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    // Determine the Cloud Function URL
    const functionsUrl = this.config.functionsUrl ||
      import.meta.env.VITE_FIREBASE_FUNCTIONS_URL ||
      'https://us-central1-new-year-dashboard.cloudfunctions.net';

    const response = await fetch(`${functionsUrl}/refreshSpotifyToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: this.tokens.refresh_token,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to refresh token' }));
      throw new Error(error.error || 'Failed to refresh token');
    }

    const data = await response.json();
    this.tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || this.tokens.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    };

    this.saveTokensToStorage();
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.tokens) {
      throw new Error('Not authenticated with Spotify');
    }

    // Refresh if token expires in less than 5 minutes
    if (this.tokens.expires_at < Date.now() + 5 * 60 * 1000) {
      await this.refreshAccessToken();
    }
  }

  private async spotifyRequest<T>(endpoint: string): Promise<T> {
    await this.ensureValidToken();

    // Check if we're currently rate limited
    if (this.isRateLimited()) {
      const waitTime = Math.ceil((this.rateLimitedUntil - Date.now()) / 1000);
      throw new Error(`Rate limited. Retry after ${waitTime} seconds`);
    }

    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.tokens!.access_token}`,
      },
    });

    if (response.status === 429) {
      // Handle rate limiting
      const retryAfter = response.headers.get('Retry-After');
      const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : 60;

      this.rateLimitedUntil = Date.now() + retryAfterSeconds * 1000;

      // Track first occurrence for 24-hour reset
      if (this.rateLimitCount === 0) {
        this.rateLimitFirstOccurrence = Date.now();
      }

      this.rateLimitCount++;

      console.warn(`Rate limited by Spotify (occurrence #${this.rateLimitCount}). Retry after ${retryAfterSeconds} seconds`);
      throw new Error(`Rate limited. Retry after ${retryAfterSeconds} seconds`);
    }

    if (response.status === 401) {
      // Token might be invalid, try refreshing
      await this.refreshAccessToken();
      // Retry request
      const retryResponse = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.tokens!.access_token}`,
        },
      });

      if (!retryResponse.ok) {
        throw new Error(`Spotify API error: ${retryResponse.statusText}`);
      }

      return retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
  }

  // API Methods
  async getCurrentPlayback(): Promise<SpotifyPlaybackState | null> {
    try {
      return await this.spotifyRequest<SpotifyPlaybackState>('/me/player');
    } catch (error) {
      console.error('Error fetching current playback:', error);
      return null;
    }
  }

  async getQueue(): Promise<SpotifyQueue | null> {
    try {
      return await this.spotifyRequest<SpotifyQueue>('/me/player/queue');
    } catch (error) {
      console.error('Error fetching queue:', error);
      return null;
    }
  }

  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist | null> {
    try {
      return await this.spotifyRequest<SpotifyPlaylist>(`/playlists/${playlistId}`);
    } catch (error) {
      // Silently fail - playlist may not be available or accessible
      return null;
    }
  }

  // Rate Limit Management
  isRateLimited(): boolean {
    return Date.now() < this.rateLimitedUntil;
  }

  getRateLimitCount(): number {
    // Reset count if 24 hours have passed since first rate limit
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (
      this.rateLimitCount > 0 &&
      this.rateLimitFirstOccurrence > 0 &&
      Date.now() - this.rateLimitFirstOccurrence >= TWENTY_FOUR_HOURS
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Resetting rate limit counter after 24 hours');
      }
      this.rateLimitCount = 0;
      this.rateLimitFirstOccurrence = 0;
    }

    return this.rateLimitCount;
  }

  // Token Management
  private saveTokensToStorage(): void {
    if (this.tokens) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(this.tokens));
    }
  }

  private loadTokensFromStorage(): void {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      try {
        this.tokens = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored tokens:', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
  }

  isAuthenticated(): boolean {
    return this.tokens !== null && this.tokens.expires_at > Date.now();
  }

  clearTokens(): void {
    this.tokens = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
