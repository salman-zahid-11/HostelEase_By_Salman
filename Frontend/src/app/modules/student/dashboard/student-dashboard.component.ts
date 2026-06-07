import { Component, OnInit } from '@angular/core';
import { ComplaintService, Complaint } from '@app/core/services/complaint.service';
import { AuthService, User } from '@app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  user: User | null = null;
  complaints: Complaint[] = [];
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  };
  isLoading = true;
  selectedFilter = 'all';
  filters: any = {};

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    
    // Load stats
    this.complaintService.getDashboardStats().subscribe(
      (response: any) => {
        if (response.success) {
          this.stats = response.data;
        }
      },
      (error: any) => console.error('Error loading stats', error)
    );

    // Load complaints
    this.complaintService.getComplaints(this.filters).subscribe(
      (response: any) => {
        if (response.success) {
          this.complaints = response.data;
        }
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading complaints', error);
        this.isLoading = false;
      }
    );
  }

  filterComplaints(status: string): void {
    this.selectedFilter = status;
    this.filters = status === 'all' ? {} : { status };
    this.loadDashboard();
  }

  createComplaint(): void {
    this.router.navigate(['/student/report-issue']);
  }

  viewComplaintDetails(id: string): void {
    this.router.navigate(['/student/complaint', id]);
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-orange-100 text-orange-800',
      'resolved': 'bg-green-100 text-green-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
