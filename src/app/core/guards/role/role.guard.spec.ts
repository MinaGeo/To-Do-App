import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';
import {
  provideZonelessChangeDetection,
  signal,
  WritableSignal,
  inject,
} from '@angular/core';
import { User, UserRole } from '../../api/auth/auth.model';

const mockUserSignal: WritableSignal<User | null> = signal(null);

const mockRoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router: Router = inject(Router);
  const currentUser = mockUserSignal();

  if (currentUser?.role === UserRole.Admin) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};

describe('roleGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockUserSignal.set(null);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        provideZonelessChangeDetection(),
      ],
    });

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/admin' } as RouterStateSnapshot;
  });

  it('should allow access when user is admin', () => {
    const adminUser: User = {
      role: UserRole.Admin,
      id: '1',
      username: 'Admin User',
      email: 'admin@test.com',
    };
    mockUserSignal.set(adminUser);

    const result = TestBed.runInInjectionContext(() =>
      mockRoleGuard(mockRoute, mockState),
    );

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to unauthorized when user is not admin', () => {
    const regularUser: User = {
      role: UserRole.User,
      id: '2',
      username: 'Regular User',
      email: 'user@test.com',
    };
    mockUserSignal.set(regularUser);

    const result = TestBed.runInInjectionContext(() =>
      mockRoleGuard(mockRoute, mockState),
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should deny access and redirect to unauthorized when user is null', () => {
    mockUserSignal.set(null);

    const result = TestBed.runInInjectionContext(() =>
      mockRoleGuard(mockRoute, mockState),
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
