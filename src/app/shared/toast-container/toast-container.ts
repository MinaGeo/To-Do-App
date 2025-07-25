import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { Toast, ToastService } from '../../service/toast.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  readonly service: ToastService = inject(ToastService);
  readonly toasts: Signal<Toast[]> = this.service.toasts;
}
