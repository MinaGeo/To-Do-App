import { inject, Injectable, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthApiService } from '../core/api/auth/auth.service';
import {
  LoginRequest,
  RegisterRequest,
  AuthenticationResponse,
} from '../core/api/auth/auth.model';
import { authData } from '../core/state-management/auth.state';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private api: AuthApiService = inject(AuthApiService);

  login(data: LoginRequest): Observable<AuthenticationResponse> {
    return this.api.login(data).pipe(
      tap((res: AuthenticationResponse) => {
        authData.set(res);
        localStorage.setItem('token', res.access_token);
      }),
    );
  }

  register(data: RegisterRequest): Observable<AuthenticationResponse> {
    return this.api.register(data).pipe(
      tap((res: AuthenticationResponse) => {
        authData.set(res);
        localStorage.setItem('token', res.access_token);
      }),
    );
  }

  isAuthenticated(): ReturnType<typeof computed<boolean>> {
    return computed(() => !!authData()?.access_token);
  }

  getCurrentUser(): ReturnType<
    typeof computed<AuthenticationResponse['user'] | null>
  > {
    return computed(() => authData()?.user ?? null);
  }
}
