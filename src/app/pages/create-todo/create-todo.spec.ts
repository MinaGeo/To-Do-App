import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { TodoCreate } from './create-todo';
import { TodoFacade } from '../../service/todo/todo.service';

describe('TodoCreate', () => {
  let component: TodoCreate;
  let fixture: ComponentFixture<TodoCreate>;
  let mockTodoFacade: jasmine.SpyObj<TodoFacade>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockTodoFacade = jasmine.createSpyObj('TodoFacade', ['addTodo']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [TodoCreate],
      providers: [
        provideRouter([{ path: 'dashboard', component: {} as any }]),
        { provide: TodoFacade, useValue: mockTodoFacade },
        { provide: Router, useValue: mockRouter },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values and validators', () => {
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
    expect(component.form.get('dueDate')?.value).toBe('');

    expect(component.form.get('name')?.hasError('required')).toBe(true);
    expect(component.form.get('description')?.hasError('required')).toBe(true);
    expect(component.form.get('dueDate')?.hasError('required')).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();

    expect(mockTodoFacade.addTodo).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should submit and navigate when form is valid', () => {
    const formData = {
      name: 'Test Todo',
      description: 'Test Description',
      dueDate: '2025-12-31',
    };

    component.form.patchValue(formData);
    component.onSubmit();

    expect(mockTodoFacade.addTodo).toHaveBeenCalledWith(
      formData.name,
      formData.description,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should validate name field max length', () => {
    const nameControl = component.form.get('name');
    const longName = 'a'.repeat(51);

    nameControl?.setValue(longName);

    expect(nameControl?.hasError('maxlength')).toBe(true);
  });

  it('should validate description field max length', () => {
    const descriptionControl = component.form.get('description');
    const longDescription = 'a'.repeat(256);

    descriptionControl?.setValue(longDescription);

    expect(descriptionControl?.hasError('maxlength')).toBe(true);
  });

  it('should have valid form when all fields are properly filled', () => {
    component.form.patchValue({
      name: 'Valid Todo Name',
      description: 'Valid description',
      dueDate: '2025-12-31',
    });

    expect(component.form.valid).toBe(true);
  });
});
