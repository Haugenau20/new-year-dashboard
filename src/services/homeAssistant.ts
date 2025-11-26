import {
  createConnection,
  subscribeEntities,
  HassEntities,
  Connection,
  Auth,
  createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';

export class HomeAssistantService {
  private connection: Connection | null = null;
  private auth: Auth | null = null;
  private reconnectTimer: number | null = null;
  private subscribers: Set<(entities: HassEntities) => void> = new Set();

  constructor(
    private url: string,
    private token: string
  ) {}

  async connect(): Promise<void> {
    try {
      // Create auth with long-lived access token
      this.auth = createLongLivedTokenAuth(this.url, this.token);

      // Create connection
      this.connection = await createConnection({ auth: this.auth });

      console.log('Connected to Home Assistant');

      // Subscribe to entity updates
      subscribeEntities(this.connection, (entities) => {
        this.notifySubscribers(entities);
      });

      // Handle connection loss
      this.connection.addEventListener('ready', () => {
        console.log('Home Assistant connection ready');
      });

      this.connection.addEventListener('disconnected', () => {
        console.log('Disconnected from Home Assistant');
        this.scheduleReconnect();
      });

      this.connection.addEventListener('reconnect-error', () => {
        console.error('Reconnection failed');
        this.scheduleReconnect();
      });
    } catch (error) {
      console.error('Failed to connect to Home Assistant:', error);
      this.scheduleReconnect();
      throw error;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    // Try to reconnect after 5 seconds
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect().catch((error) => {
        console.error('Reconnection attempt failed:', error);
      });
    }, 5000);
  }

  subscribe(callback: (entities: HassEntities) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(entities: HassEntities): void {
    this.subscribers.forEach((callback) => callback(entities));
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    this.subscribers.clear();
  }

  isConnected(): boolean {
    return this.connection !== null;
  }
}
