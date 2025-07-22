import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Login } from './login';
import { AuthFacade } from '../../service/auth.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginRequest } from '../../core/api/auth/auth.model';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthFacade: jasmine.SpyObj<AuthFacade>;

  beforeEach(async () => {
    mockAuthFacade = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['login']);

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

    mockAuthFacade.login.and.returnValue(of(mockResponse));

    component.onSubmit();

    const expectedRequest: LoginRequest = {
      username: 'mina',
      password: 'Password123',
    };

    expect(mockAuthFacade.login).toHaveBeenCalledWith(expectedRequest);
    expect(component.errorMsg).toBe('');
  });

  it('should set error message on login failure', () => {
    component.form.setValue({ username: 'wronguser', password: 'wrongpass' });

    mockAuthFacade.login.and.returnValue(
      throwError(() => new Error('Invalid login')),
    );

    component.onSubmit();

    expect(component.errorMsg).toBe('Invalid username or password');
  });
});
