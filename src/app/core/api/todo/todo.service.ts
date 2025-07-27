import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo, TodoResponse } from './todo.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly baseUrl: string = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}
  getTodos(): Observable<Todo[]> {
    return this.http.get<TodoResponse[]>(this.baseUrl).pipe(
      map((todos: TodoResponse[]): Todo[] =>
        todos.map(
          (todo: TodoResponse): Todo => ({
            ...todo,
            id: todo._id,
          }),
        ),
      ),
    );
  }

  createTodo(name: string, description: string): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, { name, description });
  }

  updateTodo(id: string, data: Partial<Todo>): Observable<Todo> {
    return this.http.patch<Todo>(`${this.baseUrl}/${id}`, data);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
