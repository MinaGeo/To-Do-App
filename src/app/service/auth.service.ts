import { inject, Injectable, computed, Signal } from '@angular/core';
import { AuthApiService } from '../core/api/auth/auth.service';
import {
  LoginRequest,
  RegisterRequest,
  AuthenticationResponse,
  User,
} from '../core/api/auth/auth.model';
import {
  authData,
  authLoading,
  authError,
  setAuthLoading,
  setAuthError,
  setAuthData,
} from '../core/state-management/auth.state';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private api: AuthApiService = inject(AuthApiService);

  login(data: LoginRequest): void {
    setAuthLoading(true);
    setAuthError(null);

    this.api.login(data).subscribe({
      next: (res: AuthenticationResponse) => {
        setAuthData(res);
        localStorage.setItem('token', res.access_token);
      },
      error: () => {
        setAuthError('Invalid username or password');
      },
      complete: () => {
        setAuthLoading(false);
      },
    });
  }

  register(data: RegisterRequest): void {
    setAuthLoading(true);
    setAuthError(null);

    this.api.register(data).subscribe({
      next: (res: AuthenticationResponse) => {
        setAuthData(res);
        localStorage.setItem('token', res.access_token);
      },
      error: () => {
        setAuthError('Registration failed. Try again.');
      },
      complete: () => {
        setAuthLoading(false);
      },
    });
  }

  isAuthenticated(): Signal<boolean> {
    return computed(() => !!authData()?.access_token);
  }

  getCurrentUser(): Signal<User | null> {
    return computed(() => authData()?.user ?? null);
  }

  getError(): typeof authError {
    return authError;
  }
  setError(message: string): void {
    setAuthError(message);
  }

  isLoading(): typeof authLoading {
    return authLoading;
  }
}
