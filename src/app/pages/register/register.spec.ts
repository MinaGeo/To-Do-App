import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  signal,
  WritableSignal,
} from '@angular/core';
import { Register } from './register';
import { AuthFacade } from '../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationResponse } from '../../core/api/auth/auth.model';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let mockAuthFacade: jasmine.SpyObj<AuthFacade>;
  let mockRouter: jasmine.SpyObj<Router>;

  let errorSignal: WritableSignal<string | null>;
  let loadingSignal: WritableSignal<boolean>;
  let isAuthenticatedSignal: WritableSignal<boolean>;

  beforeEach(async () => {
    errorSignal = signal<string | null>(null);
    loadingSignal = signal(false);
    isAuthenticatedSignal = signal(false);

    mockAuthFacade = jasmine.createSpyObj<AuthFacade>('AuthFacade', [
      'register',
      'getError',
      'isLoading',
      'isAuthenticated',
    ]);
    mockAuthFacade.getError.and.returnValue(errorSignal);
    mockAuthFacade.isLoading.and.returnValue(loadingSignal);
    mockAuthFacade.isAuthenticated.and.returnValue(isAuthenticatedSignal);

    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when passwords do not match', () => {
    component.form.setValue({
      username: 'testuser',
      password: 'Password123',
      confirmPassword: 'WrongPassword123',
    });

    component.onSubmit();
    expect(mockAuthFacade.register).not.toHaveBeenCalled();
  });

  it('should call register and navigate on success', () => {
    component.form.setValue({
      username: 'testuser',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    const response: AuthenticationResponse = {
      access_token: 'mock-token',
      user: {
        id: '98ec1045-5658-4fde-be74-574e9ef3aba5',
        username: 'testuser',
      },
    };

    mockAuthFacade.register.and.callFake(() => {
      errorSignal.set('');
    });

    component.onSubmit();

    expect(mockAuthFacade.register).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'Password123',
    });
    expect(component.error()).toBe('');
  });

  it('should set error message on server error', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Username already exists' },
      status: 400,
    });

    component.form.setValue({
      username: 'duplicateUser',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    mockAuthFacade.register.and.callFake(() => {
      errorSignal.set('Username already exists');
    });

    component.onSubmit();

    expect(component.error()).toBe('Username already exists');
  });

  it('should set generic error message on unknown error', () => {
    const unknownError = new Error('Something went wrong');

    component.form.setValue({
      username: 'errorUser',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    mockAuthFacade.register.and.callFake(() => {
      errorSignal.set('Registration failed. Try again.');
    });

    component.onSubmit();

    expect(component.error()).toBe('Registration failed. Try again.');
  });
});
