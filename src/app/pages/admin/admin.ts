import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AdminUserTable } from './component/admin-user-table/admin-user-table';
import { AdminFacade } from '../../service/admin/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminUserTable],
  templateUrl: './admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPage implements OnInit {
  private facade: AdminFacade = inject(AdminFacade);

  ngOnInit(): void {
    this.facade.loadUsers();
  }
}
