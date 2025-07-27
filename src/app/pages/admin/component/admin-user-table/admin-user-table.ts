// admin-user-table.ts
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { User } from '../../../../core/api/auth/auth.model';
import { AdminFacade } from '../../../../service/admin.service';
import { ToastrService } from '../../../../service/toast.service';
@Component({
  selector: 'app-admin-user-table',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./admin-user-table.scss'],
  templateUrl: './admin-user-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserTable {
  private facade: AdminFacade = inject(AdminFacade);
  private toast: ToastrService = inject(ToastrService);
  readonly users: Signal<User[]> = this.facade.getUsers();

  onPromote(user: User): void {
    const userId: string | undefined = user._id || user.id;
    if (userId) this.facade.promoteUser(userId, user.username);
  }

  onDemote(user: User): void {
    const userId: string | undefined = user._id || user.id;
    if (userId) this.facade.demoteUser(userId, user.username);
  }

  onDelete(user: User): void {
    const userId: string | undefined = user._id || user.id;
    if (userId) this.facade.deleteUser(userId, user.username);
  }

  trackByUserId(index: number, user: User): string {
    return user.id ?? user.email ?? index.toString();
  }
}
