import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EditTodoPage } from './edit-todo';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DefaultGlobalConfig, TOAST_CONFIG, ToastrService } from 'ngx-toastr';
describe('EditTodoPage', () => {
  let component: EditTodoPage;
  let fixture: ComponentFixture<EditTodoPage>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  mockToastrService = jasmine.createSpyObj('ToastrService', [
    'success',
    'error',
    'info',
    'warning',
  ]);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTodoPage],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TOAST_CONFIG, useValue: DefaultGlobalConfig },
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTodoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
