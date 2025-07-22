import { signal, WritableSignal } from '@angular/core';
import { AuthenticationResponse } from '../api/auth/auth.model';

export const authData: WritableSignal<AuthenticationResponse | null> =
  signal(null);
