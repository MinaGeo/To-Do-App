// src/app/guards/redirect-if-auth.guard.ts
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const redirectIfAuthGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
