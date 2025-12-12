export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  uri: string;
}

export interface SpotifyContext {
  type: 'playlist' | 'album' | 'artist' | 'show';
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaybackState {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack | null;
  context: SpotifyContext | null;
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: boolean;
  repeat_state: 'off' | 'track' | 'context';
  timestamp: number;
}

export interface SpotifyQueue {
  currently_playing: SpotifyTrack | null;
  queue: SpotifyTrack[];
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
}

export interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  functionsUrl?: string; // Optional Firebase Functions URL
}
