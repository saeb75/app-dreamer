// services/SocketService.ts
import { io, Socket } from 'socket.io-client';
import { Alert, AppState } from 'react-native';

interface SocketEvents {
  generation_started: (data: any) => void;
  composition_completed: (data: any) => void;
  face_swap_started: (data: any) => void;
  face_swap_completed: (data: any) => void;
  ai_generation_started: (data: any) => void;
  ai_generation_completed: (data: any) => void;
  generation_completed: (data: any) => void;
  generation_failed: (error: any) => void;
  continue: (data: any) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private userId: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10; // Increased max attempts
  private reconnectDelay: number = 1000; // 1 second
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isReconnecting: boolean = false;
  private appStateSubscription: any = null;
  private isBackground: boolean = false;
  private connectionCallback: (() => void) | null = null;

  connect(userId: string, onReconnected?: () => void): void {
    this.userId = userId;
    this.reconnectAttempts = 0;
    this.connectionCallback = onReconnected || null;
    this.setupAppStateListener();
    this.connectToServer();
  }

  private setupAppStateListener(): void {
    // Remove existing listener if any
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }

    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('SocketService - App state changed to:', nextAppState);

      if (nextAppState === 'active') {
        this.isBackground = false;
        // App came to foreground, check connection
        if (this.userId && !this.isConnected && !this.isReconnecting) {
          console.log('SocketService - Reconnecting after foreground...');
          this.reconnect();
        }
      } else if (nextAppState === 'background') {
        this.isBackground = true;
        console.log('SocketService - App went to background, keeping connection alive');
        // Don't disconnect, keep connection alive
      }
    });
  }

  private connectToServer(): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(process.env.EXPO_PUBLIC_GENERATE_API, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false, // We'll handle reconnection manually
      timeout: 15000, // Increased timeout to 15 seconds
      forceNew: true,
      upgrade: true,
      rememberUpgrade: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('SocketService - Socket connected:', this.socket?.id);
      this.isConnected = true;
      this.isReconnecting = false;
      this.reconnectAttempts = 0;

      // Kullanıcı authentication
      this.socket?.emit('authenticate', { userId: this.userId });

      // Call the callback to re-setup listeners
      if (this.connectionCallback) {
        console.log('SocketService - Re-setting up listeners after reconnection');
        this.connectionCallback();
      }
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('SocketService - Socket disconnected:', reason);
      this.isConnected = false;

      // Only attempt reconnect if it wasn't a manual disconnect and app is not in background
      if (reason !== 'io client disconnect' && this.userId && !this.isBackground) {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('SocketService - Socket connection error:', error);
      this.isConnected = false;

      if (this.userId && !this.isBackground) {
        this.attemptReconnect();
      }
    });

    // Add ping/pong for connection health
    this.socket.on('ping', () => {
      this.socket?.emit('pong');
    });
  }

  private attemptReconnect(): void {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('SocketService - Max reconnection attempts reached');
        Alert.alert(
          'Bağlantı Hatası',
          'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
          [
            {
              text: 'Tekrar Dene',
              onPress: () => {
                this.reconnectAttempts = 0;
                this.connectToServer();
              },
            },
            {
              text: 'İptal',
              style: 'cancel',
            },
          ]
        );
      }
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    console.log(
      `SocketService - Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    // Clear existing timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    // Exponential backoff: delay increases with each attempt
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    this.reconnectTimer = setTimeout(() => {
      this.connectToServer();
    }, delay);
  }

  disconnect(): void {
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Remove app state listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    this.isReconnecting = false;
    this.reconnectAttempts = 0;
    this.userId = null;
    this.isBackground = false;
    this.connectionCallback = null;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Manual reconnect method
  reconnect(): void {
    if (this.userId) {
      this.reconnectAttempts = 0;
      this.isReconnecting = false;
      this.connectToServer();
    }
  }

  // Generation event listeners
  onGenerationStarted(callback: (data: any) => void): void {
    this.socket?.on('generation_started', callback);
  }

  onGenerationProgress(callback: (data: any) => void): void {
    this.socket?.on('continue', callback);
  }

  onCompositionCompleted(callback: (data: any) => void): void {
    this.socket?.on('composition_completed', callback);
  }

  onFaceSwapStarted(callback: (data: any) => void): void {
    this.socket?.on('face_swap_started', callback);
  }

  onFaceSwapCompleted(callback: (data: any) => void): void {
    this.socket?.on('face_swap_completed', callback);
  }

  onAIGenerationStarted(callback: (data: any) => void): void {
    this.socket?.on('ai_generation_started', callback);
  }

  onAIGenerationCompleted(callback: (data: any) => void): void {
    this.socket?.on('ai_generation_completed', callback);
  }

  onGenerationCompleted(callback: (data: any) => void): void {
    this.socket?.on('generation_completed', callback);
  }

  onGenerationFailed(callback: (error: any) => void): void {
    this.socket?.on('generation_failed', callback);
  }

  // Event listener'ları temizle
  off(event: keyof SocketEvents): void {
    this.socket?.off(event);
  }

  offAll(): void {
    this.socket?.off('generation_started');
    this.socket?.off('composition_completed');
    this.socket?.off('face_swap_started');
    this.socket?.off('face_swap_completed');
    this.socket?.off('ai_generation_started');
    this.socket?.off('ai_generation_completed');
    this.socket?.off('generation_completed');
    this.socket?.off('generation_failed');
    this.socket?.off('continue');
  }

  // Getter methods for checking connection status
  get connected(): boolean {
    return this.isConnected;
  }

  get socketId(): string | undefined {
    return this.socket?.id;
  }

  get reconnecting(): boolean {
    return this.isReconnecting;
  }

  get reconnectAttemptsCount(): number {
    return this.reconnectAttempts;
  }

  get background(): boolean {
    return this.isBackground;
  }
}

export default new SocketService();
