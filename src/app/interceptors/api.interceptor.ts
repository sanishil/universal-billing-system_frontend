import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches Authorization token on every outgoing API request.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://localhost:8080/api')) {
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
