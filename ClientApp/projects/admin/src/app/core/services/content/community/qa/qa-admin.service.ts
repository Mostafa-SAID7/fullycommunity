import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  QAStats,
  QuestionListItem,
  QuestionDetail,
  Category,
  QuestionsResponse,
  TagsResponse,
  TrendsResponse,
  UserStatsResponse,
  ApiResponse
} from '../../../../interfaces/content/community/qa/qa-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class QaAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/dashboard/qa`;

  getStats(): Observable<ApiResponse<QAStats>> {
    return this.http.get<ApiResponse<QAStats>>(`${this.apiUrl}/stats`);
  }

  getQuestions(page: number = 1, pageSize: number = 20, status?: string, search?: string): Observable<QuestionsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<QuestionsResponse>(`${this.apiUrl}/questions`, { params });
  }

  getQuestion(id: string): Observable<ApiResponse<QuestionDetail>> {
    return this.http.get<ApiResponse<QuestionDetail>>(`${this.apiUrl}/questions/${id}`);
  }

  closeQuestion(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/questions/${id}/close`, { reason });
  }

  reopenQuestion(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/questions/${id}/reopen`, {});
  }

  deleteQuestion(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/questions/${id}`);
  }

  deleteAnswer(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/answers/${id}`);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  // Inline Editing
  updateQuestion(id: string, title: string, content: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/questions/${id}`, { title, content });
  }

  updateAnswer(id: string, content: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/answers/${id}`, { content });
  }

  // Tag Management
  getTags(page: number = 1, pageSize: number = 50): Observable<TagsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<TagsResponse>(`${this.apiUrl}/tags`, { params });
  }

  mergeTags(sourceTags: string[], targetTag: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/tags/merge`, { sourceTags, targetTag });
  }

  deleteTag(tag: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/tags/${encodeURIComponent(tag)}`);
  }

  // Analytics
  getTrends(days: number = 30): Observable<TrendsResponse> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<TrendsResponse>(`${this.apiUrl}/analytics/trends`, { params });
  }

  getUserStats(): Observable<UserStatsResponse> {
    return this.http.get<UserStatsResponse>(`${this.apiUrl}/analytics/users`);
  }

  // Bulk Actions
  bulkCloseQuestions(questionIds: string[], reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/bulk/close`, { questionIds, reason });
  }

  bulkDeleteQuestions(questionIds: string[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/bulk/delete`, { questionIds });
  }
}
