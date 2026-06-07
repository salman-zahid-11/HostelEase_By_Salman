import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-technician-dashboard',
  templateUrl: './technician-dashboard.component.html'
})
export class TechnicianDashboardComponent implements OnInit, OnDestroy {

  currentUser: any = null;
  
  complaints: any[] = [];
  pendingComplaints = 0;
  resolvedComplaints = 0;
  isLoading = false;
  private pollInterval: any;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userStr || !token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.currentUser = JSON.parse(userStr);

    // ✅ Debug: check what ID format we have
    console.log('=== TECHNICIAN DEBUG ===');
    console.log('Current User:', this.currentUser);
    console.log('User ID (id):', this.currentUser?.id);
    console.log('User ID (_id):', this.currentUser?._id);

    this.loadComplaints();

    // Live polling every 15 seconds
    this.pollInterval = setInterval(() => {
      this.loadComplaints(true);
    }, 15000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUserId(): string {
    // Try all possible ID formats
    return this.currentUser?.id ||
           this.currentUser?._id ||
           this.currentUser?.userId || '';
  }

loadComplaints(silent = false): void {
  if (!silent) this.isLoading = true;

  this.http.get<any>(`${environment.apiBaseUrl}/complaints`, { headers: this.getHeaders() })
    .subscribe({
      next: (res) => {
        // ✅ Debug raw response first
        console.log('RAW API Response:', res);
        console.log('Response type:', typeof res);
        console.log('Response keys:', Object.keys(res || {}));

        // ✅ Handle ALL possible response formats
        let all: any[] = [];
        if (Array.isArray(res)) {
        all = res;
          } else if (Array.isArray(res?.data)) {
  all = res.data;        // ← THIS is your format
          } else if (Array.isArray(res?.complaints)) {
            all = res.complaints;
          } else if (Array.isArray(res?.result)) {
          all = res.result;
        } else {
          console.warn('Unknown response format:', res);
          all = [];
        }

        const userId = this.getUserId();
        console.log('My userId:', userId);
        console.log('Total complaints:', all.length);
        all.forEach((c: any) => {
          console.log(`"${c.title}" → assignedTo:`, c.assignedTo);
        });

        // Filter for this technician
        this.complaints = all.filter((c: any) => {
          const assignedTo = c.assignedTo;
          if (!assignedTo) return false;
          if (typeof assignedTo === 'string') return assignedTo === userId;
          if (typeof assignedTo === 'object') {
            return assignedTo._id === userId ||
                   assignedTo.id === userId ||
                   assignedTo._id?.toString() === userId ||
                   assignedTo.toString() === userId;
          }
          return false;
        });

        console.log('My complaints:', this.complaints.length);
        this.updateCounts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        if (err.status === 401) this.router.navigate(['/auth/login']);
      }
    });
}

  refreshComplaints(): void {
    this.loadComplaints();
  }

  updateStatus(id: string, status: string, complaint: any): void {
    this.http.patch(
      `${environment.apiBaseUrl}/complaints/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        complaint.status = status;
        this.updateCounts();
        console.log(`Complaint ${id} updated to: ${status}`);
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }

  updateCounts(): void {
    this.pendingComplaints = this.complaints.filter(
      c => c.status !== 'resolved'
    ).length;
    this.resolvedComplaints = this.complaints.filter(
      c => c.status === 'resolved'
    ).length;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'assigned': '📌 Assigned',
      'in-progress': '🔄 In Progress',
      'resolved': '✅ Resolved',
      'pending': '⏳ Pending'
    };
    return labels[status] || status;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

 
selectedImage: string | null = null;
openImage(url: string): void {
  this.selectedImage = url;
}

closeImage(): void {
  this.selectedImage = null;
}


}