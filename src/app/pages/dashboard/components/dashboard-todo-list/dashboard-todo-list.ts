import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { TodoFacade } from '../../../../service/todo.service';
import { AuthFacade } from '../../../../service/auth.service';
import { Todo } from '../../../../core/api/todo/todo.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-todo-list',
  imports: [RouterLink],
  templateUrl: './dashboard-todo-list.html',
  styleUrl: './dashboard-todo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTodoList implements OnInit {
  private readonly todoProvider: TodoFacade = inject(TodoFacade);
  private readonly userProvider: AuthFacade = inject(AuthFacade);
  readonly todoList: Signal<Todo[]> = this.todoProvider.getTodos();
  readonly username: Signal<string> = this.userProvider.getCurretUsername();

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
