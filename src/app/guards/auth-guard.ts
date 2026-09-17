import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);

  // Synchronous check: checks if either token exists
  const isAuthenticated =
    typeof window !== 'undefined' &&
    (localStorage.getItem('auth_token') !== null ||
      localStorage.getItem('ubs_auth_token') !== null);

  if (isAuthenticated) {
    return true;
  }

  // Return UrlTree to prevent route activation and redirect immediately
  return router.createUrlTree(['/login']);
};