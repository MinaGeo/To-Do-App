import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnauthorizedPage } from './unauthorized-page';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
describe('UnauthorizedPage', () => {
  let component: UnauthorizedPage;
  let fixture: ComponentFixture<UnauthorizedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedPage],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorizedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
