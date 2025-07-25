import { computed, Signal } from '@angular/core';
import { User } from '../api/auth/auth.model';
import { authData } from './auth.state';

export const user: Signal<User | null> = computed(
  () => authData()?.user ?? null,
);
