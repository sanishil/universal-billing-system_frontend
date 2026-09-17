import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { BillService } from '../services/bill.service';
import { Bill } from '../models/bill';

export const billDetailResolver: ResolveFn<Bill | null> = (route, _state) => {
  const billService = inject(BillService);
  const id = route.paramMap.get('id');

  if (!id) return null;

  return billService.getBills().pipe(
    map(bills => bills.find(b => b.id === id) || null)
  );
};