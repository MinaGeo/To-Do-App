import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  signal,
  WritableSignal,
} from '@angular/core';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { LoginRequest } from '../../core/api/auth/auth.model';
import { AuthFacade } from '../../service/auth/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthFacade: jasmine.SpyObj<AuthFacade>;

  let errorSignal: WritableSignal<string | null>;
  let loadingSignal: WritableSignal<boolean>;
  let isAuthenticatedSignal: WritableSignal<boolean>;

  beforeEach(async () => {
    errorSignal = signal<string | null>(null);
    loadingSignal = signal(false);
    isAuthenticatedSignal = signal(false);

    mockAuthFacade = jasmine.createSpyObj<AuthFacade>('AuthFacade', [
      'login',
      'getError',
      'isLoading',
      'isAuthenticated',
    ]);

    mockAuthFacade.getError.and.returnValue(errorSignal);
    mockAuthFacade.isLoading.and.returnValue(loadingSignal);
    mockAuthFacade.isAuthenticated.and.returnValue(isAuthenticatedSignal);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthFacade, useValue: mockAuthFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login if form is invalid', () => {
    component.form.setValue({ username: '', password: '' });

    component.onSubmit();

    expect(mockAuthFacade.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on success', () => {
    component.form.setValue({ username: 'mina', password: 'Password123' });

    const mockResponse = {
      access_token: 'fake-token',
      user: { id: '123', username: 'test' },
    };

    mockAuthFacade.login.and.callFake(() => {
      errorSignal.set('');
    });

    component.onSubmit();

    const expectedRequest: LoginRequest = {
      username: 'mina',
      password: 'Password123',
    };

    expect(mockAuthFacade.login).toHaveBeenCalledWith(expectedRequest);
    expect(component.error()).toBe('');
  });

  it('should set error message on login failure', () => {
    component.form.setValue({ username: 'wronguser', password: 'wrongpass' });

    mockAuthFacade.login.and.callFake(() => {
      errorSignal.set('Invalid username or password');
    });

    component.onSubmit();

    expect(component.error()).toBe('Invalid username or password');
  });
});
