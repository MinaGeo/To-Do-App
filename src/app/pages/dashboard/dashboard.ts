import {
  Component,
  inject,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { TodoFacade } from '../../service/todo.service';
import { Todo } from '../../core/api/todo/todo.model';
import { DashboardStats } from './components/dashboard-stats/dashboard-stats';
import { AuthFacade } from '../../service/auth.service';
import { DashboardTodoList } from './components/dashboard-todo-list/dashboard-todo-list';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DashboardStats, DashboardTodoList],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly todoProvider: TodoFacade = inject(TodoFacade);
  private readonly userProvider: AuthFacade = inject(AuthFacade);
  readonly todoList: Signal<Todo[]> = this.todoProvider.getTodos();
  readonly username: Signal<string> = this.userProvider.getCurretUsername();

  onAdd(name: string, description: string): void {
    this.todoProvider.addTodo(name, description);
  }
}
