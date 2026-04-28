import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export enum FEATURES_PAGES {
  PRODUCTS = 'products',
  AUTH = 'auth',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: FEATURES_PAGES.PRODUCTS,
      },
      {
        path: FEATURES_PAGES.PRODUCTS,
        loadChildren: () =>
          import('./features/products/product.routes').then((r) => r.PRODUCTS_ROUTES),
        canActivate: [authGuard],
      },
      {
        path: FEATURES_PAGES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
      },
    ],
  },

  { path: '**', redirectTo: FEATURES_PAGES.AUTH },
];
