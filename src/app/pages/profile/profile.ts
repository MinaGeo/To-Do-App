import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../../service/auth.service';
import { RouterModule } from '@angular/router';
import { User } from '../../core/api/auth/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  private auth: AuthFacade = inject(AuthFacade);

  readonly user: Signal<User | null> = this.auth.getCurrentUser();

  readonly logout: () => void = () => this.auth.logout();
}
