import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),          // Router — required for router-outlet to work
    provideHttpClient(withFetch())  // HTTP client with modern fetch transport (required for API calls)
  ]
};