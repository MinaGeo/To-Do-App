import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../../service/auth.service';
import { inject } from '@angular/core';

export const LoggedInGuard: CanActivateFn = () => {
  const authService: AuthFacade = inject(AuthFacade);
  const router: Router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
