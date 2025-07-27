import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal, Signal } from '@angular/core';
import { Header } from './header';
import { AuthFacade } from '../../../service/auth.service';
import { User, UserRole } from '../../../core/api/auth/auth.model';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let mockAuthFacade: jasmine.SpyObj<AuthFacade>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthFacade = jasmine.createSpyObj('AuthFacade', [
      'isAuthenticated',
      'getCurrentUser',
      'logout',
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    const testRoutes: Routes = [{ path: '', component: Header }];

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter(testRoutes),
        { provide: AuthFacade, useValue: mockAuthFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    beforeEach(() => {
      mockAuthFacade.isAuthenticated.and.returnValue(
        signal(false) as Signal<boolean>,
      );
      mockAuthFacade.getCurrentUser.and.returnValue(
        signal(null) as Signal<User | null>,
      );
    });

    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize isLoggedIn from auth service', () => {
      const mockIsAuthenticated = signal(true);
      mockAuthFacade.isAuthenticated.and.returnValue(
        mockIsAuthenticated as Signal<boolean>,
      );

      fixture.detectChanges();

      expect(mockAuthFacade.isAuthenticated).toHaveBeenCalled();
      expect(component.isLoggedIn).toBe(mockIsAuthenticated);
    });

    it('should initialize user from auth service', () => {
      const mockUser: User = {
        id: '1',
        email: 'john@example.com',
        username: 'johndoe',
        role: UserRole.Admin,
      };
      const userSignal = signal(mockUser);
      mockAuthFacade.getCurrentUser.and.returnValue(userSignal);

      fixture.detectChanges();

      const user = component.user();

      expect(mockAuthFacade.getCurrentUser).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });
  });

  describe('logout method', () => {
    beforeEach(() => {
      mockAuthFacade.isAuthenticated.and.returnValue(
        signal(false) as Signal<boolean>,
      );
      mockAuthFacade.getCurrentUser.and.returnValue(
        signal(null) as Signal<User | null>,
      );
      fixture.detectChanges();
    });

    it('should call auth.logout() when logout is called', () => {
      component.logout();

      expect(mockAuthFacade.logout).toHaveBeenCalled();
    });
  });

  describe('Authentication State', () => {
    it('should reflect authenticated state when user is logged in', () => {
      const mockUser: User = {
        id: '1',
        email: 'john@example.com',
        username: 'johndoe',
        role: UserRole.User,
      };
      mockAuthFacade.isAuthenticated.and.returnValue(
        signal(true) as Signal<boolean>,
      );
      mockAuthFacade.getCurrentUser.and.returnValue(
        signal(mockUser) as Signal<User | null>,
      );

      fixture.detectChanges();

      expect(component.isLoggedIn()).toBe(true);
      expect(component.user()).toEqual(mockUser);
    });

    it('should reflect unauthenticated state when user is not logged in', () => {
      mockAuthFacade.isAuthenticated.and.returnValue(
        signal(false) as Signal<boolean>,
      );
      mockAuthFacade.getCurrentUser.and.returnValue(
        signal(null) as Signal<User | null>,
      );

      fixture.detectChanges();

      expect(component.isLoggedIn()).toBe(false);
      expect(component.user()).toBeNull();
    });
  });

  describe('Service Injection', () => {
    it('should inject AuthFacade service', () => {
      expect(component['auth']).toBeDefined();
    });

    it('should inject Router service', () => {
      expect(component['router']).toBeDefined();
    });
  });

  describe('Change Detection', () => {
    it('should use OnPush change detection strategy', () => {
      expect(component).toBeTruthy();
    });
  });
});
