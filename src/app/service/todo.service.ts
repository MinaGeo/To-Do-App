import { computed, inject, Injectable, Signal } from '@angular/core';
import { TodoService } from '../core/api/todo/todo.service';
import {
  todos,
  setTodos,
  setIsLoading,
  setErrorMessage,
  addTodoLocally,
  deleteTodoInState,
  updateTodoInState,
  totalTodos,
  completedTodos,
  pendingTodos,
  createOptimisticTodo,
} from '../core/state-management/todo.state';
import { Todo } from '../core/api/todo/todo.model';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  constructor(private readonly todoService: TodoService) {}
  readonly _todos: Signal<Todo[]> = computed(() => todos());
  private readonly toast: ToastService = inject(ToastService);

  getTotalTodos(): number {
    return totalTodos();
  }
  getCompletedTodos(): number {
    return completedTodos();
  }
  getPendingTodos(): number {
    return pendingTodos();
  }

  getTodos(): Signal<Todo[]> {
    return this._todos;
  }

  loadTodos(): void {
    setIsLoading(true);
    this.todoService.getTodos().subscribe({
      next: (data: Todo[]) => {
        setTodos(data);
        this.toast.show('Todos loaded successfully!', 'success');
        setErrorMessage(null);
      },
      error: () => {
        this.toast.show('Failed to load todos.', 'error');
        setErrorMessage('Failed to load todos.');
      },
      complete: () => setIsLoading(false),
    });
  }

  addTodo(name: string, description: string): void {
    const optimisticTodo: Todo = createOptimisticTodo(name, description);
    addTodoLocally(optimisticTodo);

    this.todoService.createTodo(name, description).subscribe({
      next: () => {
        this.loadTodos();
        this.toast.show('Todo added successfully!', 'success');
        setErrorMessage(null);
      },
      error: () => {
        setErrorMessage('Failed to add todo.');
        this.toast.show('Failed to add todo.', 'error');
        deleteTodoInState(optimisticTodo.id);
      },
    });
  }

  deleteTodo(id: string): void {
    const backup: Todo[] = todos();
    deleteTodoInState(id);

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.toast.show('Todo deleted successfully!', 'success');
        setErrorMessage(null);
      },
      error: () => {
        setErrorMessage('Failed to delete todo.');
        this.toast.show('Failed to delete todo.', 'error');
        setTodos(backup);
      },
    });
  }

  updateTodo(id: string, data: Partial<Todo>): void {
    const backup: Todo[] = todos();
    updateTodoInState(id, data);

    this.todoService.updateTodo(id, data).subscribe({
      next: () => {
        this.toast.show('Todo updated successfully!', 'success');
        setErrorMessage(null);
      },
      error: () => {
        setErrorMessage('Failed to update todo.');
        this.toast.show('Failed to update todo.', 'error');
        setTodos(backup);
      },
    });
  }

  toggleCompleted(id: string, currentValue: boolean): void {
    this.updateTodo(id, { completed: !currentValue });
  }
}
