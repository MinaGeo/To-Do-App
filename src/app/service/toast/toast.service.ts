// src/app/core/services/toastr.service.ts
import { Injectable } from '@angular/core';
import * as toastr from 'toastr';

@Injectable({ providedIn: 'root' })
export class ToastrService {
  // Make toastr accessible for testing
  public toastr: typeof toastr = toastr;

  constructor() {
    this.toastr.options.positionClass = 'toast-bottom-right';
  }

  success(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }
}
