import { Routes } from '@angular/router';

export enum TRANSACTION_PAGES {
  CART = 'cart',
  ORDERS = 'orders',
}

export const TRANSACTION_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: TRANSACTION_PAGES.CART,
      },
      {
        path: TRANSACTION_PAGES.CART,
        loadComponent: () =>
          import('./pages/cart/cart.page.component').then((c) => c.CartPageComponent),
      },
      {
        path: TRANSACTION_PAGES.ORDERS,
        loadComponent: () =>
          import('./pages/orders/orders.page.component').then((c) => c.OrdersPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: TRANSACTION_PAGES.CART },
];
