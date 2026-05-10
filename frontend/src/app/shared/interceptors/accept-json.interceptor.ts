import { HttpInterceptorFn } from '@angular/common/http';

export const acceptJsonInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    headers: req.headers.set('Accept', 'application/json'),
  });
  return next(cloned);
};
