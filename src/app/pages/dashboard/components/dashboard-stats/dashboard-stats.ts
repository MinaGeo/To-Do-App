import {
  Component,
  computed,
  inject,
  Signal,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFacade } from '../../../../service/todo.service';
import { Todo } from '../../../../core/api/todo/todo.model';
import { DashboardStatCardComponent } from '../dashboard-stat-card-component/dashboard-stat-card-component';
@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, DashboardStatCardComponent],
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

  readonly statCards: Signal<
    { title: string; value: Signal<number>; icon: string }[]
  > = signal([
    { title: 'Total Todos', value: this.total, icon: '📝' },
    { title: 'Completed', value: this.completed, icon: '✅' },
    { title: 'Pending', value: this.pending, icon: '📌' },
  ]);
}
