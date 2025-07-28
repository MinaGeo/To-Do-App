import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  LoginRequest,
  RegisterRequest,
  AuthenticationResponse,
  UserRole,
} from '../../core/api/auth/auth.model';
import { of, throwError } from 'rxjs';
import { AuthFacade } from './auth.service';
import { AuthApiService } from '../../core/api/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

describe('AuthFacade', () => {
  let service: AuthFacade;
  let mockAuthApi: jasmine.SpyObj<AuthApiService>;
  let mockToast: jasmine.SpyObj<ToastrService>;
  let mockLocalStorage: jasmine.SpyObj<Storage>;

  const mockAuthResponse: AuthenticationResponse = {
    access_token: 'mock-token',
    user: {
      id: '1',
      username: 'testuser',
      email: 'test@test.com',
      role: UserRole.User,
    },
  };

  beforeEach(() => {
    const authApiSpy = jasmine.createSpyObj('AuthApiService', [
      'login',
      'register',
    ]);
    const toastSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    mockLocalStorage = jasmine.createSpyObj('Storage', [
      'getItem',
      'setItem',
      'removeItem',
    ]);
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthApiService, useValue: authApiSpy },
        { provide: ToastrService, useValue: toastSpy },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(AuthFacade);
    mockAuthApi = TestBed.inject(
      AuthApiService,
    ) as jasmine.SpyObj<AuthApiService>;
    mockToast = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const loginData: LoginRequest = { username: 'test', password: 'password' };

    it('should call login API and handle success', () => {
      mockAuthApi.login.and.returnValue(of(mockAuthResponse));

      service.login(loginData);

      expect(mockAuthApi.login).toHaveBeenCalledWith(loginData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'token',
        'mock-token',
      );
      expect(mockToast.success).toHaveBeenCalledWith('Login successful!');
    });

    it('should handle login error', () => {
      mockAuthApi.login.and.returnValue(
        throwError(() => new Error('Login failed')),
      );

      service.login(loginData);

      expect(mockAuthApi.login).toHaveBeenCalledWith(loginData);
      expect(mockToast.error).toHaveBeenCalledWith(
        'Login failed. Please try again.',
      );
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerData: RegisterRequest = {
      username: 'test',
      password: 'password',
      email: 'test@test.com',
    };

    it('should call register API and handle success', () => {
      mockAuthApi.register.and.returnValue(of(mockAuthResponse));

      service.register(registerData);

      expect(mockAuthApi.register).toHaveBeenCalledWith(registerData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'token',
        'mock-token',
      );
      expect(mockToast.success).toHaveBeenCalledWith(
        'Registration successful!',
      );
    });

    it('should handle registration error', () => {
      mockAuthApi.register.and.returnValue(
        throwError(() => new Error('Registration failed')),
      );

      service.register(registerData);

      expect(mockAuthApi.register).toHaveBeenCalledWith(registerData);
      expect(mockToast.error).toHaveBeenCalledWith(
        'Registration failed. Try again.',
      );
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('computed properties', () => {
    it('should return a signal for isAuthenticated', () => {
      const result = service.isAuthenticated();
      expect(typeof result).toBe('function');
    });

    it('should return a signal for getCurrentUser', () => {
      const result = service.getCurrentUser();
      expect(typeof result).toBe('function');
    });

    it('should return a signal for getCurretUsername', () => {
      const result = service.getCurretUsername();
      expect(typeof result).toBe('function');
    });

    it('should return a signal for getError', () => {
      const result = service.getError();
      expect(typeof result).toBe('function');
    });

    it('should return a signal for isLoading', () => {
      const result = service.isLoading();
      expect(typeof result).toBe('function');
    });
  });

  describe('logout', () => {
    it('should clear token and show success message', () => {
      service.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockToast.success).toHaveBeenCalledWith('Logout successful!');
    });
  });

  describe('setError', () => {
    it('should accept error message without throwing', () => {
      expect(() => service.setError('Test error')).not.toThrow();
    });
  });
});
