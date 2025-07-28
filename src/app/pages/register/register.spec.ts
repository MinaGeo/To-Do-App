import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  signal,
  WritableSignal,
} from '@angular/core';
import { Register } from './register';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthFacade } from '../../service/auth/auth.service';

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
      'setError',
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

  it('should not submit when form is invalid', () => {
    component.form.setValue({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.onSubmit();

    expect(mockAuthFacade.register).not.toHaveBeenCalled();
    expect(mockAuthFacade.setError).not.toHaveBeenCalled();
  });

  it('should show error when passwords do not match', () => {
    component.form.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'WrongPassword123',
    });

    component.onSubmit();

    expect(mockAuthFacade.setError).toHaveBeenCalledWith(
      'Passwords do not match',
    );
    expect(mockAuthFacade.register).not.toHaveBeenCalled();
  });

  it('should call register with correct data when form is valid and passwords match', () => {
    component.form.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    component.onSubmit();

    expect(mockAuthFacade.register).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    });
    expect(mockAuthFacade.setError).not.toHaveBeenCalled();
  });

  it('should navigate to login when user becomes authenticated', () => {
    isAuthenticatedSignal.set(true);

    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should expose error signal from AuthFacade', () => {
    errorSignal.set('Test error message');

    expect(component.error()).toBe('Test error message');
  });

  it('should expose loading signal from AuthFacade', () => {
    loadingSignal.set(true);

    expect(component.loading()).toBe(true);

    loadingSignal.set(false);

    expect(component.loading()).toBe(false);
  });

  it('should validate username field correctly', () => {
    const usernameControl = component.f['username'];

    usernameControl.setValue('');
    expect(usernameControl.hasError('required')).toBe(true);

    usernameControl.setValue('ab');
    expect(usernameControl.hasError('minlength')).toBe(true);

    usernameControl.setValue('a'.repeat(31));
    expect(usernameControl.hasError('maxlength')).toBe(true);

    usernameControl.setValue('validuser');
    expect(usernameControl.valid).toBe(true);
  });

  it('should validate email field correctly', () => {
    const emailControl = component.f['email'];

    emailControl.setValue('');
    expect(emailControl.hasError('required')).toBe(true);

    emailControl.setValue('invalid-email');
    expect(emailControl.hasError('email')).toBe(true);

    emailControl.setValue('valid@example.com');
    expect(emailControl.valid).toBe(true);
  });

  it('should validate password field correctly', () => {
    const passwordControl = component.f['password'];

    passwordControl.setValue('');
    expect(passwordControl.hasError('required')).toBe(true);

    passwordControl.setValue('12345');
    expect(passwordControl.hasError('minlength')).toBe(true);

    passwordControl.setValue('a'.repeat(51));
    expect(passwordControl.hasError('maxlength')).toBe(true);

    passwordControl.setValue('onlyletters');
    expect(passwordControl.hasError('pattern')).toBe(true);

    passwordControl.setValue('123456');
    expect(passwordControl.hasError('pattern')).toBe(true);

    passwordControl.setValue('Password123');
    expect(passwordControl.valid).toBe(true);
  });

  it('should validate confirmPassword field correctly', () => {
    const confirmPasswordControl = component.f['confirmPassword'];

    confirmPasswordControl.setValue('');
    expect(confirmPasswordControl.hasError('required')).toBe(true);

    confirmPasswordControl.setValue('Password123');
    expect(confirmPasswordControl.valid).toBe(true);
  });

  it('should handle empty form values gracefully', () => {
    component.form.patchValue({
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
    });

    component.onSubmit();

    expect(mockAuthFacade.register).not.toHaveBeenCalled();
  });

  it('should call passwordsMatch method correctly', () => {
    const result1 = (component as any).passwordsMatch(
      'password123',
      'password123',
    );
    expect(result1).toBe(true);

    const result2 = (component as any).passwordsMatch(
      'password123',
      'different',
    );
    expect(result2).toBe(false);
  });

  it('should return form controls via getter', () => {
    const controls = component.f;

    expect(controls['username']).toBeDefined();
    expect(controls['email']).toBeDefined();
    expect(controls['password']).toBeDefined();
    expect(controls['confirmPassword']).toBeDefined();
  });

  it('should not navigate if user is not authenticated', () => {
    isAuthenticatedSignal.set(false);
    fixture.detectChanges();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle registration with minimum valid data', () => {
    component.form.setValue({
      username: 'usr',
      email: 'a@b.co',
      password: 'pass12',
      confirmPassword: 'pass12',
    });

    component.onSubmit();

    expect(mockAuthFacade.register).toHaveBeenCalledWith({
      username: 'usr',
      email: 'a@b.co',
      password: 'pass12',
    });
  });
});
