import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, Footer, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}
