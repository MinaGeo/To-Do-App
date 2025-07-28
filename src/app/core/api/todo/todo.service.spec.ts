import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo, TodoResponse } from './todo.model';
import { environment } from '../../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map todos', () => {
    const mockResponse: TodoResponse[] = [
      {
        _id: '1',
        name: 'Test Todo',
        description: 'Do something',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        completed: false,
      },
    ];

    const expectedTodos = [
      {
        _id: '1',
        id: '1',
        name: 'Test Todo',
        description: 'Do something',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        completed: false,
      },
    ];

    service.getTodos().subscribe((todos) => {
      expect(todos).toEqual(expectedTodos);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a todo', () => {
    const name = 'New Todo';
    const description = 'Description for new todo';

    const mockTodo: Todo = {
      id: '2',
      name,
      description,
      createdAt: '2023-07-27',
      updatedAt: '2023-07-27',
      completed: false,
    };

    service.createTodo(name, description).subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name, description });
    req.flush(mockTodo);
  });

  it('should update a todo', () => {
    const id = '3';
    const update: Partial<Todo> = { completed: true };

    const mockUpdated: Todo = {
      id,
      name: 'Updated Todo',
      description: 'Updated description',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-03',
      completed: true,
    };

    service.updateTodo(id, update).subscribe((todo) => {
      expect(todo).toEqual(mockUpdated);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(update);
    req.flush(mockUpdated);
  });

  it('should delete a todo', () => {
    const id = '4';

    service.deleteTodo(id).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
