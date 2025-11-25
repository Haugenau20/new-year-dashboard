import { useState, useEffect, useCallback } from 'react';
import { HassEntities } from 'home-assistant-js-websocket';
import { HomeAssistantService } from '../services/homeAssistant';
import { DashboardState, MediaPlayerEntity, InputSelectEntity } from '../types/homeAssistant';

const ENTITY_IDS = {
  MAIN_PLAYER: 'media_player.spotify_soren_kjaedegaard_haug',
  KONTOR_SPEAKER: 'media_player.kontor_1140714430_spotcast',
  STUE_SPEAKER: 'media_player.beoconnect_core_stue',
  PLAYLIST_SELECTOR: 'input_select.playlist_selector',
};

export function useHomeAssistant(url: string, token: string) {
  const [state, setState] = useState<DashboardState>({
    mainPlayer: null,
    speakers: {
      kontor: null,
      stue: null,
    },
    playlistSelector: null,
    connected: false,
    error: null,
  });

  const updateEntities = useCallback((entities: HassEntities) => {
    const mainPlayer = entities[ENTITY_IDS.MAIN_PLAYER] as MediaPlayerEntity;

    // Log updates for debugging
    if (mainPlayer) {
      console.log('Media player update:', {
        state: mainPlayer.state,
        track: mainPlayer.attributes.media_title,
        position: mainPlayer.attributes.media_position,
        last_updated: mainPlayer.last_updated,
      });
    }

    setState((prevState) => ({
      ...prevState,
      mainPlayer: mainPlayer || null,
      speakers: {
        kontor: (entities[ENTITY_IDS.KONTOR_SPEAKER] as MediaPlayerEntity) || null,
        stue: (entities[ENTITY_IDS.STUE_SPEAKER] as MediaPlayerEntity) || null,
      },
      playlistSelector: (entities[ENTITY_IDS.PLAYLIST_SELECTOR] as InputSelectEntity) || null,
      connected: true,
      error: null,
    }));
  }, []);

  useEffect(() => {
    // Don't try to connect if URL or token are empty
    if (!url || !token) {
      return;
    }

    let unsubscribe: (() => void) | null = null;
    const haService = new HomeAssistantService(url, token);

    const initConnection = async () => {
      try {
        await haService.connect();
        unsubscribe = haService.subscribe(updateEntities);
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          connected: false,
          error: error instanceof Error ? error.message : 'Failed to connect',
        }));
      }
    };

    initConnection();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      haService.disconnect();
    };
  }, [url, token, updateEntities]);

  return state;
}
