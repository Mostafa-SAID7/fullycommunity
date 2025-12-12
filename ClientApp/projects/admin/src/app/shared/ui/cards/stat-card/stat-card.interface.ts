export interface StatCardConfig {
  title: string;
  value: number | string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}