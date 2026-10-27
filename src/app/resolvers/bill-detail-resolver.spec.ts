import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { billDetailResolver } from './bill-detail-resolver';
import { Bill } from '../models/bill';

describe('billDetailResolver', () => {
  const executeResolver: ResolveFn<Bill | null> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => billDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
