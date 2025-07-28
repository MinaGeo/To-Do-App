import { Routes } from '@angular/router';
import { Layout } from './layouts/layout/layout';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { TodoCreate } from './pages/create-todo/create-todo';
import { EditTodoPage } from './pages/edit-todo/edit-todo';
import { ProfilePage } from './pages/profile/profile';
import { LoggedInGuard } from './core/guards/loggedIn/loggedIn.guard';
import { AdminPage } from './pages/admin/admin';
import { UnauthorizedPage } from './pages/unauthorized-page/unauthorized-page';
import { RedirectGuard } from './core/guards/redirect/redirect.guard';
import { roleGuard } from './core/guards/role/role.guard';
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
        canActivate: [RedirectGuard],
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login').then(
            (m: { Login: typeof Login }) => m.Login,
          ),
        canActivate: [RedirectGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register').then(
            (m: { Register: typeof Register }) => m.Register,
          ),
        canActivate: [RedirectGuard],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(
            (m: { Dashboard: typeof Dashboard }) => m.Dashboard,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'todos/new',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/create-todo/create-todo').then(
            (m: { TodoCreate: typeof TodoCreate }) => m.TodoCreate,
          ),
      },
      {
        path: 'todos/:id/edit',
        loadComponent: () =>
          import('./pages/edit-todo/edit-todo').then(
            (m: { EditTodoPage: typeof EditTodoPage }) => m.EditTodoPage,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then(
            (m: { ProfilePage: typeof ProfilePage }) => m.ProfilePage,
          ),
        canActivate: [LoggedInGuard],
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/admin/admin').then(
            (m: { AdminPage: typeof AdminPage }) => m.AdminPage,
          ),
        canActivate: [AuthGuard, roleGuard],
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./pages/unauthorized-page/unauthorized-page').then(
            (m: { UnauthorizedPage: typeof UnauthorizedPage }) =>
              m.UnauthorizedPage,
          ),
      },
    ],
  },
];
