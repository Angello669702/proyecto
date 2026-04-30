import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token.service';

export function tokenInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const tokenStorageService = inject(TokenStorageService);

  if (tokenStorageService.token()) {
    request = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${tokenStorageService.token()}`),
    });
  }
  return next(request);
}
