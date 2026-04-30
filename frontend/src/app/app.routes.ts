import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export enum FEATURE_PAGES {
  PRODUCTS = 'products',
  AUTH = 'auth',
  TRANSACTIONS = 'transactions',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: FEATURE_PAGES.PRODUCTS,
      },
      {
        path: FEATURE_PAGES.PRODUCTS,
        loadChildren: () =>
          import('./features/products/product.routes').then((r) => r.PRODUCT_ROUTES),
      },
      {
        path: FEATURE_PAGES.TRANSACTIONS,
        loadChildren: () =>
          import('./features/transactions/transactions.routes').then((r) => r.TRANSACTION_ROUTES),
        canActivate: [authGuard],
      },
      {
        path: FEATURE_PAGES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
      },
    ],
  },

  { path: '**', redirectTo: FEATURE_PAGES.AUTH },
];
