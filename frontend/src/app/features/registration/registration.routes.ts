import { Routes } from '@angular/router';
import { unloggedGuard } from '../auth/guards/unlogged.guard';
import { adminGuard } from '../auth/guards/admin.guard';

export enum REGISTRATION_PAGES {
  REGISTER = 'register',
  ALL = 'all',
}

export const REGISTRATION_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: REGISTRATION_PAGES.REGISTER,
      },
      {
        path: REGISTRATION_PAGES.REGISTER,
        loadComponent: () =>
          import('./pages/register/register.page.component').then((c) => c.RegisterPageComponent),
        canActivate: [unloggedGuard],
      },
      {
        path: REGISTRATION_PAGES.ALL,
        loadComponent: () =>
          import('./pages/registrations/registrations.page.component').then(
            (c) => c.RegistrationsPageComponent,
          ),
        canActivate: [adminGuard],
      },
    ],
  },
  { path: '**', redirectTo: REGISTRATION_PAGES.REGISTER },
];
