import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Synchronous check: MUST match the check in app.component.ts
  const isAuthenticated = localStorage.getItem('auth_token') !== null;

  if (isAuthenticated) {
    return true;
  }

  // Return UrlTree to prevent route activation and redirect immediately
  return router.createUrlTree(['/login']);
};