import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';

const PublicPageLoader = () =>
    import('./public.page').then((c) => c.PublicPage);

export const publicRoutes: Routes = [
    {
        path: '',
        loadComponent: PublicPageLoader,
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
        ],
    },
];