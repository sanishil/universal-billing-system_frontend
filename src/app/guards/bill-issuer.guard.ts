import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { isIssuer } from '../models/bill';
import { BillService } from '../services/bill.service';

/**
 * Only the issuer may open /bills/edit/:id; recipients are sent to the read-only view.
 * UX only — the backend enforces this on PUT /bills/:id.
 */
export const billIssuerGuard: CanActivateFn = (route, _state) => {
  const billService = inject(BillService);
  const router = inject(Router);
  const id = route.paramMap.get('id') ?? '';

  return billService.getBillById(id).pipe(
    map(bill => isIssuer(bill) ? true : router.createUrlTree(['/bills/view', id])),
    // Let the edit page show its own "not found" state
    catchError(() => of(true))
  );
};
