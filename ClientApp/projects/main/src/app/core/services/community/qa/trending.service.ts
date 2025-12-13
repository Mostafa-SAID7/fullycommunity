import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TrendingQuestion } from '../../../interfaces/community/qa';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  messageAr?: string;
}

@Injectable({ providedIn: 'root' })
export class TrendingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/trending-questions`;

  /**
   * Get trending questions
   * @param count Number of trending questions (1-20, default 5)
   */
  getTrendingQuestions(count = 5): Observable<TrendingQuestion[]> {
    const params = new HttpParams().set('count', Math.min(Math.max(count, 1), 20));
    return this.http.get<ApiResponse<TrendingQuestion[]>>(this.apiUrl, { params })
      .pipe(map(response => response.data));
  }
}
