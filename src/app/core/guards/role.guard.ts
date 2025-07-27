import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { user } from '../state-management/user.state';
import { User } from '../api/auth/auth.model';
export const roleGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const currentUser: User | null = user();

  if (currentUser?.role === 'admin') return true;

  router.navigate(['/unauthorized']);
  return false;
};
