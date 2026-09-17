import { TestBed } from '@angular/core/testing';
import { Bill } from './bill';

describe('Bill', () => {
  let service: Bill;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bill);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
