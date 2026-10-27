import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { PublicBillViewComponent } from './public-bill-view';

describe('PublicBillViewComponent', () => {
  let component: PublicBillViewComponent;
  let fixture: ComponentFixture<PublicBillViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBillViewComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: 'test-site-key' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicBillViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
