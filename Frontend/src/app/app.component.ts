import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  title = 'HostelEase';
  currentUser: any = null;
  currentRoute = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Monitor route changes to show/hide navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects || event.url || '';
      this.currentUser = this.authService.getCurrentUser();
    });

    this.currentUser = this.authService.getCurrentUser();
  }

  showNavbar(): boolean {
    return true; // Permanently show navbar on every page
  }

  isHomePage(): boolean {
    const route = this.currentRoute.split('?')[0];
    return route === '/' || route === '/home' || route === '';
  }

  navigateToDashboard(): void {
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const role = this.currentUser.role;
    if (role === 'student') {
      this.router.navigate(['/student/dashboard']);
    } else if (role === 'warden') {
      this.router.navigate(['/warden/dashboard']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  navigateToLogin(role: string): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.router.navigate(['/auth/login']);
  }
}
