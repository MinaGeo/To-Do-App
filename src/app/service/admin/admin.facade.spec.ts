import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminFacade } from './admin.service';
import { AdminApiService } from '../../core/api/admin/admin.api';
import { ToastrService } from 'ngx-toastr';
import { User, UserRole } from '../../core/api/auth/auth.model';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AdminFacade', () => {
  let service: AdminFacade;
  let mockAdminApi: jasmine.SpyObj<AdminApiService>;
  let mockToast: jasmine.SpyObj<ToastrService>;

  const mockUsers: User[] = [
    {
      id: '1',
      username: 'user1',
      role: UserRole.User,
      email: 'user1@test.com',
    },
    {
      id: '2',
      username: 'admin1',
      role: UserRole.Admin,
      email: 'admin1@test.com',
    },
  ];

  beforeEach(() => {
    const adminApiSpy = jasmine.createSpyObj('AdminApiService', [
      'getUsers',
      'promote',
      'demote',
      'delete',
    ]);
    const toastSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AdminFacade,
        { provide: AdminApiService, useValue: adminApiSpy },
        { provide: ToastrService, useValue: toastSpy },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(AdminFacade);
    mockAdminApi = TestBed.inject(
      AdminApiService,
    ) as jasmine.SpyObj<AdminApiService>;
    mockToast = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadUsers', () => {
    it('should load users successfully', () => {
      mockAdminApi.getUsers.and.returnValue(of(mockUsers));

      service.loadUsers();

      expect(mockAdminApi.getUsers).toHaveBeenCalled();
      expect(service.getUsers()()).toEqual(mockUsers);
    });

    it('should handle error when loading users fails', () => {
      mockAdminApi.getUsers.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      service.loadUsers();

      expect(mockAdminApi.getUsers).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith('Failed to load users.');
    });
  });

  describe('promoteUser', () => {
    it('should promote user successfully', () => {
      mockAdminApi.promote.and.returnValue(of(undefined)); // Changed from of({})
      mockAdminApi.getUsers.and.returnValue(of(mockUsers));

      service.promoteUser('1', 'testuser');

      expect(mockAdminApi.promote).toHaveBeenCalledWith('1');
      expect(mockToast.success).toHaveBeenCalledWith(
        'testuser promoted to admin.',
      );
      expect(mockAdminApi.getUsers).toHaveBeenCalled();
    });

    it('should promote user without username', () => {
      mockAdminApi.promote.and.returnValue(of(undefined)); // Changed from of({})
      mockAdminApi.getUsers.and.returnValue(of(mockUsers));

      service.promoteUser('1');

      expect(mockToast.success).toHaveBeenCalledWith('User promoted to admin.');
    });

    it('should handle promotion error', () => {
      mockAdminApi.promote.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      service.promoteUser('1', 'testuser');

      expect(mockToast.error).toHaveBeenCalledWith('Failed to promote user.');
    });
  });

  describe('demoteUser', () => {
    it('should demote user successfully', () => {
      mockAdminApi.demote.and.returnValue(of(undefined)); // Changed from of({})
      mockAdminApi.getUsers.and.returnValue(of(mockUsers));

      service.demoteUser('1', 'testuser');

      expect(mockAdminApi.demote).toHaveBeenCalledWith('1');
      expect(mockToast.success).toHaveBeenCalledWith(
        'testuser demoted to user.',
      );
    });

    it('should handle demotion error', () => {
      mockAdminApi.demote.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      service.demoteUser('1', 'testuser');

      expect(mockToast.error).toHaveBeenCalledWith('Failed to demote user.');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', () => {
      mockAdminApi.delete.and.returnValue(of(undefined)); // Changed from of({})
      mockAdminApi.getUsers.and.returnValue(of(mockUsers));

      service.deleteUser('1', 'testuser');

      expect(mockAdminApi.delete).toHaveBeenCalledWith('1');
      expect(mockToast.success).toHaveBeenCalledWith(
        'testuser deleted successfully.',
      );
    });

    it('should handle deletion error', () => {
      mockAdminApi.delete.and.returnValue(
        throwError(() => new Error('API Error')),
      );

      service.deleteUser('1', 'testuser');

      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete user.');
    });
  });
});
