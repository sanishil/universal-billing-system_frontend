import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BillService } from './bill.service';

describe('BillService', () => {
  let service: BillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(BillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
