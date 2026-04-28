import { Routes } from '@angular/router';
import { productResolver } from './guards/product.resolver';

export enum PRODUCTS_PAGES {
  HERO = '/hero',
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
        loadComponent: () =>
          import('./pages/product-detail/product-detail.page.component').then(
            (c) => c.ProdcutDeatilPageComponent,
          ),
        resolve: { product: productResolver },
      },
    ],
  },
  { path: '**', redirectTo: PRODUCTS_PAGES.HOME },
];
