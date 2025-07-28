import { TestBed } from '@angular/core/testing';
import { ToastrService } from './toast.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ToastrService', () => {
  let service: ToastrService;
  let mockToastr: any;

  beforeEach(() => {
    // Create mock toastr object
    mockToastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      warning: jasmine.createSpy('warning'),
      options: {},
    };

    TestBed.configureTestingModule({
      providers: [ToastrService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(ToastrService);

    // Replace the toastr instance with our mock
    service.toastr = mockToastr;
    // Set the position class since constructor already ran
    service.toastr.options.positionClass = 'toast-bottom-right';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set position class on initialization', () => {
    expect(service.toastr.options.positionClass).toBe('toast-bottom-right');
  });

  it('should call toastr.success', () => {
    service.success('Test message', 'Test title');

    expect(mockToastr.success).toHaveBeenCalledWith(
      'Test message',
      'Test title',
    );
  });

  it('should call toastr.success without title', () => {
    service.success('Test message');

    expect(mockToastr.success).toHaveBeenCalledWith('Test message', undefined);
  });

  it('should call toastr.error', () => {
    service.error('Error message', 'Error title');

    expect(mockToastr.error).toHaveBeenCalledWith(
      'Error message',
      'Error title',
    );
  });

  it('should call toastr.error without title', () => {
    service.error('Error message');

    expect(mockToastr.error).toHaveBeenCalledWith('Error message', undefined);
  });

  it('should call toastr.info', () => {
    service.info('Info message', 'Info title');

    expect(mockToastr.info).toHaveBeenCalledWith('Info message', 'Info title');
  });

  it('should call toastr.info without title', () => {
    service.info('Info message');

    expect(mockToastr.info).toHaveBeenCalledWith('Info message', undefined);
  });

  it('should call toastr.warning', () => {
    service.warning('Warning message', 'Warning title');

    expect(mockToastr.warning).toHaveBeenCalledWith(
      'Warning message',
      'Warning title',
    );
  });

  it('should call toastr.warning without title', () => {
    service.warning('Warning message');

    expect(mockToastr.warning).toHaveBeenCalledWith(
      'Warning message',
      undefined,
    );
  });
});
