import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '@app/core/services/admin.service';
import { ComplaintService, Complaint } from '@app/core/services/complaint.service';
import { AuthService, User } from '@app/core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'wardens';
  
  // Wardens and Hostel Assignment
  wardens: any[] = [];
  isLoadingUsers = false;
  hostelTypes = ['boys', 'girls', 'staff', 'none'];

  // Pending Approvals
  pendingUsers: any[] = [];
  isLoadingApprovals = false;

  // Complaints
  complaints: Complaint[] = [];
  isLoadingComplaints = false;

  constructor(
    private adminService: AdminService,
    private complaintService: ComplaintService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.loadWardens();
    this.loadPendingApprovals();
    this.loadAllComplaints();
  }

  loadWardens(): void {
    this.isLoadingUsers = true;
    this.adminService.getUsers('warden').subscribe(
      (response: any) => {
        if (response.success) {
          this.wardens = response.data.map((w: any) => {
            const warden = { ...w };
            if (!warden.wardenDetails) {
              warden.wardenDetails = { employeeId: '', officeDepartment: '', hostelAssignment: 'none' };
            } else if (!warden.wardenDetails.hostelAssignment) {
              warden.wardenDetails.hostelAssignment = 'none';
            }
            return warden;
          });
        }
        this.isLoadingUsers = false;
      },
      (error: any) => {
        console.error('Error loading wardens', error);
        this.isLoadingUsers = false;
      }
    );
  }

  loadPendingApprovals(): void {
    this.isLoadingApprovals = true;
    this.adminService.getPendingApprovals().subscribe(
      (response: any) => {
        if (response.success) {
          this.pendingUsers = response.data;
        }
        this.isLoadingApprovals = false;
      },
      (error: any) => {
        console.error('Error loading approvals', error);
        this.isLoadingApprovals = false;
      }
    );
  }

  loadAllComplaints(): void {
    this.isLoadingComplaints = true;
    this.complaintService.getComplaints({}, 1, 100).subscribe(
      (response: any) => {
        if (response.success) {
          this.complaints = response.data;
        }
        this.isLoadingComplaints = false;
      },
      (error: any) => {
        console.error('Error loading complaints', error);
        this.isLoadingComplaints = false;
      }
    );
  }

  approveUser(id: string): void {
    if (confirm('Are you sure you want to approve this user?')) {
      this.adminService.approveUser(id).subscribe(
        (response: any) => {
          alert('User approved successfully.');
          this.loadPendingApprovals();
          this.loadWardens();
        },
        (error: any) => {
          alert(error.error?.message || 'Approval failed.');
        }
      );
    }
  }

  rejectUser(id: string): void {
    if (confirm('Are you sure you want to reject and delete this user registration?')) {
      this.adminService.rejectUser(id).subscribe(
        (response: any) => {
          alert('User rejected and removed.');
          this.loadPendingApprovals();
        },
        (error: any) => {
          alert(error.error?.message || 'Rejection failed.');
        }
      );
    }
  }

  updateWardenHostel(warden: any): void {
    const hostelAssignment = warden.wardenDetails?.hostelAssignment || 'none';
    this.adminService.assignHostel(warden._id, hostelAssignment).subscribe(
      (response: any) => {
        alert(`Hostel assignment updated to ${hostelAssignment === 'none' ? 'None' : hostelAssignment + ' hostel'}.`);
        this.loadWardens();
      },
      (error: any) => {
        alert(error.error?.message || 'Updating hostel assignment failed.');
      }
    );
  }

  viewComplaintDetails(id: string): void {
    this.router.navigate(['/warden/complaint', id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'assigned': 'bg-blue-100 text-blue-800 border border-blue-200',
      'in_progress': 'bg-orange-100 text-orange-800 border border-orange-200',
      'resolved': 'bg-green-100 text-green-800 border border-green-200',
      'cancelled': 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}
