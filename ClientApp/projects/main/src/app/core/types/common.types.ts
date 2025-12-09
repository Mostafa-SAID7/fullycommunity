/**
 * Site-wide common types used across the entire application
 * These are generic types not specific to any feature
 */

/**
 * Generic paginated result wrapper
 * Used by all services that return paginated data
 */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Base filter interface with common filtering properties
 * Can be extended by any feature-specific filters
 */
export interface BaseFilter {
  searchTerm?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Generic timestamp interface for any entity
 */
export interface Timestamps {
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Extended timestamps with published date
 */
export interface PublishableTimestamps extends Timestamps {
  publishedAt: string | null;
}

/**
 * Application error interface
 */
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

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  messageAr?: string;
  errors?: string[];
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Generic ID type
 */
export type ID = string | number;

/**
 * Loading state type
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic status type
 */
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

/**
 * Notification/Toast type
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * File upload status
 */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

/**
 * Generic key-value pair
 */
export interface KeyValue<K = string, V = any> {
  key: K;
  value: V;
}

/**
 * Generic option for dropdowns/selects
 */
export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

/**
 * Generic breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
  active?: boolean;
}

/**
 * Generic tab item
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

/**
 * Generic action button
 */
export interface ActionButton {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

/**
 * Generic confirmation dialog data
 */
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: NotificationType;
}

/**
 * Generic metadata
 */
export interface Metadata {
  [key: string]: any;
}

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Deep partial type helper
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};