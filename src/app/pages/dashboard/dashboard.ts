import {
  Component,
  OnInit,
  computed,
  inject,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  todos,
  totalTodos,
  completedTodos,
  pendingTodos,
} from '../../core/state-management/todo.state';
import { user } from '../../core/state-management/auth.state';

import { TodoProvider } from '../../service/todo.service';
import { Todo } from '../../core/api/todo/todo.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly provider: TodoProvider = inject(TodoProvider);

  readonly todoList: Signal<Todo[]> = computed(() => todos());
  readonly totalTodos: Signal<number> = computed(() => totalTodos());
  readonly completedTodos: Signal<number> = computed(() => completedTodos());
  readonly pendingTodos: Signal<number> = computed(() => pendingTodos());
  readonly username: Signal<string> = computed(
    () => user()?.username?.trim() || 'Guest',
  );

  ngOnInit(): void {
    this.provider.loadTodos();
  }

  onAdd(name: string, description: string): void {
    this.provider.addTodo(name, description);
  }

  onDelete(todoId: string): void {
    this.provider.deleteTodo(todoId);
  }

  onUpdate(todoId: string, data: Partial<Todo>): void {
    this.provider.updateTodo(todoId, data);
  }

  onToggleComplete(todo: Todo): void {
    this.provider.updateTodo(todo.id, { completed: !todo.completed });
  }
}
