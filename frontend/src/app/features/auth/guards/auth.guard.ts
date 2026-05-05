import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AUTH_PAGES } from '../auth.routes';
import { TokenStorageService } from '../services/token.service';
import { FEATURE_PAGES } from '../../../app.routes';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const service = inject(TokenStorageService);

  return service.isLogged() ?? router.navigate(['/', 'auth', AUTH_PAGES.LOGIN]);
};
