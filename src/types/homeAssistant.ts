import { HassEntity } from 'home-assistant-js-websocket';

export interface MediaPlayerEntity extends HassEntity {
  attributes: {
    media_content_id?: string;
    media_content_type?: string;
    media_duration?: number;
    media_position?: number;
    media_position_updated_at?: string;
    media_title?: string;
    media_artist?: string;
    media_album_name?: string;
    entity_picture?: string;
    volume_level?: number;
    is_volume_muted?: boolean;
    source?: string;
    source_list?: string[];
    friendly_name?: string;
    supported_features?: number;
  };
  state: 'playing' | 'paused' | 'idle' | 'off' | 'unavailable';
}

export interface InputSelectEntity extends HassEntity {
  attributes: {
    options?: string[];
    friendly_name?: string;
  };
  state: string;
}

export interface DashboardState {
  mainPlayer: MediaPlayerEntity | null;
  speakers: {
    kontor: MediaPlayerEntity | null;
    stue: MediaPlayerEntity | null;
  };
  playlistSelector: InputSelectEntity | null;
  connected: boolean;
  error: string | null;
}
