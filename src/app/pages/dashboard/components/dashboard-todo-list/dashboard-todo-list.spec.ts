import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTodoList } from './dashboard-todo-list';
import { Todo } from '../../../../core/api/todo/todo.model';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthFacade } from '../../../../service/auth/auth.service';
import { TodoFacade } from '../../../../service/todo/todo.service';

describe('DashboardTodoList', () => {
  let component: DashboardTodoList;
  let fixture: ComponentFixture<DashboardTodoList>;
  let mockTodoFacade: jasmine.SpyObj<TodoFacade>;
  let mockAuthFacade: jasmine.SpyObj<AuthFacade>;

  const mockTodos: Todo[] = [
    {
      id: '1',
      name: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      name: 'Test Todo 2',
      description: 'Description 2',
      completed: true,
      createdAt: '2024-01-02T10:00:00Z',
      updatedAt: '2024-01-02T10:00:00Z',
    },
  ];

  beforeEach(async () => {
    mockTodoFacade = jasmine.createSpyObj('TodoFacade', [
      'loadTodos',
      'addTodo',
      'deleteTodo',
      'updateTodo',
      'getTodos',
      'getTotalTodos',
      'getCompletedTodos',
      'getPendingTodos',
    ]);
    mockTodoFacade.getTodos.and.returnValue(signal(mockTodos));
    mockTodoFacade.getTotalTodos.and.returnValue(mockTodos.length);
    mockTodoFacade.getCompletedTodos.and.returnValue(
      mockTodos.filter((t) => t.completed).length,
    );
    mockTodoFacade.getPendingTodos.and.returnValue(
      mockTodos.filter((t) => !t.completed).length,
    );

    mockAuthFacade = jasmine.createSpyObj('AuthFacade', ['getCurretUsername']);
    mockAuthFacade.getCurretUsername.and.returnValue(signal('testuser'));

    await TestBed.configureTestingModule({
      imports: [DashboardTodoList],
      providers: [
        provideRouter([
          { path: '', component: {} as any },
          { path: 'edit/:id', component: {} as any },
        ]),
        { provide: TodoFacade, useValue: mockTodoFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTodoList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTodos on ngOnInit', () => {
    component.ngOnInit();

    expect(mockTodoFacade.loadTodos).toHaveBeenCalled();
  });

  it('should get todo list from TodoFacade', () => {
    expect(component.todoList()).toEqual(mockTodos);
  });

  it('should get username from AuthFacade', () => {
    expect(component.username()).toBe('testuser');
  });

  it('should handle guest username', () => {
    mockAuthFacade.getCurretUsername.and.returnValue(signal('Guest'));

    fixture = TestBed.createComponent(DashboardTodoList);
    component = fixture.componentInstance;

    expect(component.username()).toBe('Guest');
  });

  it('should call deleteTodo with correct todoId', () => {
    const todoId = '123';

    component.onDelete(todoId);

    expect(mockTodoFacade.deleteTodo).toHaveBeenCalledWith(todoId);
  });

  it('should call updateTodo with correct parameters', () => {
    const todoId = '123';
    const updateData: Partial<Todo> = { name: 'Updated Name' };

    component.onUpdate(todoId, updateData);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith(todoId, updateData);
  });

  it('should toggle todo completion status to true', () => {
    const todo: Todo = {
      id: '1',
      name: 'Test Todo',
      description: 'Test Description',
      completed: false,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    };

    component.onToggleComplete(todo);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('1', {
      completed: true,
    });
  });

  it('should toggle todo completion status to false', () => {
    const todo: Todo = {
      id: '1',
      name: 'Test Todo',
      description: 'Test Description',
      completed: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    };

    component.onToggleComplete(todo);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('1', {
      completed: false,
    });
  });

  it('should handle empty todo list', () => {
    const emptyTodos: Todo[] = [];
    mockTodoFacade.getTodos.and.returnValue(signal(emptyTodos));
    mockTodoFacade.getTotalTodos.and.returnValue(0);
    mockTodoFacade.getCompletedTodos.and.returnValue(0);
    mockTodoFacade.getPendingTodos.and.returnValue(0);

    fixture = TestBed.createComponent(DashboardTodoList);
    component = fixture.componentInstance;

    expect(component.todoList()).toEqual([]);
  });

  it('should call onDelete with empty string id', () => {
    component.onDelete('');

    expect(mockTodoFacade.deleteTodo).toHaveBeenCalledWith('');
  });

  it('should call onUpdate with empty object', () => {
    component.onUpdate('123', {});

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('123', {});
  });

  it('should call onUpdate with multiple properties', () => {
    const updateData: Partial<Todo> = {
      name: 'Updated Name',
      description: 'Updated Description',
      completed: true,
    };

    component.onUpdate('123', updateData);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('123', updateData);
  });

  it('should handle todos with undefined completed property', () => {
    const todo: Todo = {
      id: '1',
      name: 'Test Todo',
      description: 'Test Description',
      completed: undefined as any,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    };

    component.onToggleComplete(todo);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith('1', {
      completed: true,
    });
  });
});
