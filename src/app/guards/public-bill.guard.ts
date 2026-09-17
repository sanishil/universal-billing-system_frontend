import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicBillGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);
  const uniqueId = route.paramMap.get('uniqueId');

  if (uniqueId && uniqueId.trim().length > 0) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
