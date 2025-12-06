import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Subject, Observable, fromEvent, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { GlobalErrorHandlerService } from '../common/global-error-handler.service';
import { environment } from '../../../../environments/environment';

export interface SignalRMessage {
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface ConnectionStatus {
  state: HubConnectionState;
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected?: Date;
  reconnectAttempts: number;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnDestroy {
  private authService = inject(AuthService);
  private errorHandler = inject(GlobalErrorHandlerService);

  private hubConnection?: HubConnection;
  private destroy$ = new Subject<void>();
  
  // Connection status
  private connectionStatusSubject = new BehaviorSubject<ConnectionStatus>({
    state: HubConnectionState.Disconnected,
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0
  });

  // Message streams
  private messageSubject = new Subject<SignalRMessage>();
  private notificationSubject = new Subject<any>();
  private chatMessageSubject = new Subject<any>();
  private userStatusSubject = new Subject<any>();

  // Signals for reactive state
  public readonly connectionStatus = signal<ConnectionStatus>({
    state: HubConnectionState.Disconnected,
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0
  });

  // Observables
  public readonly connectionStatus$ = this.connectionStatusSubject.asObservable();
  public readonly messages$ = this.messageSubject.asObservable();
  public readonly notifications$ = this.notificationSubject.asObservable();
  public readonly chatMessages$ = this.chatMessageSubject.asObservable();
  public readonly userStatus$ = this.userStatusSubject.asObservable();

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;

  constructor() {
    this.setupAuthListener();
    this.setupNetworkListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return;
    }

    if (this.hubConnection?.state === HubConnectionState.Connecting) {
      return;
    }

    try {
      this.updateConnectionStatus({
        state: HubConnectionState.Connecting,
        isConnected: false,
        isConnecting: true,
        reconnectAttempts: this.reconnectAttempts
      });

      await this.createConnection();
      await this.startConnection();
      this.setupEventHandlers();
      
      this.reconnectAttempts = 0;
      this.updateConnectionStatus({
        state: HubConnectionState.Connected,
        isConnected: true,
        isConnecting: false,
        lastConnected: new Date(),
        reconnectAttempts: 0
      });

      console.log('SignalR connected successfully');
    } catch (error) {
      console.error('SignalR connection failed:', error);
      this.handleConnectionError(error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('SignalR disconnected');
      } catch (error) {
        console.error('Error disconnecting SignalR:', error);
      } finally {
        this.updateConnectionStatus({
          state: HubConnectionState.Disconnected,
          isConnected: false,
          isConnecting: false,
          reconnectAttempts: this.reconnectAttempts
        });
      }
    }
  }

  private async createConnection(): Promise<void> {
    const token = this.authService.getToken();
    
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/main`, {
        accessTokenFactory: () => token || '',
        withCredentials: false
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < 3) {
            return 2000;
          } else if (retryContext.previousRetryCount < 6) {
            return 5000;
          } else {
            return 10000;
          }
        }
      })
      .configureLogging(environment.production ? LogLevel.Warning : LogLevel.Information)
      .build();

    // Setup connection event handlers
    this.hubConnection.onreconnecting(() => {
      this.updateConnectionStatus({
        state: HubConnectionState.Reconnecting,
        isConnected: false,
        isConnecting: true,
        reconnectAttempts: this.reconnectAttempts + 1
      });
    });

    this.hubConnection.onreconnected(() => {
      this.reconnectAttempts = 0;
      this.updateConnectionStatus({
        state: HubConnectionState.Connected,
        isConnected: true,
        isConnecting: false,
        lastConnected: new Date(),
        reconnectAttempts: 0
      });
      console.log('SignalR reconnected');
    });

    this.hubConnection.onclose((error) => {
      this.updateConnectionStatus({
        state: HubConnectionState.Disconnected,
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: this.reconnectAttempts
      });
      
      if (error) {
        console.error('SignalR connection closed with error:', error);
        this.handleConnectionError(error);
      } else {
        console.log('SignalR connection closed');
      }
    });
  }

  private async startConnection(): Promise<void> {
    if (!this.hubConnection) {
      throw new Error('Hub connection not initialized');
    }

    await this.hubConnection.start();
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Generic message handler
    this.hubConnection.on('ReceiveMessage', (type: string, data: any, userId?: string) => {
      const message: SignalRMessage = {
        type,
        data,
        timestamp: new Date(),
        userId
      };
      this.messageSubject.next(message);
    });

    // Notification handlers
    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      this.notificationSubject.next(notification);
    });

    // Chat message handlers
    this.hubConnection.on('ReceiveChatMessage', (message: any) => {
      this.chatMessageSubject.next(message);
    });

    // User status handlers
    this.hubConnection.on('UserStatusChanged', (status: any) => {
      this.userStatusSubject.next(status);
    });

    // Community-specific handlers
    this.hubConnection.on('PostCreated', (post: any) => {
      this.messageSubject.next({
        type: 'PostCreated',
        data: post,
        timestamp: new Date()
      });
    });

    this.hubConnection.on('PostUpdated', (post: any) => {
      this.messageSubject.next({
        type: 'PostUpdated',
        data: post,
        timestamp: new Date()
      });
    });

    this.hubConnection.on('CommentAdded', (comment: any) => {
      this.messageSubject.next({
        type: 'CommentAdded',
        data: comment,
        timestamp: new Date()
      });
    });

    // Marketplace handlers
    this.hubConnection.on('ListingCreated', (listing: any) => {
      this.messageSubject.next({
        type: 'ListingCreated',
        data: listing,
        timestamp: new Date()
      });
    });

    this.hubConnection.on('BidPlaced', (bid: any) => {
      this.messageSubject.next({
        type: 'BidPlaced',
        data: bid,
        timestamp: new Date()
      });
    });
  }

  private setupAuthListener(): void {
    // Check authentication status periodically or on user changes
    // Since AuthService uses signals, we'll check on connection attempts
    if (this.authService.isAuthenticated()) {
      this.connect();
    }
  }

  private setupNetworkListener(): void {
    if (typeof window !== 'undefined') {
      merge(
        fromEvent(window, 'online'),
        fromEvent(window, 'offline')
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (navigator.onLine && this.authService.isAuthenticated()) {
          this.connect();
        }
      });
    }
  }

  private handleConnectionError(error: any): void {
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.errorHandler.showError(
        'Connection Failed',
        'Unable to establish real-time connection. Some features may not work properly.'
      );
    }
  }

  private updateConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus.set(status);
    this.connectionStatusSubject.next(status);
  }

  // Public methods for sending messages
  async sendMessage(method: string, ...args: any[]): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke(method, ...args);
      } catch (error) {
        console.error(`Error sending message ${method}:`, error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection is not established');
    }
  }

  async joinGroup(groupName: string): Promise<void> {
    await this.sendMessage('JoinGroup', groupName);
  }

  async leaveGroup(groupName: string): Promise<void> {
    await this.sendMessage('LeaveGroup', groupName);
  }

  async sendChatMessage(message: string, recipientId?: string): Promise<void> {
    await this.sendMessage('SendChatMessage', message, recipientId);
  }

  async updateUserStatus(status: 'online' | 'away' | 'busy' | 'offline'): Promise<void> {
    await this.sendMessage('UpdateUserStatus', status);
  }

  // Utility methods
  isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  isConnecting(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connecting ||
           this.hubConnection?.state === HubConnectionState.Reconnecting;
  }

  getConnectionState(): HubConnectionState {
    return this.hubConnection?.state || HubConnectionState.Disconnected;
  }

  // Observable filters for specific message types
  getMessagesOfType(type: string): Observable<SignalRMessage> {
    return this.messages$.pipe(
      filter(message => message.type === type)
    );
  }

  getMessagesFromUser(userId: string): Observable<SignalRMessage> {
    return this.messages$.pipe(
      filter(message => message.userId === userId)
    );
  }
}