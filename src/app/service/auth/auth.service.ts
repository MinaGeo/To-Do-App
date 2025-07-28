import { inject, Injectable, computed, Signal } from '@angular/core';
import { AuthApiService } from '../../core/api/auth/auth.service';
import {
  LoginRequest,
  RegisterRequest,
  AuthenticationResponse,
  User,
} from '../../core/api/auth/auth.model';
import {
  authData,
  authLoading,
  authError,
  setAuthLoading,
  setAuthError,
  setAuthData,
} from '../../core/state-management/auth.state';
import { ToastrService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private api: AuthApiService = inject(AuthApiService);
  private readonly toast: ToastrService = inject(ToastrService);

  login(data: LoginRequest): void {
    setAuthLoading(true);
    setAuthError(null);

    this.api.login(data).subscribe({
      next: (res: AuthenticationResponse) => {
        setAuthData(res);
        localStorage.setItem('token', res.access_token);
        this.toast.success('Login successful!');
      },
      error: () => {
        setAuthError('Invalid username or password');
        this.toast.error('Login failed. Please try again.');
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
        this.toast.success('Registration successful!');
      },
      error: () => {
        setAuthError('Registration failed. Try again.');
        this.toast.error('Registration failed. Try again.');
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

  getCurretUsername(): Signal<string> {
    return computed(() => authData()?.user?.username ?? '');
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

  logout(): void {
    localStorage.removeItem('token');
    this.toast.success('Logout successful!');
    setAuthData(null);
  }
}
