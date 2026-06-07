import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Complaint {
  _id: string;
  complaintId: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  images: string[];
  assignedTo?: any;
  location: {
    block: string;
    roomNumber: string;
  };
  studentId: any;
  createdAt: string;
  updatedAt: string;
  statusTimeline: any[];
  studentFeedback?: any;
  resolvedAt?: string;
}

export interface ComplaintsResponse {
  success: boolean;
  data: Complaint[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = `${environment.apiBaseUrl}/complaints`;

  constructor(private http: HttpClient) {}

  getComplaints(filters?: any, page: number = 1, limit: number = 10): Observable<ComplaintsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<ComplaintsResponse>(this.apiUrl, { params });
  }

  getComplaint(id: string): Observable<{ success: boolean; data: Complaint }> {
    return this.http.get<{ success: boolean; data: Complaint }>(`${this.apiUrl}/${id}`);
  }

  createComplaint(complaintData: any): Observable<{ success: boolean; data: Complaint; message: string }> {
    return this.http.post<{ success: boolean; data: Complaint; message: string }>(
      this.apiUrl,
      complaintData
    );
  }

  updateComplaint(id: string, updateData: any): Observable<{ success: boolean; data: Complaint }> {
    return this.http.put<{ success: boolean; data: Complaint }>(
      `${this.apiUrl}/${id}`,
      updateData
    );
  }

  updateStatus(id: string, status: string, note?: string): Observable<{ success: boolean; data: Complaint }> {
    return this.http.patch<{ success: boolean; data: Complaint }>(
      `${this.apiUrl}/${id}/status`,
      { status, note }
    );
  }

  assignComplaint(id: string, technicianId: string): Observable<{ success: boolean; data: Complaint }> {
    return this.http.patch<{ success: boolean; data: Complaint }>(
      `${this.apiUrl}/${id}/assign`,
      { technicianId }
    );
  }

  addFeedback(id: string, rating: number, comment: string): Observable<{ success: boolean; data: Complaint }> {
    return this.http.post<{ success: boolean; data: Complaint }>(
      `${this.apiUrl}/${id}/feedback`,
      { rating, comment }
    );
  }

  getDashboardStats(): Observable<{ success: boolean; data: any }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/stats/dashboard`);
  }
}
