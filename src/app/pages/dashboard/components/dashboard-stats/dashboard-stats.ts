import {
  Component,
  computed,
  inject,
  Signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFacade } from '../../../../service/todo.service';
import { Todo } from '../../../../core/api/todo/todo.model';
@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stats.html',
  styleUrls: ['./dashboard-stats.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStats {
  private readonly provider: TodoFacade = inject(TodoFacade);

  readonly todos: Signal<Todo[]> = this.provider.getTodos(); // the signal itself

  readonly total: Signal<number> = computed(() => this.todos().length);
  readonly completed: Signal<number> = computed(
    () => this.todos().filter((t: Todo) => t.completed).length,
  );
  readonly pending: Signal<number> = computed(
    () => this.todos().filter((t: Todo) => !t.completed).length,
  );
}
