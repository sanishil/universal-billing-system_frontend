import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { billDetailResolver } from './bill-detail-resolver';

describe('billDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => billDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
