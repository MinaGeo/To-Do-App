import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard';
import { TodoProvider } from '../../service/todo.service';
import { Todo } from '../../core/api/todo/todo.model';
import { setTodos } from '../../core/state-management/todo.state';
import { setAuthData } from '../../core/state-management/auth.state';
import { AuthenticationResponse } from '../../core/api/auth/auth.model';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let mockTodoProvider: jasmine.SpyObj<TodoProvider>;

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
    {
      id: '3',
      name: 'Test Todo 3',
      description: 'Description 3',
      completed: false,
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z',
    },
  ];

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockTodoProvider = jasmine.createSpyObj('TodoProvider', [
      'loadTodos',
      'addTodo',
      'deleteTodo',
      'updateTodo',
    ]);

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([
          { path: '', component: {} as any },
          { path: 'edit/:id', component: {} as any },
        ]),
        { provide: TodoProvider, useValue: mockTodoProvider },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;

    // Reset state before each test
    setTodos([]);
    setAuthData(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTodos on ngOnInit', () => {
    component.ngOnInit();

    expect(mockTodoProvider.loadTodos).toHaveBeenCalled();
  });

  it('should display correct todo list from computed signal', () => {
    setTodos(mockTodos);

    expect(component.todoList()).toEqual(mockTodos);
    expect(component.todoList().length).toBe(3);
  });

  it('should display correct total todos count', () => {
    setTodos(mockTodos);

    expect(component.totalTodos()).toBe(3);
  });

  it('should display correct completed todos count', () => {
    setTodos(mockTodos);

    expect(component.completedTodos()).toBe(1);
  });

  it('should display correct pending todos count', () => {
    setTodos(mockTodos);

    expect(component.pendingTodos()).toBe(2);
  });

  it('should display "Guest" when no user is set', () => {
    expect(component.username()).toBe('Guest');
  });

  it('should display username when user is set', () => {
    const authResponse: AuthenticationResponse = {
      access_token: 'mock-token',
      user: { id: '1', username: 'testuser' },
    };
    setAuthData(authResponse);

    expect(component.username()).toBe('testuser');
  });

  it('should call addTodo with correct parameters', () => {
    const name = 'New Todo';
    const description = 'New Description';

    component.onAdd(name, description);

    expect(mockTodoProvider.addTodo).toHaveBeenCalledWith(name, description);
  });

  it('should call deleteTodo with correct todoId', () => {
    const todoId = '123';

    component.onDelete(todoId);

    expect(mockTodoProvider.deleteTodo).toHaveBeenCalledWith(todoId);
  });

  it('should call updateTodo with correct parameters', () => {
    const todoId = '123';
    const updateData: Partial<Todo> = { name: 'Updated Name' };

    component.onUpdate(todoId, updateData);

    expect(mockTodoProvider.updateTodo).toHaveBeenCalledWith(
      todoId,
      updateData,
    );
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

    expect(mockTodoProvider.updateTodo).toHaveBeenCalledWith('1', {
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

    expect(mockTodoProvider.updateTodo).toHaveBeenCalledWith('1', {
      completed: false,
    });
  });

  it('should handle empty todo list', () => {
    setTodos([]);

    expect(component.todoList()).toEqual([]);
    expect(component.totalTodos()).toBe(0);
    expect(component.completedTodos()).toBe(0);
    expect(component.pendingTodos()).toBe(0);
  });

  it('should handle all todos completed', () => {
    const allCompletedTodos: Todo[] = [
      {
        id: '1',
        name: 'Todo 1',
        description: 'Description 1',
        completed: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        name: 'Todo 2',
        description: 'Description 2',
        completed: true,
        createdAt: '2024-01-02T10:00:00Z',
        updatedAt: '2024-01-02T10:00:00Z',
      },
    ];

    setTodos(allCompletedTodos);

    expect(component.totalTodos()).toBe(2);
    expect(component.completedTodos()).toBe(2);
    expect(component.pendingTodos()).toBe(0);
  });

  it('should handle all todos pending', () => {
    const allPendingTodos: Todo[] = [
      {
        id: '1',
        name: 'Todo 1',
        description: 'Description 1',
        completed: false,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        name: 'Todo 2',
        description: 'Description 2',
        completed: false,
        createdAt: '2024-01-02T10:00:00Z',
        updatedAt: '2024-01-02T10:00:00Z',
      },
    ];

    setTodos(allPendingTodos);

    expect(component.totalTodos()).toBe(2);
    expect(component.completedTodos()).toBe(0);
    expect(component.pendingTodos()).toBe(2);
  });

  it('should handle todos without completed property as pending', () => {
    const todosWithoutCompleted: Todo[] = [
      {
        id: '1',
        name: 'Todo 1',
        description: 'Description 1',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        name: 'Todo 2',
        description: 'Description 2',
        createdAt: '2024-01-02T10:00:00Z',
        updatedAt: '2024-01-02T10:00:00Z',
      },
    ];

    setTodos(todosWithoutCompleted);

    expect(component.totalTodos()).toBe(2);
    expect(component.completedTodos()).toBe(0);
    expect(component.pendingTodos()).toBe(2);
  });

  it('should toggle todo completion when completed is undefined', () => {
    const todo: Todo = {
      id: '1',
      name: 'Test Todo',
      description: 'Test Description',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    };

    component.onToggleComplete(todo);

    expect(mockTodoProvider.updateTodo).toHaveBeenCalledWith('1', {
      completed: true,
    });
  });

  it('should handle user with undefined username', () => {
    setAuthData({
      access_token: '',
      user: { id: '1', username: undefined as any },
    });

    expect(component.username()).toBe('Guest');
  });

  it('should handle user with null username', () => {
    setAuthData({
      access_token: '',
      user: { id: '1', username: null as any },
    });

    expect(component.username()).toBe('Guest');
  });

  it('should handle user with empty string username', () => {
    setAuthData({
      access_token: 'mock-token',
      user: { id: '1', username: '' },
    });

    expect(component.username()).toBe('Guest');
  });

  it('should call onAdd with empty strings', () => {
    component.onAdd('', '');
    expect(mockTodoProvider.addTodo).toHaveBeenCalledWith('', '');
  });

  it('should call onDelete with empty string id', () => {
    component.onDelete('');

    expect(mockTodoProvider.deleteTodo).toHaveBeenCalledWith('');
  });

  it('should call onUpdate with empty object', () => {
    component.onUpdate('123', {});

    expect(mockTodoProvider.updateTodo).toHaveBeenCalledWith('123', {});
  });

  it('should call onUpdate with multiple properties', () => {
    const updateData: Partial<Todo> = {
      name: 'Updated Name',
      description: 'Updated Description',
      completed: true,
    };

    component.onUpdate('123', updateData);

    expect(mockTodoProvider.updateTodo).toHaveBeenCalledWith('123', updateData);
  });

  it('should reactively update when todos state changes', () => {
    // Initial state
    expect(component.todoList()).toEqual([]);

    // Update state
    setTodos(mockTodos);

    // Should reflect new state
    expect(component.todoList()).toEqual(mockTodos);
    expect(component.totalTodos()).toBe(3);
  });

  it('should reactively update when user state changes', () => {
    // Initial state
    expect(component.username()).toBe('Guest');

    // Update user state
    const authResponse: AuthenticationResponse = {
      access_token: 'mock-token',
      user: { id: '1', username: 'newuser' },
    };
    setAuthData(authResponse);

    // Should reflect new state
    expect(component.username()).toBe('newuser');
  });
});
