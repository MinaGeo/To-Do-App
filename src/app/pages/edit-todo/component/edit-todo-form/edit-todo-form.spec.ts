import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTodoForm } from './edit-todo-form';
import { TodoFacade } from '../../../../service/todo.service';
import { ToastrService } from '../../../../service/toast.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Todo } from '../../../../core/api/todo/todo.model';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { NgForm } from '@angular/forms';

describe('EditTodoForm', () => {
  let component: EditTodoForm;
  let fixture: ComponentFixture<EditTodoForm>;
  let mockTodoFacade: jasmine.SpyObj<TodoFacade>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockTodos: Todo[];

  beforeEach(async () => {
    mockTodos = [
      {
        id: '123',
        name: 'Test Todo',
        description: 'Test Description',
        completed: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '456',
        name: 'Another Todo',
        description: 'Another Description',
        completed: true,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      },
    ];

    mockTodoFacade = jasmine.createSpyObj('TodoFacade', [
      'updateTodo',
      'getTodos',
    ]);
    mockTodoFacade.getTodos.and.returnValue(signal(mockTodos));

    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'info',
      'warning',
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [EditTodoForm],
      providers: [
        provideRouter([
          { path: '', component: {} as any },
          { path: 'dashboard', component: {} as any },
        ]),
        { provide: TodoFacade, useValue: mockTodoFacade },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTodoForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize id from route parameter and populate form', () => {
    component.ngOnInit();

    expect(component.form.id()).toBe('123');
    expect(component.form.name()).toBe('Test Todo');
    expect(component.form.description()).toBe('Test Description');
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('should handle null id from route parameter', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

    component.ngOnInit();

    expect(component.form.id()).toBe('');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should navigate to home when todo is not found', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('999');

    component.ngOnInit();

    expect(component.form.id()).toBe('999');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not submit when form is invalid', () => {
    const mockForm = { valid: false } as NgForm;

    component.onSubmit(mockForm);

    expect(mockTodoFacade.updateTodo).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Please fill out all fields correctly.',
    );
  });

  it('should submit and navigate when form is valid', () => {
    const mockForm = { valid: true } as NgForm;
    component.form.id.set('123');
    component.form.name.set('Updated Todo Name');
    component.form.description.set('Updated Description');

    component.onSubmit(mockForm);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('123', {
      name: 'Updated Todo Name',
      description: 'Updated Description',
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should update name signal correctly', () => {
    const newName = 'New Todo Name';

    component.form.name.set(newName);

    expect(component.form.name()).toBe(newName);
  });

  it('should update description signal correctly', () => {
    const newDescription = 'New Todo Description';

    component.form.description.set(newDescription);

    expect(component.form.description()).toBe(newDescription);
  });

  it('should compute todo correctly based on id', () => {
    component.form.id.set('123');

    const todo = component.todo();

    expect(todo).toEqual(mockTodos[0]);
  });

  it('should return undefined when todo is not found in computed signal', () => {
    component.form.id.set('999');

    const todo = component.todo();

    expect(todo).toBeUndefined();
  });

  it('should initialize signals with empty strings by default', () => {
    expect(component.form.name()).toBe('');
    expect(component.form.description()).toBe('');
    expect(component.form.id()).toBe('');
  });

  it('should handle different route parameter values and populate form accordingly', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('456');

    component.ngOnInit();

    expect(component.form.id()).toBe('456');
    expect(component.form.name()).toBe('Another Todo');
    expect(component.form.description()).toBe('Another Description');
  });

  it('should populate form fields when todo exists', () => {
    component.ngOnInit();

    expect(component.form.name()).toBe('Test Todo');
    expect(component.form.description()).toBe('Test Description');
  });

  it('should update todo with current signal values when form is valid', () => {
    const mockForm = { valid: true } as NgForm;
    component.form.id.set('123');

    component.form.name.set('Modified Name');
    component.form.description.set('Modified Description');

    component.onSubmit(mockForm);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('123', {
      name: 'Modified Name',
      description: 'Modified Description',
    });
  });

  it('should handle empty id parameter gracefully', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('');

    component.ngOnInit();

    expect(component.form.id()).toBe('');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not populate form fields when todo is not found', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('nonexistent');

    component.ngOnInit();

    expect(component.form.id()).toBe('nonexistent');
    expect(component.form.name()).toBe('');
    expect(component.form.description()).toBe('');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
