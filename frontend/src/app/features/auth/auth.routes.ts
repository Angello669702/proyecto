import { Routes } from '@angular/router';

export enum AUTH_PAGES {
  AUTH = 'auth',
  LOGIN = 'login',
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
    ],
  },
  { path: '**', redirectTo: AUTH_PAGES.LOGIN },
];
