import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Search } from './search';
import { signal, WritableSignal } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;
  let mockSearchSignal: WritableSignal<string>;

  beforeEach(async () => {
    mockSearchSignal = signal('initial');

    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('searchSignal', mockSearchSignal);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update searchSignal when user types', () => {
    const inputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    inputElement.value = 'test search';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(mockSearchSignal()).toBe('test search');
  });

  it('should use default placeholder', () => {
    const inputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    expect(inputElement.placeholder).toBe('Search...');
  });

  it('should use custom placeholder when provided', () => {
    fixture.componentRef.setInput('placeholder', 'Custom placeholder');
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    expect(inputElement.placeholder).toBe('Custom placeholder');
  });
});
