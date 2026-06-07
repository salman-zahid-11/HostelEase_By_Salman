import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiBaseUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(page: number = 1, limit: number = 10, isRead?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (isRead !== undefined) {
      params = params.set('isRead', isRead.toString());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getUnreadCount(): Observable<{ success: boolean; unreadCount: number }> {
    return this.http.get<{ success: boolean; unreadCount: number }>(
      `${this.apiUrl}/unread-count`
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/mark-all-read`, {});
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
