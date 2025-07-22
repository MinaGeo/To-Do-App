import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginRequest,
  AuthenticationResponse,
  RegisterRequest,
} from './auth.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${environment.apiUrl}/auth/login`,
      data,
    );
  }

  register(data: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${environment.apiUrl}/auth/register`,
      data,
    );
  }
}
