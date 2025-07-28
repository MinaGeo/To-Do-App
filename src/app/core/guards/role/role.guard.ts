import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { User, UserRole } from '../../api/auth/auth.model';
import { user } from '../../state-management/user.state';

export const roleGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const currentUser: User | null = user();

  if (currentUser?.role === UserRole.Admin) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
