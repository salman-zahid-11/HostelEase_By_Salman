import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CapacitorService } from './capacitor.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private connectionStatusSubject = new BehaviorSubject<boolean>(true);
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  private offlineQueue: Array<{ method: string; data: any }> = [];

  constructor(private capacitorService: CapacitorService) {
    this.initializeNetworkMonitoring();
  }

  /**
   * Initialize network monitoring
   */
  private initializeNetworkMonitoring(): void {
    // Check initial status
    this.checkConnection();

    // Monitor changes
    if (this.capacitorService.isCapacitorPlatform()) {
      this.capacitorService.watchNetworkStatus((connected) => {
        this.connectionStatusSubject.next(connected);
        if (connected) {
          this.processOfflineQueue();
        }
      });
    }
  }

  /**
   * Check current connection status
   */
  async checkConnection(): Promise<boolean> {
    const status = await this.capacitorService.getNetworkStatus();
    this.connectionStatusSubject.next(status.connected);
    return status.connected;
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.connectionStatusSubject.value;
  }

  /**
   * Get connection status as observable
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$;
  }

  /**
   * Queue an action for when connection is restored
   */
  queueAction(method: string, data: any): void {
    this.offlineQueue.push({ method, data });
    this.saveQueueToStorage();
  }

  /**
   * Process queued actions when connection is restored
   */
  private processOfflineQueue(): void {
    if (this.offlineQueue.length === 0) return;

    console.log(`Processing ${this.offlineQueue.length} queued actions`);

    // Process each queued action
    this.offlineQueue.forEach(({ method, data }) => {
      console.log(`Executing queued method: ${method}`);
      // You would implement actual processing here
      // For now, just log it
    });

    // Clear queue
    this.offlineQueue = [];
    this.saveQueueToStorage();
  }

  /**
   * Save queue to local storage for persistence
   */
  private saveQueueToStorage(): void {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Error saving queue to storage:', error);
    }
  }

  /**
   * Load queue from local storage
   */
  private loadQueueFromStorage(): void {
    try {
      const stored = localStorage.getItem('offlineQueue');
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading queue from storage:', error);
    }
  }

  /**
   * Get offline queue length
   */
  getQueueLength(): number {
    return this.offlineQueue.length;
  }

  /**
   * Clear offline queue
   */
  clearQueue(): void {
    this.offlineQueue = [];
    this.saveQueueToStorage();
  }
}
