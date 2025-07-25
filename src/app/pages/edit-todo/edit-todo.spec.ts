import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EditTodoPage } from './edit-todo';
import { TodoFacade } from '../../service/todo.service';
import { ToastService } from '../../service/toast.service';
import { Todo } from '../../core/api/todo/todo.model';
import { signal } from '@angular/core';

describe('EditTodoPage', () => {
  let component: EditTodoPage;
  let fixture: ComponentFixture<EditTodoPage>;
  let mockTodoFacade: jasmine.SpyObj<TodoFacade>;
  let mockToastService: jasmine.SpyObj<ToastService>;
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

    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

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
      imports: [EditTodoPage],
      providers: [
        provideRouter([
          { path: '', component: {} as any },
          { path: 'dashboard', component: {} as any },
        ]),
        { provide: TodoFacade, useValue: mockTodoFacade },
        { provide: ToastService, useValue: mockToastService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTodoPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize id from route parameter and populate form', () => {
    component.ngOnInit();

    expect(component.id()).toBe('123');
    expect(component.name()).toBe('Test Todo');
    expect(component.description()).toBe('Test Description');
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('should handle null id from route parameter', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

    component.ngOnInit();

    expect(component.id()).toBe('');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should navigate to home when todo is not found', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('999');

    component.ngOnInit();

    expect(component.id()).toBe('999');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not submit when form is invalid', () => {
    const mockForm = { valid: false } as NgForm;

    component.onSubmit(mockForm);

    expect(mockTodoFacade.updateTodo).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    expect(mockToastService.show).toHaveBeenCalledWith(
      'Please fill out all fields correctly.',
      'error',
    );
  });

  it('should submit and navigate when form is valid', () => {
    const mockForm = { valid: true } as NgForm;
    component.id.set('123');
    component.name.set('Updated Todo Name');
    component.description.set('Updated Description');

    component.onSubmit(mockForm);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('123', {
      name: 'Updated Todo Name',
      description: 'Updated Description',
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should update name signal correctly', () => {
    const newName = 'New Todo Name';

    component.name.set(newName);

    expect(component.name()).toBe(newName);
  });

  it('should update description signal correctly', () => {
    const newDescription = 'New Todo Description';

    component.description.set(newDescription);

    expect(component.description()).toBe(newDescription);
  });

  it('should compute todo correctly based on id', () => {
    component.id.set('123');

    const todo = component.todo();

    expect(todo).toEqual(mockTodos[0]);
  });

  it('should return undefined when todo is not found in computed signal', () => {
    component.id.set('999');

    const todo = component.todo();

    expect(todo).toBeUndefined();
  });

  it('should initialize signals with empty strings by default', () => {
    expect(component.name()).toBe('');
    expect(component.description()).toBe('');
    expect(component.id()).toBe('');
  });

  it('should handle different route parameter values and populate form accordingly', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('456');

    component.ngOnInit();

    expect(component.id()).toBe('456');
    expect(component.name()).toBe('Another Todo');
    expect(component.description()).toBe('Another Description');
  });

  it('should populate form fields when todo exists', () => {
    component.ngOnInit();

    expect(component.name()).toBe('Test Todo');
    expect(component.description()).toBe('Test Description');
  });

  it('should update todo with current signal values when form is valid', () => {
    const mockForm = { valid: true } as NgForm;
    component.id.set('123');

    component.name.set('Modified Name');
    component.description.set('Modified Description');

    component.onSubmit(mockForm);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('123', {
      name: 'Modified Name',
      description: 'Modified Description',
    });
  });

  it('should handle empty id parameter gracefully', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('');

    component.ngOnInit();

    expect(component.id()).toBe('');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not populate form fields when todo is not found', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('nonexistent');

    component.ngOnInit();

    expect(component.id()).toBe('nonexistent');
    expect(component.name()).toBe('');
    expect(component.description()).toBe('');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
