import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../interfaces/common/paged-result.interface';
import {
  ReviewComment,
  CreateReviewCommentRequest
} from '../../../interfaces/community/reviews';

@Injectable({ providedIn: 'root' })
export class ReviewCommentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/reviews`;

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

  unlikeComment(reviewId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}/comments/${commentId}/like`);
  }
}
