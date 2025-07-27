import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';

@Component({
  selector: 'app-dashboard-stat-card-component',
  imports: [],
  templateUrl: './dashboard-stat-card-component.html',
  styleUrl: './dashboard-stat-card-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatCardComponent {
  title: InputSignal<string> = input.required();
  value: InputSignal<number> = input.required();
  icon: InputSignal<string> = input('');
}
