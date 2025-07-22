import { Routes } from '@angular/router';
import { Layout } from './layouts/layout/layout';
import { redirectAuthenticatedGuard } from './core/guards/auth.guard';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Landing,
        canActivate: [redirectAuthenticatedGuard],
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
    ],
  },
];
