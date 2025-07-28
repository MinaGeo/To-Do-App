import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Layout } from './layout';
import { DefaultGlobalConfig, TOAST_CONFIG, ToastrService } from 'ngx-toastr';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  mockToastrService = jasmine.createSpyObj('ToastrService', [
    'success',
    'error',
    'info',
    'warning',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TOAST_CONFIG, useValue: DefaultGlobalConfig },
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
