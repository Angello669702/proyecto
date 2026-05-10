import { Routes } from '@angular/router';

export enum PRICE_GROUPS_PAGES {
  NEW = 'new',
}

export const PRICE_GROUPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/price-groups/price-groups.page.component').then(
        (c) => c.PriceGroupsPageComponent,
      ),
  },
  {
    path: PRICE_GROUPS_PAGES.NEW,
    loadComponent: () =>
      import('./pages/new-price-group/new-price-group.page.component').then(
        (c) => c.NewPriceGroupPageComponent,
      ),
  },
];
