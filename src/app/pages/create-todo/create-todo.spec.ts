import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { TodoCreate } from './create-todo';
import { TodoProvider } from '../../service/todo.service';

describe('TodoCreate', () => {
  let component: TodoCreate;
  let fixture: ComponentFixture<TodoCreate>;
  let mockTodoProvider: jasmine.SpyObj<TodoProvider>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockTodoProvider = jasmine.createSpyObj('TodoProvider', ['addTodo']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [TodoCreate], // Standalone component
      providers: [
        provideRouter([
          { path: 'dashboard', component: {} as any }, // Mock route for navigation
        ]),
        { provide: TodoProvider, useValue: mockTodoProvider },
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

    expect(mockTodoProvider.addTodo).not.toHaveBeenCalled();
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

    expect(mockTodoProvider.addTodo).toHaveBeenCalledWith(
      formData.name,
      formData.description,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should validate name field max length', () => {
    const nameControl = component.form.get('name');
    const longName = 'a'.repeat(51); // 51 characters

    nameControl?.setValue(longName);

    expect(nameControl?.hasError('maxlength')).toBe(true);
  });

  it('should validate description field max length', () => {
    const descriptionControl = component.form.get('description');
    const longDescription = 'a'.repeat(256); // 256 characters

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
