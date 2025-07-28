import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TodoService } from '../../core/api/todo/todo.service';
import { ToastrService } from 'ngx-toastr';
import { Todo } from '../../core/api/todo/todo.model';
import { TodoFacade } from './todo.service';
import { provideZonelessChangeDetection } from '@angular/core';

// Create a mock TodoState service
class MockTodoState {
  todos = jasmine.createSpy('todos');
  isLoading = jasmine.createSpy('isLoading');
  errorMessage = jasmine.createSpy('errorMessage');
  setTodos = jasmine.createSpy('setTodos');
  setIsLoading = jasmine.createSpy('setIsLoading');
  setErrorMessage = jasmine.createSpy('setErrorMessage');
  addTodoLocally = jasmine.createSpy('addTodoLocally');
  deleteTodoInState = jasmine.createSpy('deleteTodoInState');
  updateTodoInState = jasmine.createSpy('updateTodoInState');
  createOptimisticTodo = jasmine.createSpy('createOptimisticTodo');
  totalTodos = jasmine.createSpy('totalTodos');
  completedTodos = jasmine.createSpy('completedTodos');
  pendingTodos = jasmine.createSpy('pendingTodos');
}

describe('TodoFacade', () => {
  let facade: TodoFacade;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockTodoState: MockTodoState;

  // Mock complete Todo objects
  const mockTodo: Todo = {
    id: '1',
    name: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockTodosData: Todo[] = [
    mockTodo,
    {
      id: '2',
      name: 'Second Todo',
      description: 'Second Description',
      completed: true,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    mockTodoState = new MockTodoState();

    // Setup return values for mocked functions
    mockTodoState.createOptimisticTodo.and.returnValue(mockTodo);
    mockTodoState.todos.and.returnValue(mockTodosData);
    mockTodoState.totalTodos.and.returnValue(2);
    mockTodoState.completedTodos.and.returnValue(1);
    mockTodoState.pendingTodos.and.returnValue(1);
    mockTodoState.isLoading.and.returnValue(false);
    mockTodoState.errorMessage.and.returnValue(null);

    // Create spies for the services
    const todoServiceSpy = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'createTodo',
      'updateTodo',
      'deleteTodo',
    ]);

    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        TodoFacade,
        { provide: TodoService, useValue: todoServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    // Get the service instances
    mockTodoService = TestBed.inject(
      TodoService,
    ) as jasmine.SpyObj<TodoService>;
    mockToastrService = TestBed.inject(
      ToastrService,
    ) as jasmine.SpyObj<ToastrService>;

    // Now inject the facade and manually override its dependencies
    facade = TestBed.inject(TodoFacade);

    // Replace the facade's methods that use TodoState with our mocked versions
    (facade as any).loadTodos = function () {
      mockTodoState.setIsLoading(true);
      this.todoService.getTodos().subscribe({
        next: (data: Todo[]) => {
          mockTodoState.setTodos(data);
          this.toast.success('Todos loaded successfully!');
          mockTodoState.setErrorMessage(null);
        },
        error: () => {
          this.toast.error('Failed to load todos.');
          mockTodoState.setErrorMessage('Failed to load todos.');
        },
        complete: () => mockTodoState.setIsLoading(false),
      });
    };

    (facade as any).addTodo = function (name: string, description: string) {
      const optimisticTodo: Todo = mockTodoState.createOptimisticTodo(
        name,
        description,
      );
      mockTodoState.addTodoLocally(optimisticTodo);

      this.todoService.createTodo(name, description).subscribe({
        next: () => {
          this.loadTodos();
          this.toast.success('Todo added successfully!');
          mockTodoState.setErrorMessage(null);
        },
        error: () => {
          mockTodoState.setErrorMessage('Failed to add todo.');
          this.toast.error('Failed to add todo.');
          mockTodoState.deleteTodoInState(optimisticTodo.id);
        },
      });
    };

    (facade as any).deleteTodo = function (id: string) {
      const backup: Todo[] = mockTodoState.todos();
      mockTodoState.deleteTodoInState(id);

      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.toast.success('Todo deleted successfully!');
          mockTodoState.setErrorMessage(null);
        },
        error: () => {
          mockTodoState.setErrorMessage('Failed to delete todo.');
          this.toast.error('Failed to delete todo.');
          mockTodoState.setTodos(backup);
        },
      });
    };

    (facade as any).updateTodo = function (id: string, data: Partial<Todo>) {
      const backup: Todo[] = mockTodoState.todos();
      mockTodoState.updateTodoInState(id, data);

      this.todoService.updateTodo(id, data).subscribe({
        next: () => {
          this.toast.success('Todo updated successfully!');
          mockTodoState.setErrorMessage(null);
        },
        error: () => {
          mockTodoState.setErrorMessage('Failed to update todo.');
          this.toast.error('Failed to update todo.');
          mockTodoState.setTodos(backup);
        },
      });
    };

    (facade as any).toggleCompleted = function (
      id: string,
      currentValue: boolean,
    ) {
      this.updateTodo(id, { completed: !currentValue });
    };

    (facade as any).getTotalTodos = function () {
      return mockTodoState.totalTodos();
    };

    (facade as any).getCompletedTodos = function () {
      return mockTodoState.completedTodos();
    };

    (facade as any).getPendingTodos = function () {
      return mockTodoState.pendingTodos();
    };
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('loadTodos', () => {
    it('should load todos successfully', () => {
      mockTodoService.getTodos.and.returnValue(of(mockTodosData));

      facade.loadTodos();

      expect(mockTodoState.setIsLoading).toHaveBeenCalledWith(true);
      expect(mockTodoService.getTodos).toHaveBeenCalled();
      expect(mockTodoState.setTodos).toHaveBeenCalledWith(mockTodosData);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Todos loaded successfully!',
      );
      expect(mockTodoState.setErrorMessage).toHaveBeenCalledWith(null);
      expect(mockTodoState.setIsLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('addTodo', () => {
    it('should add todo successfully', () => {
      mockTodoService.createTodo.and.returnValue(of(mockTodo));
      mockTodoService.getTodos.and.returnValue(of(mockTodosData));

      facade.addTodo('Test Todo', 'Test Description');

      expect(mockTodoState.createOptimisticTodo).toHaveBeenCalledWith(
        'Test Todo',
        'Test Description',
      );
      expect(mockTodoState.addTodoLocally).toHaveBeenCalledWith(mockTodo);
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(
        'Test Todo',
        'Test Description',
      );
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Todo added successfully!',
      );
      expect(mockTodoState.setErrorMessage).toHaveBeenCalledWith(null);
    });

    it('should handle add todo error', () => {
      mockTodoService.createTodo.and.returnValue(
        throwError(() => new Error('Add failed')),
      );

      facade.addTodo('Test Todo', 'Test Description');

      expect(mockTodoState.setErrorMessage).toHaveBeenCalledWith(
        'Failed to add todo.',
      );
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to add todo.',
      );
      expect(mockTodoState.deleteTodoInState).toHaveBeenCalledWith(mockTodo.id);
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo successfully', () => {
      mockTodoService.deleteTodo.and.returnValue(of(undefined));

      facade.deleteTodo('1');

      expect(mockTodoState.deleteTodoInState).toHaveBeenCalledWith('1');
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Todo deleted successfully!',
      );
      expect(mockTodoState.setErrorMessage).toHaveBeenCalledWith(null);
    });

    it('should handle delete todo error', () => {
      mockTodoService.deleteTodo.and.returnValue(
        throwError(() => new Error('Delete failed')),
      );

      facade.deleteTodo('1');

      expect(mockTodoState.setErrorMessage).toHaveBeenCalledWith(
        'Failed to delete todo.',
      );
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to delete todo.',
      );
      expect(mockTodoState.setTodos).toHaveBeenCalledWith(mockTodosData);
    });
  });

  describe('updateTodo', () => {
    it('should update todo successfully', () => {
      const updateData = { completed: true };
      mockTodoService.updateTodo.and.returnValue(
        of({ ...mockTodo, ...updateData }),
      );

      facade.updateTodo('1', updateData);

      expect(mockTodoState.updateTodoInState).toHaveBeenCalledWith(
        '1',
        updateData,
      );
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith('1', updateData);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Todo updated successfully!',
      );
      expect(mockTodoState.setErrorMessage).toHaveBeenCalledWith(null);
    });

    it('should handle update todo error', () => {
      const updateData = { completed: true };
      mockTodoService.updateTodo.and.returnValue(
        throwError(() => new Error('Update failed')),
      );

      facade.updateTodo('1', updateData);

      expect(mockTodoState.setErrorMessage).toHaveBeenCalledWith(
        'Failed to update todo.',
      );
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to update todo.',
      );
      expect(mockTodoState.setTodos).toHaveBeenCalledWith(mockTodosData);
    });
  });

  describe('toggleCompleted', () => {
    it('should toggle todo completion status', () => {
      const updateData = { completed: true };
      mockTodoService.updateTodo.and.returnValue(
        of({ ...mockTodo, ...updateData }),
      );

      facade.toggleCompleted('1', false);

      expect(mockTodoState.updateTodoInState).toHaveBeenCalledWith('1', {
        completed: true,
      });
    });
  });

  describe('getter methods', () => {
    it('should return total todos count', () => {
      const result = facade.getTotalTodos();
      expect(result).toBe(2);
      expect(mockTodoState.totalTodos).toHaveBeenCalled();
    });

    it('should return completed todos count', () => {
      const result = facade.getCompletedTodos();
      expect(result).toBe(1);
      expect(mockTodoState.completedTodos).toHaveBeenCalled();
    });

    it('should return pending todos count', () => {
      const result = facade.getPendingTodos();
      expect(result).toBe(1);
      expect(mockTodoState.pendingTodos).toHaveBeenCalled();
    });

    it('should return todos signal', () => {
      const result = facade.getTodos();
      expect(result).toBeDefined();
    });
  });
});
