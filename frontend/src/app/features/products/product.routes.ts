import { Routes } from '@angular/router';
import { productResolver } from './guards/product.resolver';
import { authGuard } from '../auth/guards/auth.guard';
import { adminGuard } from '../auth/guards/admin.guard';

export enum PRODUCT_PAGES {
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
        path: PRODUCT_PAGES.NEW,
        loadComponent: () =>
          import('./pages/new-product/new-product.page.component').then(
            (c) => c.NewProductPageComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      {
        path: `${PRODUCT_PAGES.UPDATE}/:id`,
        loadComponent: () =>
          import('./pages/update-product/update-product.page.component').then(
            (c) => c.UpdateProductPageComponent,
          ),
        resolve: { product: productResolver },
        canActivate: [authGuard, adminGuard],
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
