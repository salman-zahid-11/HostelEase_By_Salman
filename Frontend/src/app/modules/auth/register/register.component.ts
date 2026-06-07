import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  // User selected role: 'student', 'teacher', 'officer', 'staff'
  userRole = 'student';
  step = 1;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Form fields
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  phoneNumber = '';
  department = '';

  // Student specific
  studentId = '';
  block = '';
  roomNumber = '';

  // Warden (Teacher / Officer) specific
  employeeId = '';
  officeDepartment = '';

  // Staff (Technician) specific
  specialization = 'plumbing';

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  register(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Map UI role to database role
    let dbRole = 'student';
    if (this.userRole === 'teacher' || this.userRole === 'officer') {
      dbRole = 'warden';
    } else if (this.userRole === 'staff') {
      dbRole = 'technician';
    }

    const userData: any = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      department: this.department,
      role: dbRole,
    };

    if (dbRole === 'student') {
      userData.studentDetails = {
        studentId: this.studentId,
        block: this.block,
        roomNumber: this.roomNumber,
      };
    } else if (dbRole === 'warden') {
      userData.wardenDetails = {
        employeeId: this.employeeId,
        officeDepartment: this.officeDepartment,
        hostelAssignment: 'none'
      };
    } else if (dbRole === 'technician') {
      userData.technicianDetails = {
        specialization: this.specialization,
        isAvailable: true
      };
      // Keep employeeId in wardenDetails or just as custom field
      userData.wardenDetails = {
        employeeId: this.employeeId,
        officeDepartment: 'Maintenance Office',
        hostelAssignment: 'none'
      };
    }

    this.authService.register(userData).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || error.error?.message || 'Registration failed';
      }
    );
  }

  validateForm(): boolean {
    if (!this.fullName || !this.email || !this.password || !this.phoneNumber || !this.department) {
      this.errorMessage = 'Please fill all required fields';
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.userRole === 'student' && (!this.studentId || !this.block || !this.roomNumber)) {
      this.errorMessage = 'Please fill all student details';
      return false;
    }

    if ((this.userRole === 'teacher' || this.userRole === 'officer') && (!this.employeeId || !this.officeDepartment)) {
      this.errorMessage = 'Please fill all employee details';
      return false;
    }

    if (this.userRole === 'staff' && !this.employeeId) {
      this.errorMessage = 'Please fill employee details';
      return false;
    }

    return true;
  }

  nextStep(): void {
    if (this.step === 1) {
      if (!this.fullName || !this.email) {
        this.errorMessage = 'Please fill required fields';
        return;
      }
    }
    this.step++;
    this.errorMessage = '';
  }

  previousStep(): void {
    this.step--;
    this.errorMessage = '';
  }
}
