import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { CustomerCreateComponent } from './customer-create';

describe('CustomerCreateComponent', () => {
  let component: CustomerCreateComponent;
  let fixture: ComponentFixture<CustomerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerCreateComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: 'test-site-key' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
