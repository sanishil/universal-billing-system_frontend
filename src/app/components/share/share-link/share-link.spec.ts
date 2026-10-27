import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { ShareLinkComponent } from './share-link';

describe('ShareLinkComponent', () => {
  let component: ShareLinkComponent;
  let fixture: ComponentFixture<ShareLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareLinkComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: 'test-site-key' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareLinkComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
