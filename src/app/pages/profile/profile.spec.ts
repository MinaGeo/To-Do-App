import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ProfilePage } from './profile';
import { AuthFacade } from '../../service/auth.service';
import { User } from '../../core/api/auth/auth.model';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let mockAuthFacade: jasmine.SpyObj<AuthFacade>;

  const mockUser: User = {
    id: '1',
    _id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(async () => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacade', [
      'getCurrentUser',
      'logout',
    ]);

    authFacadeSpy.getCurrentUser.and.returnValue(signal(mockUser));

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthFacade, useValue: authFacadeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    mockAuthFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current user from auth facade', () => {
    expect(mockAuthFacade.getCurrentUser).toHaveBeenCalled();
    expect(component.user()).toEqual(mockUser);
  });

  it('should handle null user from auth facade', () => {
    mockAuthFacade.getCurrentUser.and.returnValue(signal(null));

    const newFixture = TestBed.createComponent(ProfilePage);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.user()).toBeNull();
  });

  it('should call auth.logout when logout is called', () => {
    component.logout();

    expect(mockAuthFacade.logout).toHaveBeenCalledTimes(1);
  });

  it('should have logout as an arrow function', () => {
    expect(typeof component.logout).toBe('function');
  });

  it('should maintain user signal reactivity', () => {
    const newUser: User = {
      id: '2',
      _id: '2',
      username: 'newuser',
      email: 'new@example.com',
      role: 'admin',
    };

    const userSignal = signal(newUser);
    mockAuthFacade.getCurrentUser.and.returnValue(userSignal);

    const newFixture = TestBed.createComponent(ProfilePage);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.user()).toEqual(newUser);
  });
});
