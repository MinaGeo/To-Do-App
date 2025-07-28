import { CanActivateFn, Router } from '@angular/router';
import { inject, Signal } from '@angular/core';
import { AuthFacade } from '../../../service/auth/auth.service';

export const LoggedInGuard: CanActivateFn = () => {
  const authService: AuthFacade = inject(AuthFacade);
  const router: Router = inject(Router);

  const isLoggedInSignal: Signal<boolean> = authService.isAuthenticated();

  if (!isLoggedInSignal()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
