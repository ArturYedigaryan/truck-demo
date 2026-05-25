import { Routes } from '@angular/router';

const PrivatePageLoader = () => import('./private.page').then((c) => c.PrivatePage);

const DashboardPageLoader = () =>
  import('./pages/dashboard/dashboard.page').then((c) => c.DashboardPage);

export const privateRoutes: Routes = [
  {
    path: '',
    loadComponent: PrivatePageLoader,
    children: [{ path: '', loadComponent: DashboardPageLoader }],
  },
];
