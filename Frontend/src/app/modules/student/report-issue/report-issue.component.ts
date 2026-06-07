import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintService } from '@app/core/services/complaint.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.css']
})
export class ReportIssueComponent implements OnInit {
  title = '';
  description = '';
  category = 'plumbing';
  urgency = 'medium';
  block = '';
  roomNumber = '';
  selectedImages: { file: File, base64: string }[] = [];
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  user: any = null;

  categories = ['plumbing', 'electrical', 'structural', 'cleaning', 'furniture', 'other'];
  urgencies = ['low', 'medium', 'high', 'emergency'];

  constructor(
    private complaintService: ComplaintService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user?.studentDetails) {
      this.block = this.user.studentDetails.block || '';
      this.roomNumber = this.user.studentDetails.roomNumber || '';
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.selectedImages.length >= 5) {
          this.errorMessage = 'You can upload up to 5 images';
          break;
        }

        // Validate image size (e.g. 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Image size should be less than 5MB';
          continue;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push({
            file: file,
            base64: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  submitComplaint(): void {
    if (!this.title || !this.description || !this.block || !this.roomNumber) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const complaintData = {
      title: this.title,
      description: this.description,
      category: this.category,
      urgency: this.urgency,
      location: {
        block: this.block,
        roomNumber: this.roomNumber
      },
      images: this.selectedImages.map(img => img.base64)
    };

    this.complaintService.createComplaint(complaintData).subscribe(
      (response: any) => {
        this.isSubmitting = false;
        this.successMessage = 'Complaint submitted successfully!';
        setTimeout(() => {
          this.router.navigate(['/student/dashboard']);
        }, 2000);
      },
      (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Error submitting complaint';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/student/dashboard']);
  }
}
