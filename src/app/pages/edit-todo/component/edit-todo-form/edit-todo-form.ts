import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Todo } from '../../../../core/api/todo/todo.model';
import { ToastrService } from 'ngx-toastr';

import { EditTodoFormModel } from '../../model/edit-todo.form';
import { TodoFacade } from '../../../../service/todo/todo.service';
@Component({
  selector: 'app-edit-todo-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-todo-form.html',
  styleUrl: './edit-todo-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTodoForm implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly provider: TodoFacade = inject(TodoFacade);
  private readonly toast: ToastrService = inject(ToastrService);

  form: EditTodoFormModel = {
    id: signal(''),
    name: signal(''),
    description: signal(''),
  };

  readonly todo: Signal<Todo | undefined> = computed(() => {
    const todos: Signal<Todo[]> = this.provider.getTodos();
    return todos().find((t: Todo) => t.id === this.form.id());
  });

  ngOnInit(): void {
    this.loadTodoFromRoute();
  }

  private loadTodoFromRoute(): void {
    this.form.id.set(this.route.snapshot.paramMap.get('id') ?? '');
    const todo: Todo | undefined = this.todo();

    if (!todo) {
      this.router.navigateByUrl('/');
    } else {
      this.form.name.set(todo.name);
      this.form.description.set(todo.description);
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      this.toast.error('Please fill out all fields correctly.');
      return;
    }

    this.provider.updateTodo(this.form.id(), {
      name: this.form.name(),
      description: this.form.description(),
    });

    this.router.navigateByUrl('/');
  }
}
