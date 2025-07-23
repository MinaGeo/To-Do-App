import { signal, computed, WritableSignal, Signal } from '@angular/core';
import { Todo } from '../api/todo/todo.model';

// SIGNALS
const _todos: WritableSignal<Todo[]> = signal<Todo[]>([]);
const _isLoading: WritableSignal<boolean> = signal(false);
const _errorMessage: WritableSignal<string | null> = signal<string | null>(
  null,
);

// GETTERS
export const todos: () => Todo[] = () => _todos();
export const isLoading: () => boolean = () => _isLoading();
export const errorMessage: () => string | null = () => _errorMessage();

// SETTERS
export const setTodos: (newTodos: Todo[]) => void = (newTodos: Todo[]) =>
  _todos.set(newTodos);
export const setIsLoading: (value: boolean) => void = (value: boolean) =>
  _isLoading.set(value);
export const setErrorMessage: (message: string | null) => void = (
  message: string | null,
) => _errorMessage.set(message);

// COMPUTED
export const totalTodos: Signal<number> = computed(() => _todos().length);

export const completedTodos: Signal<number> = computed(
  () => _todos().filter((t: Todo) => t.completed).length,
);

export const pendingTodos: Signal<number> = computed(
  () => _todos().filter((t: Todo) => !t.completed).length,
);
