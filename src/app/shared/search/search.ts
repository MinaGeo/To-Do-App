import {
  Component,
  ChangeDetectionStrategy,
  input,
  InputSignal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.html',
  styleUrls: ['./search.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  searchSignal: InputSignal<WritableSignal<string>> = input.required();
  placeholder: InputSignal<string> = input('Search...');
  onInput(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.searchSignal().set(value);
  }
}
