import { StatCardConfig, StatCardKey } from '../model/dashboard-stats.model';

export const DASHBOARD_STAT_CARDS: StatCardConfig[] = [
  {
    title: 'Total Todos',
    icon: '📝',
    key: StatCardKey.Total,
  },
  {
    title: 'Completed',
    icon: '✅',
    key: StatCardKey.Completed,
  },
  {
    title: 'Pending',
    icon: '📌',
    key: StatCardKey.Pending,
  },
];
