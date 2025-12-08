import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../types/common.types';
import {
  QuestionDto,
  QuestionListDto,
  QuestionFilter,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionCategory
} from '../../../interfaces/community/qa';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  messageAr?: string;
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/qa/questions`;

  /**
   * Get paginated list of questions with filters
   */
  getQuestions(filter: QuestionFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<QuestionListDto>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (filter.status) params = params.set('status', filter.status);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.tag) params = params.set('tag', filter.tag);
    if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer);
    if (filter.hasBounty !== undefined) params = params.set('hasBounty', filter.hasBounty);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<ApiResponse<PagedResult<QuestionListDto>>>(this.apiUrl, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Get question by ID
   */
  getQuestion(id: string): Observable<QuestionDto> {
    return this.http.get<ApiResponse<QuestionDto>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Get question by slug
   */
  getQuestionBySlug(slug: string): Observable<QuestionDto> {
    return this.http.get<ApiResponse<QuestionDto>>(`${this.apiUrl}/slug/${slug}`)
      .pipe(map(response => response.data));
  }

  /**
   * Get user's questions
   */
  getUserQuestions(userId: string, page = 1, pageSize = 20): Observable<PagedResult<QuestionListDto>> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<ApiResponse<PagedResult<QuestionListDto>>>(`${this.apiUrl}/user/${userId}`, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Get related questions
   */
  getRelatedQuestions(questionId: string, count = 5): Observable<QuestionListDto[]> {
    const params = new HttpParams().set('count', count);
    return this.http.get<ApiResponse<QuestionListDto[]>>(`${this.apiUrl}/${questionId}/related`, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Create new question (auth required)
   */
  createQuestion(request: CreateQuestionRequest): Observable<QuestionDto> {
    return this.http.post<ApiResponse<QuestionDto>>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  /**
   * Update question (auth required, owner only)
   */
  updateQuestion(id: string, request: UpdateQuestionRequest): Observable<QuestionDto> {
    return this.http.put<ApiResponse<QuestionDto>>(`${this.apiUrl}/${id}`, request)
      .pipe(map(response => response.data));
  }

  /**
   * Delete question (auth required, owner only)
   */
  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Close question (auth required, owner only)
   */
  closeQuestion(id: string, reason: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/close`, { reason })
      .pipe(map(response => response.data));
  }

  /**
   * Vote on question (auth required)
   */
  voteQuestion(id: string, voteType: 1 | -1): Observable<{ voteCount: number }> {
    return this.http.post<ApiResponse<{ voteCount: number }>>(`${this.apiUrl}/${id}/vote`, voteType)
      .pipe(map(response => response.data));
  }

  /**
   * Bookmark question (auth required)
   */
  bookmarkQuestion(id: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/bookmark`, {})
      .pipe(map(response => response.data));
  }

  /**
   * Remove bookmark (auth required)
   */
  unbookmarkQuestion(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}/bookmark`)
      .pipe(map(response => response.data));
  }

  /**
   * Get user's bookmarked questions (auth required)
   */
  getBookmarks(page = 1, pageSize = 20): Observable<PagedResult<QuestionListDto>> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<ApiResponse<PagedResult<QuestionListDto>>>(`${this.apiUrl}/bookmarks`, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<QuestionCategory[]> {
    return this.http.get<ApiResponse<QuestionCategory[]>>(`${this.apiUrl}/categories`)
      .pipe(map(response => response.data));
  }
}
