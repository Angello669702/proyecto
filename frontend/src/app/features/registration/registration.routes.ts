import { Routes } from '@angular/router';
import { unloggedGuard } from '../auth/guards/unlogged.guard';

export enum REGISTRATION_PAGES {
  REGISTRATIONS = '/registrations',
  REGISTER = 'register',
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
        path: REGISTRATION_PAGES.REGISTRATIONS,
        loadComponent: () =>
          import('./pages/registration/registration.page.component').then(
            (c) => c.RegistrationPageComponent,
          ),
        canActivate: [unloggedGuard],
      },
    ],
  },
  { path: '**', redirectTo: REGISTRATION_PAGES.REGISTRATIONS },
];
