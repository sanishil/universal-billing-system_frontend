import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches the auth token from sessionStorage on every outgoing API request.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept requests going to our local API
  if (!req.url.startsWith('http://localhost:8080/api')) {
    return next(req);
  }

  const token = sessionStorage.getItem('ubs_token');

  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloned);
};
