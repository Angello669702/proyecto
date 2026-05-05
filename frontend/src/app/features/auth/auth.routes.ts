import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export enum AUTH_PAGES {
  LOGIN = 'login',
  PROFILE = 'profile',
}

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: AUTH_PAGES.LOGIN,
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/login/login.page.component').then((c) => c.LoginPageComponent),
      },
      {
        path: AUTH_PAGES.PROFILE,
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/profile/profile.page.component').then((c) => c.ProfilePageComponent),
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', redirectTo: AUTH_PAGES.LOGIN },
];
