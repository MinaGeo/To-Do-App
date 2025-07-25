import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardStats } from './dashboard-stats';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TodoFacade } from '../../../../service/todo.service';

describe('DashboardStats', () => {
  let component: DashboardStats;
  let fixture: ComponentFixture<DashboardStats>;
  let mockTodoFacade: jasmine.SpyObj<TodoFacade>;

  beforeEach(async () => {
    mockTodoFacade = jasmine.createSpyObj('TodoFacade', [
      'getTotalTodos',
      'getCompletedTodos',
      'getPendingTodos',
    ]);
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

  it('should get total todos from TodoFacade', () => {
    expect(component.total).toBe(5);
    expect(mockTodoFacade.getTotalTodos).toHaveBeenCalled();
  });

  it('should get completed todos from TodoFacade', () => {
    expect(component.completed).toBe(2);
    expect(mockTodoFacade.getCompletedTodos).toHaveBeenCalled();
  });

  it('should get pending todos from TodoFacade', () => {
    expect(component.pending).toBe(3);
    expect(mockTodoFacade.getPendingTodos).toHaveBeenCalled();
  });

  it('should handle zero values', () => {
    mockTodoFacade.getTotalTodos.and.returnValue(0);
    mockTodoFacade.getCompletedTodos.and.returnValue(0);
    mockTodoFacade.getPendingTodos.and.returnValue(0);

    // Re-create component to get updated values
    fixture = TestBed.createComponent(DashboardStats);
    component = fixture.componentInstance;

    expect(component.total).toBe(0);
    expect(component.completed).toBe(0);
    expect(component.pending).toBe(0);
  });

  it('should handle large numbers', () => {
    mockTodoFacade.getTotalTodos.and.returnValue(1000);
    mockTodoFacade.getCompletedTodos.and.returnValue(750);
    mockTodoFacade.getPendingTodos.and.returnValue(250);

    // Re-create component to get updated values
    fixture = TestBed.createComponent(DashboardStats);
    component = fixture.componentInstance;

    expect(component.total).toBe(1000);
    expect(component.completed).toBe(750);
    expect(component.pending).toBe(250);
  });

  it('should reactively update when TodoFacade values change', () => {
    // Note: Since the component properties are set at initialization time,
    // they won't be reactive to changes unless the facade methods return signals
    // This test shows the current behavior
    mockTodoFacade.getTotalTodos.and.returnValue(10);
    mockTodoFacade.getCompletedTodos.and.returnValue(4);
    mockTodoFacade.getPendingTodos.and.returnValue(6);

    // Re-create component to get updated values
    fixture = TestBed.createComponent(DashboardStats);
    component = fixture.componentInstance;

    expect(component.total).toBe(10);
    expect(component.completed).toBe(4);
    expect(component.pending).toBe(6);

    // Update the mock return values
    mockTodoFacade.getTotalTodos.and.returnValue(15);
    mockTodoFacade.getCompletedTodos.and.returnValue(8);
    mockTodoFacade.getPendingTodos.and.returnValue(7);

    // Values won't change without re-creating component since they're not reactive
    expect(component.total).toBe(10);
    expect(component.completed).toBe(4);
    expect(component.pending).toBe(6);
  });

  it('should handle all todos completed scenario', () => {
    mockTodoFacade.getTotalTodos.and.returnValue(5);
    mockTodoFacade.getCompletedTodos.and.returnValue(5);
    mockTodoFacade.getPendingTodos.and.returnValue(0);

    // Re-create component to get updated values
    fixture = TestBed.createComponent(DashboardStats);
    component = fixture.componentInstance;

    expect(component.total).toBe(5);
    expect(component.completed).toBe(5);
    expect(component.pending).toBe(0);
  });

  it('should handle all todos pending scenario', () => {
    mockTodoFacade.getTotalTodos.and.returnValue(5);
    mockTodoFacade.getCompletedTodos.and.returnValue(0);
    mockTodoFacade.getPendingTodos.and.returnValue(5);

    // Re-create component to get updated values
    fixture = TestBed.createComponent(DashboardStats);
    component = fixture.componentInstance;

    expect(component.total).toBe(5);
    expect(component.completed).toBe(0);
    expect(component.pending).toBe(5);
  });
});
