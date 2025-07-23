import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  WritableSignal,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodoProvider } from '../../service/todo.service';
import { todos } from '../../core/state-management/todo.state';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  private readonly provider: TodoProvider = inject(TodoProvider);

  id: string = '';
  name: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');

  todo: Signal<Todo | undefined> = computed(() =>
    todos().find((t: Todo) => t.id === this.id),
  );

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    const todo: Todo | undefined = this.todo();
    if (!todo) {
      this.router.navigateByUrl('/');
      return;
    }

    this.name.set(todo.name);
    this.description.set(todo.description);
  }

  onSubmit(): void {
    if (!this.name() || !this.description()) return;

    this.provider.updateTodo(this.id, {
      name: this.name(),
      description: this.description(),
    });

    this.router.navigateByUrl('/');
  }
}
