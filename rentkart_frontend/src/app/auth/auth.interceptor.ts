import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // ❌ Skip auth APIs
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  // ❌ Skip public APIs
  if (req.url.includes('/api/products')) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
