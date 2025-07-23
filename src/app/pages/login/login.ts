import {
  ChangeDetectionStrategy,
  Component,
  inject,
  effect,
  Signal,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthFacade } from '../../service/auth.service';
import { LoginModel } from './models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly auth: AuthFacade = inject(AuthFacade);
  private readonly router: Router = inject(Router);

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  error: Signal<string | null> = this.auth.getError();
  loading: Signal<boolean> = this.auth.isLoading();

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, password }: LoginModel = this.form.value;
    this.auth.login({ username: username ?? '', password: password ?? '' });
  }
}
