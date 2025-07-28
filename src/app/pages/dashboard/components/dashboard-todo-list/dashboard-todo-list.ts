import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Todo } from '../../../../core/api/todo/todo.model';
import { RouterLink } from '@angular/router';
import { Search } from '../../../../shared/search/search';
import { TodoFacade } from '../../../../service/todo.service';
import { AuthFacade } from '../../../../service/auth.service';

@Component({
  selector: 'app-dashboard-todo-list',
  imports: [RouterLink, Search],
  templateUrl: './dashboard-todo-list.html',
  styleUrl: './dashboard-todo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTodoList implements OnInit {
  private readonly todoProvider: TodoFacade = inject(TodoFacade);
  private readonly userProvider: AuthFacade = inject(AuthFacade);
  readonly todoList: Signal<Todo[]> = this.todoProvider.getTodos();
  readonly username: Signal<string> = this.userProvider.getCurretUsername();
  readonly search: WritableSignal<string> = signal<string>('');
  readonly filteredTodos: Signal<Todo[]> = computed(() =>
    this.todoList().filter(
      (todo: Todo) =>
        todo.name.toLowerCase().includes(this.search().toLowerCase()) ||
        todo.description?.toLowerCase().includes(this.search().toLowerCase()),
    ),
  );

  ngOnInit(): void {
    this.todoProvider.loadTodos();
  }

  onDelete(todoId: string): void {
    this.todoProvider.deleteTodo(todoId);
  }

  onUpdate(todoId: string, data: Partial<Todo>): void {
    this.todoProvider.updateTodo(todoId, data);
  }

  onToggleComplete(todo: Todo): void {
    this.todoProvider.updateTodo(todo.id, { completed: !todo.completed });
  }
}
