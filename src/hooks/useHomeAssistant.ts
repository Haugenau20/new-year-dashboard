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

    setState((prevState) => {
      const prevPlayer = prevState.mainPlayer;

      // Check if meaningful properties changed (not just position)
      if (prevPlayer && mainPlayer) {
        const stateUnchanged = (
          prevPlayer.state === mainPlayer.state &&
          prevPlayer.attributes.media_title === mainPlayer.attributes.media_title &&
          prevPlayer.attributes.media_artist === mainPlayer.attributes.media_artist &&
          prevPlayer.attributes.entity_picture === mainPlayer.attributes.entity_picture &&
          prevPlayer.attributes.media_duration === mainPlayer.attributes.media_duration
        );

        // If only position changed, don't update state (NowPlaying handles position internally)
        if (stateUnchanged) {
          return prevState;
        }

        // Log when meaningful changes occur
        if (process.env.NODE_ENV === 'development') {
          const stateChanged = prevPlayer.state !== mainPlayer.state;
          const trackChanged = prevPlayer.attributes.media_title !== mainPlayer.attributes.media_title;

          if (stateChanged || trackChanged) {
            console.log('🏠 HA update:', mainPlayer.state, '-', mainPlayer.attributes.media_title);
          }
        }
      }

      return {
        ...prevState,
        mainPlayer: mainPlayer || null,
        speakers: {
          kontor: (entities[ENTITY_IDS.KONTOR_SPEAKER] as MediaPlayerEntity) || null,
          stue: (entities[ENTITY_IDS.STUE_SPEAKER] as MediaPlayerEntity) || null,
        },
        playlistSelector: (entities[ENTITY_IDS.PLAYLIST_SELECTOR] as InputSelectEntity) || null,
        connected: true,
        error: null,
      };
    });
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
