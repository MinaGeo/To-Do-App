import { Signal } from '@angular/core';

export enum StatCardKey {
  Total = 'total',
  Completed = 'completed',
  Pending = 'pending',
}

export interface StatCardConfig {
  title: string;
  icon: string;
  key: StatCardKey;
}

export interface StatCardVM {
  title: string;
  icon: string;
  value: Signal<number>;
}
