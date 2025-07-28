import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import {
  LoginRequest,
  RegisterRequest,
  AuthenticationResponse,
  User,
  UserRole,
} from './auth.model';
import { environment } from '../../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthApiService } from './auth.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and return authentication response', () => {
    const loginRequest: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const mockResponse: AuthenticationResponse = {
      access_token: 'mock-token',
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.User,
      },
    };

    service.login(loginRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);
    req.flush(mockResponse);
  });

  it('should register and return authentication response', () => {
    const registerRequest: RegisterRequest = {
      username: 'newuser',
      password: 'newpass123',
      email: 'new@example.com',
    };

    const mockResponse: AuthenticationResponse = {
      access_token: 'new-token',
      user: {
        id: '2',
        username: 'newuser',
        email: 'new@example.com',
        role: UserRole.User,
      },
    };

    service.register(registerRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerRequest);
    req.flush(mockResponse);
  });

  it('should fetch user profile', () => {
    const mockUser: User = {
      id: '3',
      username: 'profileUser',
      email: 'profile@example.com',
      role: UserRole.Admin,
    };

    service.getProfile().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrl}/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
