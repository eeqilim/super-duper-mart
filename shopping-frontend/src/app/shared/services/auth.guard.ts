import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/auth']);
    }

    const roles = route.data['roles'] as string[] | undefined;
    const userRole = this.auth.getCurrentUser()?.role;

    if (roles?.length && (!userRole || !roles.includes(userRole))) {
      return this.router.createUrlTree([
        userRole === 'ROLE_ADMIN' ? '/admin/home' : '/products'
      ]);
    }

    return true;
  }
}
