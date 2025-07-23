import { Routes } from '@angular/router';
import { Layout } from './layouts/layout/layout';
import { AuthGuard } from './core/guards/auth.guard';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { TodoCreate } from './pages/create-todo/create-todo';
import { EditTodoPage } from './pages/edit-todo/edit-todo';

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
      {
        path: 'todos/new',
        // canActivate: [AuthGuard],
        component: TodoCreate,
      },
      {
        path: 'todos/:id/edit',
        loadComponent: () =>
          import('./pages/edit-todo/edit-todo').then(
            (m: { EditTodoPage: typeof EditTodoPage }) => m.EditTodoPage,
          ),
        // canActivate: [AuthGuard],
      },
    ],
  },
];
