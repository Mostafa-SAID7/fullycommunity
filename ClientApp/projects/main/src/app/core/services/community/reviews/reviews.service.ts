import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../interfaces/common/paged-result.interface';
import {
  Review,
  ReviewList,
  ReviewComment,
  ReviewMedia,
  ReviewStats,
  ReviewFilter,
  CreateReviewRequest,
  UpdateReviewRequest,
  CreateReviewCommentRequest
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
    if (filter.ownershipStatus !== undefined) params = params.set('ownershipStatus', filter.ownershipStatus.toString());
    if (filter.minRating) params = params.set('minRating', filter.minRating.toString());
    if (filter.maxRating) params = params.set('maxRating', filter.maxRating.toString());
    if (filter.isVerifiedPurchase !== undefined) params = params.set('isVerifiedPurchase', filter.isVerifiedPurchase.toString());
    if (filter.isExpertReview !== undefined) params = params.set('isExpertReview', filter.isExpertReview.toString());
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
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

  // ============================================================================
  // COMMENT OPERATIONS
  // ============================================================================

  getComments(reviewId: string, page = 1, pageSize = 20): Observable<PagedResult<ReviewComment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<ReviewComment>>(`${this.apiUrl}/${reviewId}/comments`, { params });
  }

  createComment(reviewId: string, request: CreateReviewCommentRequest): Observable<ReviewComment> {
    return this.http.post<ReviewComment>(`${this.apiUrl}/${reviewId}/comments`, request);
  }

  updateComment(reviewId: string, commentId: string, content: string): Observable<ReviewComment> {
    return this.http.put<ReviewComment>(`${this.apiUrl}/${reviewId}/comments/${commentId}`, { content });
  }

  deleteComment(reviewId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}/comments/${commentId}`);
  }

  likeComment(reviewId: string, commentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reviewId}/comments/${commentId}/like`, {});
  }

  // ============================================================================
  // STATS OPERATIONS
  // ============================================================================

  getReviewStats(subjectType: ReviewSubjectType, subjectId: string): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.apiUrl}/stats`, {
      params: { subjectType: subjectType.toString(), subjectId }
    });
  }
}
