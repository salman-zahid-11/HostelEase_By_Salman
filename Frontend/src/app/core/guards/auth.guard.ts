import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      const requiredRoles = route.data['roles'] as Array<string>;

      if (requiredRoles && requiredRoles.length > 0) {
        if (user && requiredRoles.includes(user.role)) {
          return true;
        }

        this.router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
