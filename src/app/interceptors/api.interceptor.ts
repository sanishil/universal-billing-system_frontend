import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../services/api.config';

/**
 * Attaches Authorization JWT token on every outgoing API request.
 * Guards only requests that target our own backend (API_BASE_URL).
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  const token = sessionStorage.getItem('ubs_token');
  if (!token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
