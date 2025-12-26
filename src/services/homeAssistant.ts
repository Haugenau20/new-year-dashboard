export interface HomeAssistantConfig {
  url: string;
  token: string;
}

export class HomeAssistantService {
  private config: HomeAssistantConfig;

  constructor(config: HomeAssistantConfig) {
    this.config = config;
  }

  /**
   * Reads the NFC queue tracker entity from Home Assistant
   * Returns array of Spotify track URIs that were queued via NFC
   */
  async getNFCQueueTracker(): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.config.url}/api/states/input_text.nfc_queue_tracker`,
        {
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HA API error: ${response.statusText}`);
      }

      const data = await response.json();
      const value = data.state || '';

      // Parse comma-separated URIs
      if (!value || value.trim() === '') {
        return [];
      }

      return value
        .split(',')
        .map((uri: string) => uri.trim())
        .filter((uri: string) => uri.length > 0);
    } catch (error) {
      console.error('Error fetching NFC queue tracker:', error);
      return [];
    }
  }
}
