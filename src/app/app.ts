import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Layout } from './layouts/layout/layout';
import { ToastContainer } from './shared/toast-container/toast-container';
@Component({
  selector: 'app-root',
  imports: [Layout, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
