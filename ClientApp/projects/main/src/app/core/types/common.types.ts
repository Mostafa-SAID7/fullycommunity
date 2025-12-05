// Shared types used across multiple services

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AppError {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  timestamp: Date;
  details?: any;
  action?: {
    label: string;
    handler: () => void;
  };
}