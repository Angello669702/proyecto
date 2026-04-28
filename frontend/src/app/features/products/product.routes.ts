import { Routes } from '@angular/router';
import { productResolver } from './guards/product.resolver';

export enum PRODUCTS_PAGES {
  PRODUCT = '/products',
  HOME = 'home',
  NEW = 'new',
  UPDATE = 'update',
}

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PRODUCTS_PAGES.HOME,
      },
      {
        path: PRODUCTS_PAGES.HOME,
        loadComponent: () =>
          import('./pages/home/home.page.component').then((c) => c.HomePageComponent),
      },

      {
        path: ':id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail.page.component').then(
            (c) => c.ProdcutDetailPageComponent,
          ),
        resolve: { product: productResolver },
      },
    ],
  },
  { path: '**', redirectTo: PRODUCTS_PAGES.HOME },
];
