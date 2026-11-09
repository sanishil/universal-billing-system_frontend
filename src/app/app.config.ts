import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { routes } from './app.routes';
import { apiInterceptor } from './interceptors/api.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // The components update plain fields from HTTP, timers and third-party callbacks (reCAPTCHA);
    // zone.js re-renders after each of them
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.recaptchaSiteKey } as RecaptchaSettings
    }
  ]
};
