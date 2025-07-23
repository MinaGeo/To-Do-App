import { Injectable } from '@angular/core';
import { TodoService } from '../core/api/todo/todo.service';
import {
  todos,
  setTodos,
  setIsLoading,
  setErrorMessage,
} from '../core/state-management/todo.state';
import { Todo } from '../core/api/todo/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoProvider {
  constructor(private readonly todoService: TodoService) {}

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
    const optimisticTodo: Todo = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTodos([...todos(), optimisticTodo]);

    this.todoService.createTodo(name, description).subscribe({
      next: (realTodo: Todo) => {
        setTodos(
          todos().map((t: Todo) => (t.id === optimisticTodo.id ? realTodo : t)),
        );
      },
      error: () => {
        setErrorMessage('Failed to add todo.');
        setTodos(todos().filter((t: Todo) => t.id !== optimisticTodo.id));
      },
    });
  }

  deleteTodo(id: string): void {
    const backup: Todo[] = todos();

    setTodos(todos().filter((t: Todo) => t.id !== id));

    this.todoService.deleteTodo(id).subscribe({
      error: () => {
        setErrorMessage('Failed to delete todo.');
        setTodos(backup);
      },
    });
  }

  updateTodo(id: string, data: Partial<Todo>): void {
    const backup: Todo[] = todos();

    setTodos(
      todos().map((t: Todo) =>
        t.id === id
          ? { ...t, ...data, updatedAt: new Date().toISOString() }
          : t,
      ),
    );

    this.todoService.updateTodo(id, data).subscribe({
      error: () => {
        setErrorMessage('Failed to update todo.');
        setTodos(backup);
      },
    });
  }
}
