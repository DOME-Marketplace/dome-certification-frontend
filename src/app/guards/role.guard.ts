import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '@services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const routerService = inject(Router);
  const authService = inject(AuthService);

  const allowedRoles = route.data['roles'] as string[];

  if (
    !authService.isAuthenticated() ||
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => authService.hasRole(role))
  ) {
    return true;
  }
  routerService.navigate(['/unauthorized']);
  return false;
};
