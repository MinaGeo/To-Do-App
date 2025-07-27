import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditTodoForm } from './component/edit-todo-form/edit-todo-form';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, EditTodoForm],
  templateUrl: './edit-todo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTodoPage {}
