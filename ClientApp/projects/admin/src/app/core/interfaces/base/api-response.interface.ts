/**
 * Base API Response Interfaces
 * Common response structures used across all API calls
 */

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ListResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  id?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: string[];
  statusCode: number;
}
