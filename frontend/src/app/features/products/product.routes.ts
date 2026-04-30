import { Routes } from '@angular/router';
import { productResolver } from './guards/product.resolver';

export enum PRODUCT_PAGES {
  PRODUCTS = '/products',
  CATALOG = 'catalog',
  NEW = 'new',
  UPDATE = 'update',
}

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PRODUCT_PAGES.CATALOG,
      },
      {
        path: PRODUCT_PAGES.CATALOG,
        loadComponent: () =>
          import('./pages/catalog/catalog.page.component').then((c) => c.CatalogPageComponent),
      },

      {
        path: ':id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail.page.component').then(
            (c) => c.ProductDetailPageComponent,
          ),
        resolve: { product: productResolver },
      },
    ],
  },
  { path: '**', redirectTo: PRODUCT_PAGES.CATALOG },
];
