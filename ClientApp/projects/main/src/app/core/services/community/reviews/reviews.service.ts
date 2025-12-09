import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../interfaces/common/paged-result.interface';
import {
  Review,
  ReviewList,
  ReviewFilter,
  CreateReviewRequest,
  UpdateReviewRequest
} from '../../../interfaces/community/reviews';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/reviews`;

  // ============================================================================
  // REVIEW OPERATIONS
  // ============================================================================

  getReviews(filter: ReviewFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<ReviewList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.subjectType !== undefined) params = params.set('subjectType', filter.subjectType.toString());
    if (filter.subjectId) params = params.set('subjectId', filter.subjectId);
    if (filter.carMake) params = params.set('carMake', filter.carMake);
    if (filter.carModel) params = params.set('carModel', filter.carModel);
    if (filter.carYear) params = params.set('carYear', filter.carYear.toString());
    if (filter.minRating) params = params.set('minRating', filter.minRating.toString());
    if (filter.maxRating) params = params.set('maxRating', filter.maxRating.toString());
    if (filter.isVerifiedPurchase !== undefined) params = params.set('isVerifiedPurchase', filter.isVerifiedPurchase.toString());
    if (filter.isExpertReview !== undefined) params = params.set('isExpertReview', filter.isExpertReview.toString());
    if (filter.isFeatured !== undefined) params = params.set('isFeatured', filter.isFeatured.toString());
    if (filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<ReviewList>>(this.apiUrl, { params });
  }

  getReview(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getReviewBySlug(slug: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/slug/${slug}`);
  }

  getMyReviews(page = 1, pageSize = 20): Observable<PagedResult<ReviewList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<ReviewList>>(`${this.apiUrl}/my`, { params });
  }

  getFeaturedReviews(count = 10): Observable<ReviewList[]> {
    return this.http.get<ReviewList[]>(`${this.apiUrl}/featured`, {
      params: { count: count.toString() }
    });
  }

  createReview(request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, request);
  }

  updateReview(id: string, request: UpdateReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, request);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publishReview(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/publish`, {});
  }

  // ============================================================================
  // INTERACTION OPERATIONS
  // ============================================================================

  markHelpful(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/helpful`, {});
  }

  unmarkHelpful(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/helpful`);
  }
}
