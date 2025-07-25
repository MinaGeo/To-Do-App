import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AdminApiService } from '../core/api/admin/admin.api';
import { User } from '../core/api/auth/auth.model';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class AdminFacade {
  private api: AdminApiService = inject(AdminApiService);
  private usersSignal: WritableSignal<User[]> = signal<User[]>([]);
  private readonly toast: ToastService = inject(ToastService);
  users: Signal<User[]> = computed(() => this.usersSignal());

  loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (res: User[]) => this.usersSignal.set(res),
      error: () => this.toast.show('Failed to load users.', 'error'),
    });
  }
  getUsers(): Signal<User[]> {
    return this.users;
  }

  promoteUser(id: string, username?: string): void {
    this.api.promote(id).subscribe({
      next: () => {
        this.toast.show(`${username ?? 'User'} promoted to admin.`, 'success');
        this.loadUsers();
      },
      error: () => this.toast.show('Failed to promote user.', 'error'),
    });
  }

  demoteUser(id: string, username?: string): void {
    this.api.demote(id).subscribe({
      next: () => {
        this.toast.show(`${username ?? 'User'} demoted to user.`, 'success');
        this.loadUsers();
      },
      error: () => this.toast.show('Failed to demote user.', 'error'),
    });
  }

  deleteUser(id: string, username?: string): void {
    this.api.delete(id).subscribe({
      next: () => {
        this.toast.show(
          `${username ?? 'User'} deleted successfully.`,
          'success',
        );
        this.loadUsers();
      },
      error: () => this.toast.show('Failed to delete user.', 'error'),
    });
  }
}
