import { WritableSignal } from '@angular/core';

export interface EditTodoFormModel {
  id: WritableSignal<string>;
  name: WritableSignal<string>;
  description: WritableSignal<string>;
}
