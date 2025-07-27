// src/app/core/services/toastr.service.ts
import { Injectable } from '@angular/core';
import * as toastr from 'toastr';

@Injectable({ providedIn: 'root' })
export class ToastrService {
  constructor() {
    toastr.options.positionClass = 'toast-bottom-right';
  }

  success(message: string, title?: string): void {
    toastr.success(message, title);
  }

  error(message: string, title?: string): void {
    toastr.error(message, title);
  }

  info(message: string, title?: string): void {
    toastr.info(message, title);
  }

  warning(message: string, title?: string): void {
    toastr.warning(message, title);
  }
}
