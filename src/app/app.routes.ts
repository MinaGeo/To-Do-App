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
        component: Landing,
        canActivate: [AuthGuard],
      },
    ],
  },
];
