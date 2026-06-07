import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintService, Complaint } from '@app/core/services/complaint.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.css']
})
export class ComplaintDetailsComponent implements OnInit {
  complaint: Complaint | null = null;
  isLoading = true;
  isFeedbackOpen = false;
  rating = 0;
  comment = '';
  isSubmittingFeedback = false;
  user: any = null;

  constructor(
    private complaintService: ComplaintService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadComplaint(id);
    }
  }

  loadComplaint(id: string): void {
    this.isLoading = true;
    this.complaintService.getComplaint(id).subscribe(
      (response: any) => {
        if (response.success) {
          this.complaint = response.data;
        }
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading complaint', error);
        this.isLoading = false;
      }
    );
  }

  submitFeedback(): void {
    if (!this.complaint || this.rating === 0) {
      alert('Please select a rating');
      return;
    }

    this.isSubmittingFeedback = true;
    this.complaintService.addFeedback(this.complaint._id, this.rating, this.comment).subscribe(
      (response: any) => {
        this.isSubmittingFeedback = false;
        alert('Thank you for your feedback!');
        this.isFeedbackOpen = false;
        this.loadComplaint(this.complaint!._id);
      },
      (error: any) => {
        this.isSubmittingFeedback = false;
        alert('Error submitting feedback');
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/student/dashboard']);
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


  
}
