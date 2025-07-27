import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DashboardStatCardComponent } from './dashboard-stat-card-component';

describe('DashboardStatCardComponent', () => {
  let component: DashboardStatCardComponent;
  let fixture: ComponentFixture<DashboardStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardStatCardComponent);
    component = fixture.componentInstance;

    // Set required inputs before calling detectChanges
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('value', 42);
    fixture.componentRef.setInput('icon', '🧪');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain(
      'Test Title',
    );
  });

  it('should display the provided value', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-text')?.textContent).toContain('42');
  });

  it('should display the provided icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.display-6')?.textContent).toContain('🧪');
  });
});
