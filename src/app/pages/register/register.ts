import {
  Component,
  inject,
  ChangeDetectionStrategy,
  effect,
  Signal,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterFormValue } from './models/register.model';
import { AuthFacade } from '../../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly auth: AuthFacade = inject(AuthFacade);
  private readonly router: Router = inject(Router);
  form: FormGroup = this.fb.group({
    username: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/),
    ]),
    confirmPassword: new FormControl<string>('', Validators.required),
  });

  error: Signal<string | null> = this.auth.getError();
  loading: Signal<boolean> = this.auth.isLoading();

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()()) {
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const {
      username = '',
      email = '',
      password = '',
      confirmPassword = '',
    }: RegisterFormValue & { email: string } = this.form.value;

    if (!this.passwordsMatch(password, confirmPassword)) {
      this.auth.setError('Passwords do not match');
      return;
    }

    this.auth.register({ username, password, email });
  }

  private passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  get f(): Record<string, FormControl<string>> {
    return this.form.controls as Record<string, FormControl<string>>;
  }
}
