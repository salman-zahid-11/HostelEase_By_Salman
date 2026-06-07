import { Component, OnInit } from '@angular/core';
import { ComplaintService, Complaint } from '@app/core/services/complaint.service';
import { AnalyticsService } from '@app/core/services/analytics.service';
import { TechnicianService } from '@app/core/services/technician.service';
import { AuthService, User } from '@app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warden-dashboard',
  templateUrl: './warden-dashboard.component.html',
  styleUrls: ['./warden-dashboard.component.css']
})
export class WardenDashboardComponent implements OnInit {
  user: User | null = null;
  complaints: Complaint[] = [];
  technicians: any[] = [];
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  };
  isLoading = true;
  selectedFilter = 'all';
  filters: any = {};
  activeTab = 'complaints';

  // Analytics data
  chartData: any = {};
  technicianPerformance: any[] = [];

  constructor(
    private complaintService: ComplaintService,
    private analyticsService: AnalyticsService,
    private technicianService: TechnicianService,
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
    this.complaintService.getComplaints(this.filters, 1, 20).subscribe(
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

    // Load technicians
    this.technicianService.getTechnicians().subscribe(
      (response: any) => {
        if (response.success) {
          this.technicians = response.data;
        }
      },
      (error: any) => console.error('Error loading technicians', error)
    );

    // Load analytics
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.analyticsService.getComplaintsByCategory().subscribe(
      (response: any) => {
        if (response.success) {
          // Prepare chart data
          const categories = response.data.map((item: any) => item._id);
          const counts = response.data.map((item: any) => item.count);
          
          this.chartData['byCategory'] = {
            labels: categories,
            datasets: [{
              label: 'Number of Complaints',
              data: counts,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40'
              ]
            }]
          };
        }
      },
      (error: any) => console.error('Error loading category analytics', error)
    );

    this.analyticsService.getTechnicianPerformance().subscribe(
      (response: any) => {
        if (response.success) {
          this.technicianPerformance = response.data;
        }
      },
      (error: any) => console.error('Error loading technician performance', error)
    );
  }

  filterComplaints(status: string): void {
    this.selectedFilter = status;
    this.filters = status === 'all' ? {} : { status };
    this.loadDashboard();
  }

  viewComplaintDetails(id: string): void {
    this.router.navigate(['/warden/complaint', id]);
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
