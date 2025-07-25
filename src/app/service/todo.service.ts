import { computed, Injectable, Signal } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  constructor(private readonly todoService: TodoService) {}
  readonly _todos: Signal<Todo[]> = computed(() => todos());

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
        setErrorMessage(null);
      },
      error: () => {
        setErrorMessage('Failed to load todos.');
      },
      complete: () => setIsLoading(false),
    });
  }

  addTodo(name: string, description: string): void {
    const optimisticTodo: Todo = createOptimisticTodo(name, description);
    addTodoLocally(optimisticTodo);

    this.todoService.createTodo(name, description).subscribe({
      next: () => this.loadTodos(),
      error: () => {
        setErrorMessage('Failed to add todo.');
        deleteTodoInState(optimisticTodo.id);
      },
    });
  }

  deleteTodo(id: string): void {
    const backup: Todo[] = todos();
    deleteTodoInState(id);

    this.todoService.deleteTodo(id).subscribe({
      error: () => {
        setErrorMessage('Failed to delete todo.');
        setTodos(backup);
      },
    });
  }

  updateTodo(id: string, data: Partial<Todo>): void {
    const backup: Todo[] = todos();
    updateTodoInState(id, data);

    this.todoService.updateTodo(id, data).subscribe({
      error: () => {
        setErrorMessage('Failed to update todo.');
        setTodos(backup);
      },
    });
  }

  toggleCompleted(id: string, currentValue: boolean): void {
    this.updateTodo(id, { completed: !currentValue });
  }
}
