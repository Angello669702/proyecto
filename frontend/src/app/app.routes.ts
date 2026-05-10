import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { adminGuard } from './features/auth/guards/admin.guard';

export enum FEATURE_PAGES {
  PRODUCTS = 'products',
  AUTH = 'auth',
  TRANSACTIONS = 'transactions',
  REGISTRATIONS = 'registrations',
  CATEGORIES = 'categories',
  ACTION_LOGS = 'action-logs',
  PRICE_GROUPS = 'price-groups',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
      },
      {
        path: FEATURE_PAGES.PRICE_GROUPS,
        loadChildren: () =>
          import('./features/price-groups/price-groups.routes').then((r) => r.PRICE_GROUPS_ROUTES),
        canActivate: [adminGuard],
      },
      {
        path: FEATURE_PAGES.ACTION_LOGS,
        loadChildren: () =>
          import('./features/action-logs/action-log.routes').then((r) => r.ACTION_LOGS_ROUTES),
        canActivate: [adminGuard],
      },
      {
        path: FEATURE_PAGES.PRODUCTS,
        loadChildren: () =>
          import('./features/products/product.routes').then((r) => r.PRODUCT_ROUTES),
      },
      {
        path: FEATURE_PAGES.CATEGORIES,
        loadChildren: () =>
          import('./features/categories/categories.routes').then((r) => r.CATEGORIES_ROUTES),
      },
      {
        path: FEATURE_PAGES.TRANSACTIONS,
        loadChildren: () =>
          import('./features/transactions/transactions.routes').then((r) => r.TRANSACTION_ROUTES),
        canActivate: [authGuard],
      },
      {
        path: FEATURE_PAGES.REGISTRATIONS,
        loadChildren: () =>
          import('./features/registration/registration.routes').then((r) => r.REGISTRATION_ROUTES),
      },
      {
        path: FEATURE_PAGES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./shared/pages/home.page.component').then((r) => r.HomePageComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
