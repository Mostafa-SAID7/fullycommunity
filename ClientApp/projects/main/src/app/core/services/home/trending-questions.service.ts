import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TrendingQuestion {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: QuestionAuthor;
  voteCount: number;
  answerCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  tags: string[];
  createdAt: string;
}

export interface QuestionAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: string;
}

@Injectable({ providedIn: 'root' })
export class TrendingQuestionsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community`;

  getTrendingQuestions(): Observable<TrendingQuestion[]> {
    return this.http.get<TrendingQuestion[]>(`${this.apiUrl}/trending-questions`);
  }


}