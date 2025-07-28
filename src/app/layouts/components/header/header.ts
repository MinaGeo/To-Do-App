import {
  Component,
  ChangeDetectionStrategy,
  inject,
  Signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/api/auth/auth.model';
import { AuthFacade } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private auth: AuthFacade = inject(AuthFacade);
  private router: Router = inject(Router);

  get isLoggedIn(): Signal<boolean> {
    return this.auth.isAuthenticated();
  }

  get user(): Signal<User | null> {
    return this.auth.getCurrentUser();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
