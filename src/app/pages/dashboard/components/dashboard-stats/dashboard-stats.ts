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
import { DashboardStatCardComponent } from '../dashboard-stat-card-component/dashboard-stat-card-component';
import {
  DASHBOARD_STAT_CARDS,
  StatCardKey,
  StatCardVM,
} from './model/dashboard-stats.model';
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

  private readonly valueMap: Record<StatCardKey, Signal<number>> = {
    [StatCardKey.Total]: this.total,
    [StatCardKey.Completed]: this.completed,
    [StatCardKey.Pending]: this.pending,
  };

  readonly statCards: Signal<StatCardVM[]> = computed(() =>
    DASHBOARD_STAT_CARDS.map(({ title, icon, key }) => ({
      title,
      icon,
      value: this.valueMap[key],
    })),
  );
}
