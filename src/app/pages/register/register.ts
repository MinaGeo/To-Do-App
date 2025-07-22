import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthFacade } from '../../service/auth.service';
import { RegisterRequest } from '../../core/api/auth/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb: FormBuilder = inject(FormBuilder);
  private auth: AuthFacade = inject(AuthFacade);
  private router: Router = inject(Router);

  form: FormGroup = this.fb.group({
    username: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/),
    ]),
    confirmPassword: new FormControl<string>('', Validators.required),
  });

  errorMsg: string = '';

  onSubmit(): void {
    if (this.form.invalid) return;

    const {
      username,
      password,
      confirmPassword,
    }: { username: string; password: string; confirmPassword: string } =
      this.form.value;

    if (password !== confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }

    const registerRequest: RegisterRequest = {
      username: username ?? '',
      password: password ?? '',
    };

    this.auth.register(registerRequest).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        // Optionally use a logger service here
      },
      error: (err: unknown) => {
        const errorResponse: HttpErrorResponse = err as HttpErrorResponse;
        this.errorMsg =
          errorResponse.error?.message || 'Registration failed. Try again.';
      },
    });
  }

  get f(): typeof this.form.controls {
    return this.form.controls;
  }
}
