import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token.service';

export const unloggedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const service = inject(TokenStorageService);
  return service.isLogged() ? router.navigate(['/home']) : !service.isLogged();
};
