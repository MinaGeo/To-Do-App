import { Routes } from '@angular/router';
import { Layout } from './layouts/layout/layout';
import { AuthGuard } from './core/guards/auth.guard';
import { Landing } from './pages/landing/landing';

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
    ],
  },
];
