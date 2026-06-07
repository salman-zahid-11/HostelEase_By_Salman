import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class CapacitorService {

  constructor() { }

  /**
   * Check if running on a Capacitor platform (mobile/desktop)
   */
  isCapacitorPlatform(): boolean {
    return (window as any).Capacitor !== undefined;
  }

  /**
   * Take a photo from camera or select from gallery
   */
  async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
      return image.dataUrl || null;
    } catch (error) {
      console.error('Camera error:', error);
      return null;
    }
  }

  /**
   * Get device's current location
   */
  async getLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Geolocation error:', error);
      return null;
    }
  }

  /**
   * Send local notification
   */
  async sendNotification(title: string, body: string, id: number = 1): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: new Date(Date.now() + 1000) }
          }
        ]
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  /**
   * Check network connectivity status
   */
  async getNetworkStatus(): Promise<{ connected: boolean; type: string }> {
    try {
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        type: status.connectionType
      };
    } catch (error) {
      console.error('Network error:', error);
      return { connected: false, type: 'unknown' };
    }
  }

  /**
   * Monitor network changes
   */
  watchNetworkStatus(callback: (connected: boolean) => void): void {
    if (!this.isCapacitorPlatform()) return;

    Network.addListener('networkStatusChange', (status) => {
      callback(status.connected);
    });
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<any> {
    try {
      const info = await Device.getInfo();
      return info;
    } catch (error) {
      console.error('Device info error:', error);
      return null;
    }
  }

  /**
   * Get device ID
   */
  async getDeviceId(): Promise<string | null> {
    try {
      const id = await Device.getId();
      return id.identifier;
    } catch (error) {
      console.error('Device ID error:', error);
      return null;
    }
  }
}
