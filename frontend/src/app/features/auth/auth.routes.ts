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
        path: '',
        pathMatch: 'full',
        redirectTo: AUTH_PAGES.LOGIN,
      },
    ],
  },
  { path: '**', redirectTo: AUTH_PAGES.LOGIN },
];
