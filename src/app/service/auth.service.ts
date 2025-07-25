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
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private api: AuthApiService = inject(AuthApiService);
  private readonly toast: ToastService = inject(ToastService);

  login(data: LoginRequest): void {
    setAuthLoading(true);
    setAuthError(null);

    this.api.login(data).subscribe({
      next: (res: AuthenticationResponse) => {
        setAuthData(res);
        localStorage.setItem('token', res.access_token);
        this.toast.show('Login successful!', 'success');
      },
      error: () => {
        setAuthError('Invalid username or password');
        this.toast.show('Login failed. Please try again.', 'error');
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
        this.toast.show('Registration successful!', 'success');
      },
      error: () => {
        setAuthError('Registration failed. Try again.');
        this.toast.show('Registration failed. Try again.', 'error');
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
    this.toast.show('Logout successful!', 'success');
    setAuthData(null);
  }
}
