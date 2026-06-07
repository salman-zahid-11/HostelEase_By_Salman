import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintService, Complaint } from '@app/core/services/complaint.service';
import { TechnicianService } from '@app/core/services/technician.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-warden-complaint-details',
  templateUrl: './warden-complaint-details.component.html',
  styleUrls: ['./warden-complaint-details.component.css']
})
export class WardenComplaintDetailsComponent implements OnInit {
  complaint: Complaint | null = null;
  technicians: any[] = [];
  selectedTechnicianId = '';
  newStatus = '';
  statusNote = '';
  isLoading = true;
  isAssigning = false;
  isUpdatingStatus = false;
  user: any = null;

  constructor(
    private complaintService: ComplaintService,
    private technicianService: TechnicianService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadComplaint(id);
      this.loadTechnicians();
    }
  }

  loadComplaint(id: string): void {
    this.isLoading = true;
    this.complaintService.getComplaint(id).subscribe(
      (response: any) => {
        if (response.success && response.data) {
          this.complaint = response.data;
          this.newStatus = response.data.status;
          if (response.data.assignedTo) {
            this.selectedTechnicianId = response.data.assignedTo._id || response.data.assignedTo;
          }
        }
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading complaint', error);
        this.isLoading = false;
      }
    );
  }

  loadTechnicians(): void {
    this.technicianService.getTechnicians().subscribe(
      (response: any) => {
        if (response.success) {
          this.technicians = response.data;
        }
      },
      (error: any) => {
        console.error('Error loading technicians', error);
      }
    );
  }

  assignTechnician(): void {
    if (!this.complaint) return;
    if (!this.selectedTechnicianId) {
      alert('Please select a technician.');
      return;
    }

    this.isAssigning = true;
    this.complaintService.assignComplaint(this.complaint._id, this.selectedTechnicianId).subscribe(
      (response: any) => {
        this.isAssigning = false;
        alert('Technician assigned successfully.');
        this.loadComplaint(this.complaint!._id);
      },
      (error: any) => {
        this.isAssigning = false;
        console.error('Error assigning technician', error);
        alert(error.error?.message || 'Failed to assign technician.');
      }
    );
  }

  updateStatus(): void {
    if (!this.complaint) return;
    if (!this.newStatus) {
      alert('Please select a status.');
      return;
    }

    this.isUpdatingStatus = true;
    this.complaintService.updateStatus(this.complaint._id, this.newStatus, this.statusNote).subscribe(
      (response: any) => {
        this.isUpdatingStatus = false;
        alert('Status updated successfully.');
        this.statusNote = '';
        this.loadComplaint(this.complaint!._id);
      },
      (error: any) => {
        this.isUpdatingStatus = false;
        console.error('Error updating status', error);
        alert(error.error?.message || 'Failed to update status.');
      }
    );
  }

  goBack(): void {
    if (this.user && this.user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/warden/dashboard']);
    }
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
