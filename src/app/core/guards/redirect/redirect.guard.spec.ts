import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { RedirectGuard } from './redirect.guard';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { AuthFacade } from '../../../service/auth/auth.service';

describe('RedirectGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthFacade>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthFacade', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        provideZonelessChangeDetection(),
      ],
    });

    mockAuthService = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/login' } as RouterStateSnapshot;
  });

  it('should allow access when user is not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(signal(false));

    const result = TestBed.runInInjectionContext(() =>
      RedirectGuard(mockRoute, mockState),
    );

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to dashboard when user is authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(signal(true));

    const result = TestBed.runInInjectionContext(() =>
      RedirectGuard(mockRoute, mockState),
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
