import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Synchronous check: MUST match the check in app.component.ts
  const isAuthenticated = localStorage.getItem('auth_token') !== null;

  if (isAuthenticated) {
    // Bounce already logged-in users straight to the dashboard
    return router.createUrlTree(['/dashboard']);
  }

  // Let unauthenticated users see the login/register page
  return true;
};