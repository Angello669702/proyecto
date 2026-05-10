import { Routes } from '@angular/router';

export const ACTION_LOGS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/action-logs/action-logs.page.component').then(
            (c) => c.ActionLogsPageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
