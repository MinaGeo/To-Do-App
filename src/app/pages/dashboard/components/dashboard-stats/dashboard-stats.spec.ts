import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardStats } from './dashboard-stats';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Todo } from '../../../../core/api/todo/todo.model';
import { TodoFacade } from '../../../../service/todo/todo.service';

describe('DashboardStats', () => {
  let component: DashboardStats;
  let fixture: ComponentFixture<DashboardStats>;
  let mockTodoFacade: jasmine.SpyObj<TodoFacade>;
  let todosSignal: any;

  beforeEach(async () => {
    // Create initial todos data
    const initialTodos: Todo[] = [
      {
        id: '1',
        name: 'Test 1',
        description: 'Description 1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        completed: true,
      },
      {
        id: '2',
        name: 'Test 2',
        description: 'Description 2',
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        completed: true,
      },
      {
        id: '3',
        name: 'Test 3',
        description: 'Description 3',
        createdAt: '2023-01-03',
        updatedAt: '2023-01-03',
        completed: false,
      },
      {
        id: '4',
        name: 'Test 4',
        description: 'Description 4',
        createdAt: '2023-01-04',
        updatedAt: '2023-01-04',
        completed: false,
      },
      {
        id: '5',
        name: 'Test 5',
        description: 'Description 5',
        createdAt: '2023-01-05',
        updatedAt: '2023-01-05',
        completed: false,
      },
    ];

    todosSignal = signal(initialTodos);

    mockTodoFacade = jasmine.createSpyObj('TodoFacade', [
      'getTodos',
      'getTotalTodos',
      'getCompletedTodos',
      'getPendingTodos',
    ]);

    // Mock getTodos to return the signal
    mockTodoFacade.getTodos.and.returnValue(todosSignal);

    // Keep the other methods for backward compatibility (if needed elsewhere)
    mockTodoFacade.getTotalTodos.and.returnValue(5);
    mockTodoFacade.getCompletedTodos.and.returnValue(2);
    mockTodoFacade.getPendingTodos.and.returnValue(3);

    await TestBed.configureTestingModule({
      imports: [DashboardStats],
      providers: [
        { provide: TodoFacade, useValue: mockTodoFacade },
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get todos from TodoFacade', () => {
    expect(mockTodoFacade.getTodos).toHaveBeenCalled();
    expect(component.todos().length).toBe(5);
  });

  it('should calculate total todos correctly', () => {
    expect(component.total()).toBe(5);
  });

  it('should calculate completed todos correctly', () => {
    expect(component.completed()).toBe(2);
  });

  it('should calculate pending todos correctly', () => {
    expect(component.pending()).toBe(3);
  });

  it('should handle zero values', () => {
    // Update the signal with empty array
    todosSignal.set([]);
    fixture.detectChanges();

    expect(component.total()).toBe(0);
    expect(component.completed()).toBe(0);
    expect(component.pending()).toBe(0);
  });

  it('should handle large numbers', () => {
    // Create a large dataset
    const largeTodos: Todo[] = [];
    for (let i = 1; i <= 1000; i++) {
      largeTodos.push({
        id: i.toString(),
        name: `Todo ${i}`,
        description: `Description ${i}`,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        completed: i <= 750, // First 750 are completed
      });
    }

    todosSignal.set(largeTodos);
    fixture.detectChanges();

    expect(component.total()).toBe(1000);
    expect(component.completed()).toBe(750);
    expect(component.pending()).toBe(250);
  });

  it('should reactively update when TodoFacade values change', () => {
    // Initial state
    expect(component.total()).toBe(5);
    expect(component.completed()).toBe(2);
    expect(component.pending()).toBe(3);

    // Update the signal
    const newTodos: Todo[] = [
      {
        id: '1',
        name: 'Test 1',
        description: 'Description 1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        completed: true,
      },
      {
        id: '2',
        name: 'Test 2',
        description: 'Description 2',
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        completed: true,
      },
      {
        id: '3',
        name: 'Test 3',
        description: 'Description 3',
        createdAt: '2023-01-03',
        updatedAt: '2023-01-03',
        completed: true,
      },
      {
        id: '4',
        name: 'Test 4',
        description: 'Description 4',
        createdAt: '2023-01-04',
        updatedAt: '2023-01-04',
        completed: true,
      },
      {
        id: '5',
        name: 'Test 5',
        description: 'Description 5',
        createdAt: '2023-01-05',
        updatedAt: '2023-01-05',
        completed: false,
      },
      {
        id: '6',
        name: 'Test 6',
        description: 'Description 6',
        createdAt: '2023-01-06',
        updatedAt: '2023-01-06',
        completed: false,
      },
      {
        id: '7',
        name: 'Test 7',
        description: 'Description 7',
        createdAt: '2023-01-07',
        updatedAt: '2023-01-07',
        completed: false,
      },
    ];

    todosSignal.set(newTodos);
    fixture.detectChanges();

    // Values should now be reactive and updated
    expect(component.total()).toBe(7);
    expect(component.completed()).toBe(4);
    expect(component.pending()).toBe(3);
  });

  it('should handle all todos completed scenario', () => {
    const allCompletedTodos: Todo[] = [
      {
        id: '1',
        name: 'Test 1',
        description: 'Description 1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        completed: true,
      },
      {
        id: '2',
        name: 'Test 2',
        description: 'Description 2',
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        completed: true,
      },
      {
        id: '3',
        name: 'Test 3',
        description: 'Description 3',
        createdAt: '2023-01-03',
        updatedAt: '2023-01-03',
        completed: true,
      },
      {
        id: '4',
        name: 'Test 4',
        description: 'Description 4',
        createdAt: '2023-01-04',
        updatedAt: '2023-01-04',
        completed: true,
      },
      {
        id: '5',
        name: 'Test 5',
        description: 'Description 5',
        createdAt: '2023-01-05',
        updatedAt: '2023-01-05',
        completed: true,
      },
    ];

    todosSignal.set(allCompletedTodos);
    fixture.detectChanges();

    expect(component.total()).toBe(5);
    expect(component.completed()).toBe(5);
    expect(component.pending()).toBe(0);
  });

  it('should handle all todos pending scenario', () => {
    const allPendingTodos: Todo[] = [
      {
        id: '1',
        name: 'Test 1',
        description: 'Description 1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        completed: false,
      },
      {
        id: '2',
        name: 'Test 2',
        description: 'Description 2',
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
        completed: false,
      },
      {
        id: '3',
        name: 'Test 3',
        description: 'Description 3',
        createdAt: '2023-01-03',
        updatedAt: '2023-01-03',
        completed: false,
      },
      {
        id: '4',
        name: 'Test 4',
        description: 'Description 4',
        createdAt: '2023-01-04',
        updatedAt: '2023-01-04',
        completed: false,
      },
      {
        id: '5',
        name: 'Test 5',
        description: 'Description 5',
        createdAt: '2023-01-05',
        updatedAt: '2023-01-05',
        completed: false,
      },
    ];

    todosSignal.set(allPendingTodos);
    fixture.detectChanges();

    expect(component.total()).toBe(5);
    expect(component.completed()).toBe(0);
    expect(component.pending()).toBe(5);
  });
});
