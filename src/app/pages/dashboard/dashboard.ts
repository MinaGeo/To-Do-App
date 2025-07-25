import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { TodoFacade } from '../../service/todo.service';
import { Todo } from '../../core/api/todo/todo.model';
import { DashboardStats } from './components/dashboard-stats/dashboard-stats';
import { AuthFacade } from '../../service/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DashboardStats],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly todoProvider: TodoFacade = inject(TodoFacade);
  private readonly userProvider: AuthFacade = inject(AuthFacade);
  readonly todoList: Signal<Todo[]> = this.todoProvider.getTodos();
  readonly username: Signal<string> = this.userProvider.getCurretUsername();

  ngOnInit(): void {
    this.todoProvider.loadTodos();
  }

  onAdd(name: string, description: string): void {
    this.todoProvider.addTodo(name, description);
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
