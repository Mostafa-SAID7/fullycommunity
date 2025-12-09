import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  ServiceReview,
  CreateServiceReviewRequest,
  ProviderReviewResponseRequest
} from '../../interfaces/services';

@Injectable({
  providedIn: 'root'
})
export class ServiceReviewsService {
  private readonly apiUrl = `${environment.apiUrl}/services/reviews`;

  constructor(private http: HttpClient) {}

  /**
   * Get provider reviews
   */
  getProviderReviews(providerId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<ServiceReview>> {
    return this.http.get<PagedResult<ServiceReview>>(`${this.apiUrl}/providers/${providerId}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get review summary
   */
  getReviewSummary(providerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/providers/${providerId}/summary`);
  }

  /**
   * Create review
   */
  create(request: CreateServiceReviewRequest): Observable<ServiceReview> {
    return this.http.post<ServiceReview>(this.apiUrl, request);
  }

  /**
   * Update review
   */
  update(id: string, request: Partial<CreateServiceReviewRequest>): Observable<ServiceReview> {
    return this.http.put<ServiceReview>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete review
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Respond to review (provider)
   */
  respond(id: string, request: ProviderReviewResponseRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/respond`, request);
  }

  /**
   * Mark review as helpful
   */
  markHelpful(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/helpful`, {});
  }

  /**
   * Unmark review as helpful
   */
  unmarkHelpful(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/helpful`);
  }
}
