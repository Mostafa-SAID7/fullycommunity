/**
 * Base Interfaces
 * Common interfaces used across the admin application
 */

export interface BaseFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  affectedItems?: number;
  errors?: ActionError[];
}

export interface ActionError {
  id: string;
  error: string;
  code: string;
}

export interface ExportResponse {
  id: string;
  status: ExportStatus;
  downloadUrl?: string;
  progress?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export enum ExportStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4
}

export interface SelectOption<T = any> {
  value: T;
  label: string;
  disabled?: boolean;
  count?: number;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'actions';
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}