import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Bounce already logged-in users straight to the dashboard
    return router.createUrlTree(['/dashboard']);
  }

  // Let unauthenticated users see the login/register page
  return true;
};