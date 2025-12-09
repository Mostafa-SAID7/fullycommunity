import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { QuestionAuthor } from '../../interfaces/community/qa';

export interface TrendingQuestion {
  id: string;
  title: string;
  slug: string;
  content: string; // Backend sends full content, not excerpt
  author: QuestionAuthor;
  voteCount: number;
  answerCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  tags: string[];
  createdAt: string;
}

// Backend response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  messageAr?: string;
}

@Injectable({ providedIn: 'root' })
export class TrendingQuestionsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community`;

  /**
   * Get trending questions
   * @param count Number of trending questions to fetch (1-20, default 5)
   */
  getTrendingQuestions(count = 5): Observable<TrendingQuestion[]> {
    const validCount = Math.min(Math.max(count, 1), 20);
    return this.http.get<ApiResponse<TrendingQuestion[]>>(`${this.apiUrl}/trending-questions?count=${validCount}`)
      .pipe(map(response => response.data));
  }
}