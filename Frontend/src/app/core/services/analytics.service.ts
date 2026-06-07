import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiBaseUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getComplaintsOverTime(period: string = 'week'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/complaints-over-time`, {
      params: { period }
    });
  }

  getComplaintsByCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-category`);
  }

  getTechnicianPerformance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/technician-performance`);
  }

  getResponseTime(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/response-time`);
  }
}
