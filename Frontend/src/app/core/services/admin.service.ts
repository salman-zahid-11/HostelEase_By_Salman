import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(role?: string, page: number = 1, limit: number = 100): Observable<{ success: boolean; data: any[]; pagination: any }> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (role) {
      params = params.set('role', role);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getPendingApprovals(): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<any>(`${this.apiUrl}/pending-approval`);
  }

  approveUser(id: string): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/reject`, {});
  }

  assignHostel(id: string, hostelAssignment: string): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/assign-hostel`, { hostelAssignment });
  }
}
