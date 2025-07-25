import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TodoFacade } from '../../service/todo.service';
import { Router } from '@angular/router';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-create-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './create-todo.html',
})
export class TodoCreate {
  private fb: FormBuilder = inject(FormBuilder);
  private provider: TodoFacade = inject(TodoFacade);
  private router: Router = inject(Router);
  private toast: ToastService = inject(ToastService);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    dueDate: ['', Validators.required],
  });
  onSubmit(): void {
    if (this.form.invalid) {
      this.toast.show('Please fill out all fields correctly.', 'error');
      return;
    }
    const { name, description }: { name: string; description: string } =
      this.form.value;
    this.provider.addTodo(name, description);
    this.router.navigate(['/dashboard']);
  }
}
