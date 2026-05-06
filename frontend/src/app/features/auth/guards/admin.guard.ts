import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const service = inject(AuthService);

  return service.isAdmin() ?? router.navigate(['/', 'home']);
};
