import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminService,
  AdminServiceProvider,
  AdminServiceBooking,
  AdminServiceReview,
  ServicesFilter,
  ServicesStatistics
} from '../../interfaces/services/admin-services.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {
  private readonly apiUrl = `${environment.apiUrl}/admin/services`;

  constructor(private http: HttpClient) {}

  /**
   * Get services
   */
  getServices(filter: ServicesFilter, page: number = 1, pageSize: number = 20): Observable<{ services: AdminService[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ services: AdminService[], total: number }>(`${this.apiUrl}/services`, { params });
  }

  /**
   * Get service providers
   */
  getProviders(filter: ServicesFilter, page: number = 1, pageSize: number = 20): Observable<{ providers: AdminServiceProvider[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ providers: AdminServiceProvider[], total: number }>(`${this.apiUrl}/providers`, { params });
  }

  /**
   * Get service bookings
   */
  getBookings(filter: ServicesFilter, page: number = 1, pageSize: number = 20): Observable<{ bookings: AdminServiceBooking[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ bookings: AdminServiceBooking[], total: number }>(`${this.apiUrl}/bookings`, { params });
  }

  /**
   * Get service reviews
   */
  getReviews(filter: ServicesFilter, page: number = 1, pageSize: number = 20): Observable<{ reviews: AdminServiceReview[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ reviews: AdminServiceReview[], total: number }>(`${this.apiUrl}/reviews`, { params });
  }

  /**
   * Get service by ID
   */
  getService(serviceId: string): Observable<AdminService> {
    return this.http.get<AdminService>(`${this.apiUrl}/services/${serviceId}`);
  }

  /**
   * Get provider by ID
   */
  getProvider(providerId: string): Observable<AdminServiceProvider> {
    return this.http.get<AdminServiceProvider>(`${this.apiUrl}/providers/${providerId}`);
  }

  /**
   * Get booking by ID
   */
  getBooking(bookingId: string): Observable<AdminServiceBooking> {
    return this.http.get<AdminServiceBooking>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  /**
   * Approve service
   */
  approveService(serviceId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/services/${serviceId}/approve`, {});
  }

  /**
   * Reject service
   */
  rejectService(serviceId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/services/${serviceId}/reject`, { reason });
  }

  /**
   * Flag service
   */
  flagService(serviceId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/services/${serviceId}/flag`, { reason });
  }

  /**
   * Hide service
   */
  hideService(serviceId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/services/${serviceId}/hide`, {});
  }

  /**
   * Delete service
   */
  deleteService(serviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/services/${serviceId}`);
  }

  /**
   * Verify provider
   */
  verifyProvider(providerId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/providers/${providerId}/verify`, {});
  }

  /**
   * Suspend provider
   */
  suspendProvider(providerId: string, reason: string, duration: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/providers/${providerId}/suspend`, { reason, duration });
  }

  /**
   * Ban provider
   */
  banProvider(providerId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/providers/${providerId}/ban`, { reason });
  }

  /**
   * Cancel booking
   */
  cancelBooking(bookingId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bookings/${bookingId}/cancel`, { reason });
  }

  /**
   * Refund booking
   */
  refundBooking(bookingId: string, amount: number, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bookings/${bookingId}/refund`, { amount, reason });
  }

  /**
   * Resolve dispute
   */
  resolveDispute(bookingId: string, resolution: string, refundAmount: number | null): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bookings/${bookingId}/resolve-dispute`, { resolution, refundAmount });
  }

  /**
   * Approve review
   */
  approveReview(reviewId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reviews/${reviewId}/approve`, {});
  }

  /**
   * Hide review
   */
  hideReview(reviewId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reviews/${reviewId}/hide`, {});
  }

  /**
   * Flag review
   */
  flagReview(reviewId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reviews/${reviewId}/flag`, { reason });
  }

  /**
   * Delete review
   */
  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${reviewId}`);
  }

  /**
   * Get services statistics
   */
  getStatistics(): Observable<ServicesStatistics> {
    return this.http.get<ServicesStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Get moderation queue
   */
  getModerationQueue(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/moderation-queue`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get reported items
   */
  getReportedItems(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/reported`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get disputes
   */
  getDisputes(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/disputes`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Export services data
   */
  exportData(filter: ServicesFilter, format: string = 'csv'): Observable<Blob> {
    let params = this.buildFilterParams(filter, 1, 10000);
    params = params.set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Build filter parameters
   */
  private buildFilterParams(filter: ServicesFilter, page: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.contentType !== null && filter.contentType !== undefined) params = params.set('contentType', filter.contentType.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.moderationStatus !== null && filter.moderationStatus !== undefined) params = params.set('moderationStatus', filter.moderationStatus.toString());
    if (filter.providerId) params = params.set('providerId', filter.providerId);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.priceMin !== null && filter.priceMin !== undefined) params = params.set('priceMin', filter.priceMin.toString());
    if (filter.priceMax !== null && filter.priceMax !== undefined) params = params.set('priceMax', filter.priceMax.toString());
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.hasReports !== null && filter.hasReports !== undefined) params = params.set('hasReports', filter.hasReports.toString());
    if (filter.isFlagged !== null && filter.isFlagged !== undefined) params = params.set('isFlagged', filter.isFlagged.toString());
    if (filter.isRemote !== null && filter.isRemote !== undefined) params = params.set('isRemote', filter.isRemote.toString());
    
    return params;
  }
}