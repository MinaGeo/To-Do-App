import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../../service/auth.service';
export const AuthGuard: CanActivateFn = () => {
  const authService: AuthFacade = inject(AuthFacade);
  const router: Router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
