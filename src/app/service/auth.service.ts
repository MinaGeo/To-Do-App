import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated: WritableSignal<boolean> = signal<boolean>(false);

  isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();

  login(): void {
    this._isAuthenticated.set(true);
  }

  logout(): void {
    this._isAuthenticated.set(false);
  }
}
