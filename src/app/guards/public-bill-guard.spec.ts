import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { publicBillGuard } from './public-bill-guard';

describe('publicBillGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => publicBillGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
