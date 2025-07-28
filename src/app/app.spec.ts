import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DefaultGlobalConfig, TOAST_CONFIG, ToastrService } from 'ngx-toastr';
describe('App', () => {
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  mockToastrService = jasmine.createSpyObj('ToastrService', [
    'success',
    'error',
    'info',
    'warning',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TOAST_CONFIG, useValue: DefaultGlobalConfig },
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
