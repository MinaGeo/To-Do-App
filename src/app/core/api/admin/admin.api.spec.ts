import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { User, UserRole } from '../auth/auth.model';
import { environment } from '../../../../environments/environment';
import { AdminApiService } from './admin.api';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('AdminApiService', () => {
  let service: AdminApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminApiService,
        provideHttpClient(),
        provideZonelessChangeDetection(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AdminApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'test@example.com',
        username: 'Test',
        role: UserRole.User,
      },
    ];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${baseUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should promote a user', () => {
    const userId = '123';

    service.promote(userId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/${userId}/promote`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('should demote a user', () => {
    const userId = '456';

    service.demote(userId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/${userId}/demote`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('should delete a user', () => {
    const userId = '789';

    service.delete(userId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
