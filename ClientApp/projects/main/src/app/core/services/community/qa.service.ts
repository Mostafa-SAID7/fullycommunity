import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';

export interface Question {
  id: string;
  authorId: string;
  author: QAAuthor;
  title: string;
  content: string;
  slug: string;
  status: QuestionStatus;
  categoryId?: string;
  category?: QuestionCategory;
  tags: string[];
  viewCount: number;
  answerCount: number;
  voteCount: number;
  bookmarkCount: number;
  acceptedAnswerId?: string;
  bountyPoints?: number;
  bountyExpiresAt?: string;
  isClosed: boolean;
  closeReason?: string;
  isVotedUp?: boolean;
  isVotedDown?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface QuestionListItem {
  id: string;
  title: string;
  slug: string;
  author: QAAuthor;
  status: QuestionStatus;
  category?: QuestionCategory;
  tags: string[];
  viewCount: number;
  answerCount: number;
  voteCount: number;
  hasAcceptedAnswer: boolean;
  bountyPoints?: number;
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  author: QAAuthor;
  content: string;
  voteCount: number;
  isAccepted: boolean;
  isVotedUp?: boolean;
  isVotedDown?: boolean;
  comments: AnswerComment[];
  createdAt: string;
  updatedAt?: string;
}

export interface AnswerComment {
  id: string;
  answerId: string;
  authorId: string;
  author: QAAuthor;
  content: string;
  createdAt: string;
}

export interface QAAuthor {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Computed property for display
  avatar: string; // For compatibility
  avatarUrl?: string;
  reputation: number;
  isVerified: boolean;
}

export interface QuestionCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  questionCount: number;
}

export type QuestionStatus = 'Open' | 'Answered' | 'Closed' | 'Duplicate';
export type VoteType = 'Up' | 'Down';

export interface QuestionFilter {
  status?: QuestionStatus;
  categoryId?: string;
  searchTerm?: string;
  tag?: string;
  hasAcceptedAnswer?: boolean;
  hasBounty?: boolean;
  sortBy?: string;
}

export interface CreateQuestionRequest {
  title: string;
  content: string;
  categoryId?: string;
  tags?: string[];
}

export interface CreateAnswerRequest {
  content: string;
}

export interface QuestionDetail extends Question {
  answers: Answer[];
}


@Injectable({ providedIn: 'root' })
export class QAService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/qa`;

  questions = signal<QuestionListItem[]>([]);
  loading = signal(false);

  // Questions
  getQuestions(filter: QuestionFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<QuestionListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.tag) params = params.set('tag', filter.tag);
    if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer);
    if (filter.hasBounty !== undefined) params = params.set('hasBounty', filter.hasBounty);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<QuestionListItem>>(this.apiUrl, { params });
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${id}`);
  }

  getQuestionById(id: string): Observable<QuestionDetail> {
    return this.http.get<QuestionDetail>(`${this.apiUrl}/questions/${id}/detail`);
  }

  getQuestionBySlug(slug: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/slug/${slug}`);
  }

  getUserQuestions(userId: string, page = 1, pageSize = 20): Observable<PagedResult<QuestionListItem>> {
    return this.http.get<PagedResult<QuestionListItem>>(`${this.apiUrl}/questions/user/${userId}`, {
      params: { page, pageSize }
    });
  }

  getRelatedQuestions(questionId: string, count = 5): Observable<QuestionListItem[]> {
    return this.http.get<QuestionListItem[]>(`${this.apiUrl}/questions/${questionId}/related`, { params: { count } });
  }

  createQuestion(request: CreateQuestionRequest): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, request);
  }

  updateQuestion(id: string, request: Partial<CreateQuestionRequest>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`, request);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${id}`);
  }

  closeQuestion(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/questions/${id}/close`, JSON.stringify(reason), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  voteQuestion(id: string, type: VoteType): Observable<{ voteCount: number }> {
    return this.http.post<{ voteCount: number }>(`${this.apiUrl}/questions/${id}/vote`, JSON.stringify(type === 'Up' ? 1 : -1), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  bookmarkQuestion(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/questions/${id}/bookmark`, {});
  }

  unbookmarkQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${id}/bookmark`);
  }

  // Answers
  getAnswers(questionId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/questions/${questionId}/answers`);
  }

  createAnswer(questionId: string, request: CreateAnswerRequest): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/questions/${questionId}/answers`, request);
  }

  updateAnswer(id: string, content: string): Observable<Answer> {
    return this.http.put<Answer>(`${this.apiUrl}/answers/${id}`, { content });
  }

  deleteAnswer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/answers/${id}`);
  }

  acceptAnswer(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/answers/${id}/accept`, {});
  }

  voteAnswer(id: string, type: VoteType): Observable<{ voteCount: number }> {
    return this.http.post<{ voteCount: number }>(`${this.apiUrl}/answers/${id}/vote`, JSON.stringify(type === 'Up' ? 1 : -1), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Categories
  getCategories(): Observable<QuestionCategory[]> {
    return this.http.get<QuestionCategory[]>(`${this.apiUrl}/categories`);
  }

  // Bookmarks
  getBookmarks(page = 1, pageSize = 20): Observable<PagedResult<QuestionListItem>> {
    return this.http.get<PagedResult<QuestionListItem>>(`${this.apiUrl}/bookmarks`, { params: { page, pageSize } });
  }
}