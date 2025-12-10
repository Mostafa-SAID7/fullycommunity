/**
 * Base Admin Service
 * Abstract base class for all admin services with common functionality
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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

@Injectable()
export abstract class BaseAdminService {
  protected readonly baseApiUrl = `${environment.apiUrl}/admin`;
  protected loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(protected http: HttpClient) {}

  /**
   * Build HTTP parameters from filter object
   */
  protected buildParams(filter: any): HttpParams {
    let params = new HttpParams();
    
    Object.keys(filter).forEach(key => {
      const value = filter[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          params = params.set(key, value.join(','));
        } else {
          params = params.set(key, value.toString());
        }
      }
    });
    
    return params;
  }

  /**
   * Generic GET request with error handling
   */
  protected get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    this.setLoading(true);
    
    return this.http.get<T>(`${this.baseApiUrl}${endpoint}`, { params })
      .pipe(
        retry(1),
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Generic POST request with error handling
   */
  protected post<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    this.setLoading(true);
    
    return this.http.post<T>(`${this.baseApiUrl}${endpoint}`, body, { params })
      .pipe(
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Generic PUT request with error handling
   */
  protected put<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    this.setLoading(true);
    
    return this.http.put<T>(`${this.baseApiUrl}${endpoint}`, body, { params })
      .pipe(
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Generic DELETE request with error handling
   */
  protected delete<T>(endpoint: string, params?: HttpParams): Observable<T> {
    this.setLoading(true);
    
    return this.http.delete<T>(`${this.baseApiUrl}${endpoint}`, { params })
      .pipe(
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Generic PATCH request with error handling
   */
  protected patch<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    this.setLoading(true);
    
    return this.http.patch<T>(`${this.baseApiUrl}${endpoint}`, body, { params })
      .pipe(
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Upload file with progress tracking
   */
  protected uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    this.setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }
    
    return this.http.post<T>(`${this.baseApiUrl}${endpoint}`, formData)
      .pipe(
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Download file
   */
  protected downloadFile(endpoint: string, params?: HttpParams): Observable<Blob> {
    this.setLoading(true);
    
    return this.http.get(`${this.baseApiUrl}${endpoint}`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError.bind(this)),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Bulk operation helper
   */
  protected bulkOperation<T>(endpoint: string, ids: string[], action: string, data?: any): Observable<ActionResponse> {
    const body = {
      ids,
      action,
      ...data
    };
    
    return this.post<ActionResponse>(endpoint, body);
  }

  /**
   * Search operation helper
   */
  protected search<T>(endpoint: string, query: string, limit: number = 10): Observable<T[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());
    
    return this.get<T[]>(endpoint, params);
  }

  /**
   * Export operation helper
   */
  protected export(endpoint: string, filter: any, format: 'csv' | 'excel' | 'pdf' = 'csv'): Observable<Blob> {
    const params = this.buildParams({ ...filter, format });
    return this.downloadFile(endpoint, params);
  }

  /**
   * Statistics helper
   */
  protected getStatistics<T>(endpoint: string, timeRange?: string): Observable<T> {
    const params = timeRange ? new HttpParams().set('timeRange', timeRange) : undefined;
    return this.get<T>(endpoint, params);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: ' + (error.error?.message || 'Invalid request');
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in again';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource was not found';
          break;
        case 409:
          errorMessage = 'Conflict: ' + (error.error?.message || 'Resource conflict');
          break;
        case 422:
          errorMessage = 'Validation Error: ' + (error.error?.message || 'Invalid data');
          break;
        case 429:
          errorMessage = 'Too Many Requests: Please try again later';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later';
          break;
        case 503:
          errorMessage = 'Service Unavailable: The service is temporarily unavailable';
          break;
        default:
          errorMessage = `Server Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('Admin Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Set loading state
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Get current loading state
   */
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
}