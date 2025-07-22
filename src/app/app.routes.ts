import { Routes } from '@angular/router';
import { Layout } from './layouts/layout/layout';
import { AuthGuard } from './core/guards/auth.guard';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing').then(
            (m: { Landing: typeof Landing }) => m.Landing,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
    ],
  },
];
