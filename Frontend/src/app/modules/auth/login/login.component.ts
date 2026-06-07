import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  email = '';
  password = '';
  role = 'student';
  isLoading = false;
  errorMessage = '';
  showPassword = false;  // ← ADD THIS

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}
   
  togglePassword(): void {  // ← ADD THIS METHOD
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password, this.role).subscribe(
      (response: any) => {
        this.isLoading = false;
        // Store user
        this.authService.setCurrentUser(response.user);
        
        // Redirect based on role
        if (response.user.role === 'student') {
  this.router.navigate(['/student/dashboard']);
} else if (response.user.role === 'warden') {
  this.router.navigate(['/warden/dashboard']);
} else if (response.user.role === 'technician') {
  this.router.navigate(['/technician/dashboard']); // ← ADD THIS
} else if (response.user.role === 'admin') {
  this.router.navigate(['/admin/dashboard']);
} else {
  this.router.navigate(['/']);
}

      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    );
  }

  // Demo logins
  demoLogin(email: string, password: string, role: string): void {
    this.email = email;
    this.password = password;
    this.role = role;
    setTimeout(() => this.login(), 100);
  }
}
