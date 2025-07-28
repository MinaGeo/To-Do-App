import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AdminApiService } from '../../core/api/admin/admin.api';
import { User } from '../../core/api/auth/auth.model';
import { ToastrService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class AdminFacade {
  private api: AdminApiService = inject(AdminApiService);
  private usersSignal: WritableSignal<User[]> = signal<User[]>([]);
  private readonly toast: ToastrService = inject(ToastrService);
  users: Signal<User[]> = computed(() => this.usersSignal());

  loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (res: User[]) => this.usersSignal.set(res),
      error: () => this.toast.error('Failed to load users.'),
    });
  }
  getUsers(): Signal<User[]> {
    return this.users;
  }

  promoteUser(id: string, username?: string): void {
    this.api.promote(id).subscribe({
      next: () => {
        this.toast.success(`${username ?? 'User'} promoted to admin.`);
        this.loadUsers();
      },
      error: () => this.toast.error('Failed to promote user.'),
    });
  }

  demoteUser(id: string, username?: string): void {
    this.api.demote(id).subscribe({
      next: () => {
        this.toast.success(`${username ?? 'User'} demoted to user.`);
        this.loadUsers();
      },
      error: () => this.toast.error('Failed to demote user.'),
    });
  }

  deleteUser(id: string, username?: string): void {
    this.api.delete(id).subscribe({
      next: () => {
        this.toast.success(`${username ?? 'User'} deleted successfully.`);
        this.loadUsers();
      },
      error: () => this.toast.error('Failed to delete user.'),
    });
  }
}
