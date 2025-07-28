import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { AdminPage } from './admin';
import { AdminFacade } from '../../service/admin/admin.service';

describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;
  let mockAdminFacade: jasmine.SpyObj<AdminFacade>;

  beforeEach(async () => {
    const adminFacadeSpy = jasmine.createSpyObj('AdminFacade', [
      'loadUsers',
      'getUsers',
    ]);
    adminFacadeSpy.getUsers.and.returnValue(signal([]));

    await TestBed.configureTestingModule({
      imports: [AdminPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        { provide: AdminFacade, useValue: adminFacadeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    mockAdminFacade = TestBed.inject(
      AdminFacade,
    ) as jasmine.SpyObj<AdminFacade>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUsers on ngOnInit', () => {
    component.ngOnInit();

    expect(mockAdminFacade.loadUsers).toHaveBeenCalledTimes(1);
  });

  it('should call loadUsers on component initialization', () => {
    fixture.detectChanges();

    expect(mockAdminFacade.loadUsers).toHaveBeenCalledTimes(1);
  });
});
