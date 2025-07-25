import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter: number = 0;

  private _toasts: WritableSignal<Toast[]> = signal<Toast[]>([]);
  readonly toasts: Signal<Toast[]> = this._toasts.asReadonly();

  show(message: string, type: Toast['type'] = 'info'): void {
    const toast: Toast = { id: this.counter++, message, type };
    this._toasts.update((toasts: Toast[]) => [...toasts, toast]);

    setTimeout(() => this.remove(toast.id), 4000);
  }

  remove(id: number): void {
    this._toasts.update((toasts: Toast[]) =>
      toasts.filter((t: Toast) => t.id !== id),
    );
  }
}
