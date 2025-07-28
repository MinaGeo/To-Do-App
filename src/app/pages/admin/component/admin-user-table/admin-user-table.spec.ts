import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { AdminUserTable } from './admin-user-table';
import { ToastrService } from 'ngx-toastr';

import { User, UserRole } from '../../../../core/api/auth/auth.model';
import { AdminFacade } from '../../../../service/admin/admin.service';

describe('AdminUserTable', () => {
  let component: AdminUserTable;
  let fixture: ComponentFixture<AdminUserTable>;
  let mockAdminFacade: jasmine.SpyObj<AdminFacade>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  const mockUsers: User[] = [
    {
      id: '1',
      _id: '1',
      username: 'user1',
      email: 'user1@test.com',
      role: UserRole.User,
    },
    {
      id: '2',
      _id: '2',
      username: 'user2',
      email: 'user2@test.com',
      role: UserRole.User,
    },
    {
      id: '3',
      username: 'user3',
      email: 'user3@test.com',
      role: UserRole.Admin,
    },
  ];

  beforeEach(async () => {
    const adminFacadeSpy = jasmine.createSpyObj('AdminFacade', [
      'getUsers',
      'promoteUser',
      'demoteUser',
      'deleteUser',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'show',
      'error',
    ]);

    adminFacadeSpy.getUsers.and.returnValue(signal(mockUsers));

    await TestBed.configureTestingModule({
      imports: [AdminUserTable],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: AdminFacade, useValue: adminFacadeSpy },
        { provide: ToastrService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserTable);
    component = fixture.componentInstance;
    mockAdminFacade = TestBed.inject(
      AdminFacade,
    ) as jasmine.SpyObj<AdminFacade>;
    mockToastrService = TestBed.inject(
      ToastrService,
    ) as jasmine.SpyObj<ToastrService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get users from facade', () => {
    expect(mockAdminFacade.getUsers).toHaveBeenCalled();
    expect(component.users()).toEqual(mockUsers);
  });

  describe('onPromote', () => {
    it('should call promoteUser with id when user has id', () => {
      const user = mockUsers[0];

      component.onPromote(user);

      expect(mockAdminFacade.promoteUser).toHaveBeenCalledWith('1', 'user1');
    });

    it('should call promoteUser with _id when user has _id but no id', () => {
      const user = {
        _id: '123',
        username: 'testuser',
        email: 'test@test.com',
        role: UserRole.User,
      } as User;

      component.onPromote(user);

      expect(mockAdminFacade.promoteUser).toHaveBeenCalledWith(
        '123',
        'testuser',
      );
    });

    it('should not call promoteUser when user has no id or _id', () => {
      const user = {
        username: 'testuser',
        email: 'test@test.com',
        role: UserRole.User,
      } as User;

      component.onPromote(user);

      expect(mockAdminFacade.promoteUser).not.toHaveBeenCalled();
    });
  });

  describe('onDemote', () => {
    it('should call demoteUser with id when user has id', () => {
      const user = mockUsers[0];

      component.onDemote(user);

      expect(mockAdminFacade.demoteUser).toHaveBeenCalledWith('1', 'user1');
    });

    it('should call demoteUser with _id when user has _id but no id', () => {
      const user = {
        _id: '123',
        username: 'testuser',
        email: 'test@test.com',
        role: UserRole.Admin,
      } as User;

      component.onDemote(user);

      expect(mockAdminFacade.demoteUser).toHaveBeenCalledWith(
        '123',
        'testuser',
      );
    });

    it('should not call demoteUser when user has no id or _id', () => {
      const user = {
        username: 'testuser',
        email: 'test@test.com',
        role: UserRole.User,
      } as User;

      component.onDemote(user);

      expect(mockAdminFacade.demoteUser).not.toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should call deleteUser with id when user has id', () => {
      const user = mockUsers[0];

      component.onDelete(user);

      expect(mockAdminFacade.deleteUser).toHaveBeenCalledWith('1', 'user1');
    });

    it('should call deleteUser with _id when user has _id but no id', () => {
      const user = {
        _id: '123',
        username: 'testuser',
        email: 'test@test.com',
        role: UserRole.User,
      } as User;

      component.onDelete(user);

      expect(mockAdminFacade.deleteUser).toHaveBeenCalledWith(
        '123',
        'testuser',
      );
    });

    it('should not call deleteUser when user has no id or _id', () => {
      const user = {
        username: 'testuser',
        email: 'test@test.com',
        role: UserRole.User,
      } as User;

      component.onDelete(user);

      expect(mockAdminFacade.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('trackByUserId', () => {
    it('should return user id when available', () => {
      const user = {
        id: '123',
        email: 'test@test.com',
        role: UserRole.User,
      } as User;

      const result = component.trackByUserId(0, user);

      expect(result).toBe('123');
    });

    it('should return user email when id is not available', () => {
      const user = { email: 'test@test.com', role: UserRole.User } as User;

      const result = component.trackByUserId(0, user);

      expect(result).toBe('test@test.com');
    });

    it('should return index as string when neither id nor email are available', () => {
      const user = { role: UserRole.User } as User;

      const result = component.trackByUserId(5, user);

      expect(result).toBe('5');
    });
  });
});
