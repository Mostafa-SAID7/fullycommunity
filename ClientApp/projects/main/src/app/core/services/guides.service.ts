import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from './community.service';

export interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  authorId: string;
  author: GuideAuthor;
  coverImageUrl?: string;
  difficulty: GuideDifficulty;
  estimatedMinutes: number;
  categoryId?: string;
  category?: GuideCategory;
  tags: string[];
  steps: GuideStep[];
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  averageRating: number;
  ratingCount: number;
  status: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface GuideListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: GuideAuthor;
  coverImageUrl?: string;
  difficulty: GuideDifficulty;
  estimatedMinutes: number;
  category?: GuideCategory;
  viewCount: number;
  likeCount: number;
  averageRating: number;
  ratingCount: number;
  publishedAt: string;
}

export interface GuideAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface GuideStep {
  id: string;
  guideId: string;
  stepNumber: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  tip?: string;
  warning?: string;
}


export interface GuideCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
}

export interface GuideRating {
  id: string;
  guideId: string;
  userId: string;
  user: GuideAuthor;
  rating: number;
  comment?: string;
  createdAt: string;
}

export type GuideDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface GuideFilter {
  type?: string;
  difficulty?: GuideDifficulty;
  categoryId?: string;
  carMake?: string;
  carModel?: string;
  searchTerm?: string;
  tag?: string;
  minRating?: number;
  sortBy?: string;
}

export interface CreateGuideRequest {
  title: string;
  description: string;
  difficulty: GuideDifficulty;
  estimatedMinutes: number;
  categoryId?: string;
  tags?: string[];
  coverImageUrl?: string;
}

export interface CreateGuideStepRequest {
  stepNumber: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  tip?: string;
  warning?: string;
}

@Injectable({ providedIn: 'root' })
export class GuidesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/guides`;

  guides = signal<GuideListItem[]>([]);
  loading = signal(false);

  getGuides(filter: GuideFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<GuideListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filter.difficulty) params = params.set('difficulty', filter.difficulty);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    return this.http.get<PagedResult<GuideListItem>>(this.apiUrl, { params }).pipe(
      catchError(() => of(this.getMockGuides()))
    );
  }

  getGuide(id: string): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/${id}`);
  }

  getGuideBySlug(slug: string): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/slug/${slug}`);
  }

  getFeaturedGuides(count = 10): Observable<GuideListItem[]> {
    return this.http.get<GuideListItem[]>(`${this.apiUrl}/featured`, { params: { count } }).pipe(
      catchError(() => of(this.getMockGuides().items))
    );
  }

  getCategories(): Observable<GuideCategory[]> {
    return this.http.get<GuideCategory[]>(`${this.apiUrl}/categories`);
  }

  createGuide(request: CreateGuideRequest): Observable<Guide> {
    return this.http.post<Guide>(this.apiUrl, request);
  }

  updateGuide(id: string, request: Partial<CreateGuideRequest>): Observable<Guide> {
    return this.http.put<Guide>(`${this.apiUrl}/${id}`, request);
  }

  deleteGuide(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addStep(guideId: string, request: CreateGuideStepRequest): Observable<GuideStep> {
    return this.http.post<GuideStep>(`${this.apiUrl}/${guideId}/steps`, request);
  }

  likeGuide(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeGuide(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/like`);
  }

  bookmarkGuide(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/bookmark`, {});
  }

  unbookmarkGuide(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/bookmark`);
  }

  private getMockGuides(): PagedResult<GuideListItem> {
    const items: GuideListItem[] = [
      {
        id: '1', title: 'Complete Guide to Engine Oil Change', slug: 'engine-oil-change',
        description: 'Step-by-step guide for changing your car\'s engine oil at home',
        author: { id: '1', firstName: 'Mike', lastName: 'Johnson', isVerified: true },
        difficulty: 'Beginner', estimatedMinutes: 45, viewCount: 1250, likeCount: 89,
        averageRating: 4.7, ratingCount: 45, publishedAt: new Date().toISOString()
      },
      {
        id: '2', title: 'Winter Tire Installation Guide', slug: 'winter-tire-installation',
        description: 'How to properly install winter tires for optimal safety',
        author: { id: '2', firstName: 'Sarah', lastName: 'Williams', isVerified: true },
        difficulty: 'Intermediate', estimatedMinutes: 90, viewCount: 890, likeCount: 67,
        averageRating: 4.5, ratingCount: 32, publishedAt: new Date().toISOString()
      },
      {
        id: '3', title: 'Basic Car Detailing at Home', slug: 'car-detailing-home',
        description: 'Professional car detailing techniques you can do yourself',
        author: { id: '3', firstName: 'David', lastName: 'Chen', isVerified: false },
        difficulty: 'Beginner', estimatedMinutes: 120, viewCount: 2100, likeCount: 156,
        averageRating: 4.8, ratingCount: 78, publishedAt: new Date().toISOString()
      }
    ];
    return { items, totalCount: 3, page: 1, pageSize: 20, totalPages: 1 };
  }
}
