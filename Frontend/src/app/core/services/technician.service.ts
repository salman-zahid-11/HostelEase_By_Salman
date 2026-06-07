import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private apiUrl = `${environment.apiBaseUrl}/technicians`;

  constructor(private http: HttpClient) {}

  getTechnicians(): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(this.apiUrl);
  }

  addTechnician(technicianData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, technicianData);
  }

  updateTechnician(id: string, updateData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateData);
  }

  deleteTechnician(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
