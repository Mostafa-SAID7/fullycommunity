import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AnswerDto,
  AnswerCommentDto,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  CreateCommentRequest,
  UpdateCommentRequest
} from '../../../interfaces/community/qa';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  messageAr?: string;
}

@Injectable({ providedIn: 'root' })
export class AnswerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/qa`;

  // ============================================================================
  // ANSWER OPERATIONS
  // ============================================================================

  /**
   * Get answers for a question
   */
  getAnswers(questionId: string): Observable<AnswerDto[]> {
    return this.http.get<ApiResponse<AnswerDto[]>>(`${this.apiUrl}/questions/${questionId}/answers`)
      .pipe(map(response => response.data));
  }

  /**
   * Create answer (auth required)
   */
  createAnswer(questionId: string, request: CreateAnswerRequest): Observable<AnswerDto> {
    return this.http.post<ApiResponse<AnswerDto>>(`${this.apiUrl}/questions/${questionId}/answers`, request)
      .pipe(map(response => response.data));
  }

  /**
   * Update answer (auth required, owner only)
   */
  updateAnswer(id: string, request: UpdateAnswerRequest): Observable<AnswerDto> {
    return this.http.put<ApiResponse<AnswerDto>>(`${this.apiUrl}/answers/${id}`, request)
      .pipe(map(response => response.data));
  }

  /**
   * Delete answer (auth required, owner only)
   */
  deleteAnswer(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/answers/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Accept answer (auth required, question owner only)
   */
  acceptAnswer(id: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/answers/${id}/accept`, {})
      .pipe(map(response => response.data));
  }

  /**
   * Vote on answer (auth required)
   */
  voteAnswer(id: string, voteType: 1 | -1): Observable<{ voteCount: number }> {
    return this.http.post<ApiResponse<{ voteCount: number }>>(`${this.apiUrl}/answers/${id}/vote`, voteType, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map(response => response.data));
  }

  // ============================================================================
  // COMMENT OPERATIONS
  // ============================================================================

  /**
   * Get comments for an answer
   */
  getAnswerComments(answerId: string): Observable<AnswerCommentDto[]> {
    return this.http.get<ApiResponse<AnswerCommentDto[]>>(`${this.apiUrl}/answers/${answerId}/comments`)
      .pipe(map(response => response.data));
  }

  /**
   * Add comment to answer (auth required)
   */
  createAnswerComment(answerId: string, request: CreateCommentRequest): Observable<AnswerCommentDto> {
    return this.http.post<ApiResponse<AnswerCommentDto>>(`${this.apiUrl}/answers/${answerId}/comments`, request)
      .pipe(map(response => response.data));
  }

  /**
   * Update comment (auth required, owner only)
   */
  updateAnswerComment(commentId: string, request: UpdateCommentRequest): Observable<AnswerCommentDto> {
    return this.http.put<ApiResponse<AnswerCommentDto>>(`${this.apiUrl}/answers/comments/${commentId}`, request)
      .pipe(map(response => response.data));
  }

  /**
   * Delete comment (auth required, owner only)
   */
  deleteAnswerComment(commentId: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/answers/comments/${commentId}`)
      .pipe(map(response => response.data));
  }
}
