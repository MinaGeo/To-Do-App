import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodoFacade } from '../../service/todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Todo } from '../../core/api/todo/todo.model';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-todo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTodoPage implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly provider: TodoFacade = inject(TodoFacade);

  id: WritableSignal<string> = signal('');
  name: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');

  readonly todo: Signal<Todo | undefined> = computed(() => {
    const todos: Signal<Todo[]> = this.provider.getTodos();
    return todos().find((t: Todo) => t.id === this.id());
  });

  ngOnInit(): void {
    this.id.set(this.route.snapshot.paramMap.get('id') ?? '');
    const todo: Todo | undefined = this.todo();

    if (!todo) {
      this.router.navigateByUrl('/');
      return;
    }

    this.name.set(todo.name);
    this.description.set(todo.description);
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    this.provider.updateTodo(this.id(), {
      name: this.name(),
      description: this.description(),
    });

    this.router.navigateByUrl('/');
  }
}
