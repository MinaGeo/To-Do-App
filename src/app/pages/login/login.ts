import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthFacade } from '../../service/auth.service';
import { LoginRequest } from '../../core/api/auth/auth.model';

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

  errorMsg: string = '';

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, password }: { username: string; password: string } =
      this.form.value;

    const loginRequest: LoginRequest = {
      username: username ?? '',
      password: password ?? '',
    };

    this.auth.login(loginRequest).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.errorMsg = 'Invalid username or password';
      },
    });
  }
}
