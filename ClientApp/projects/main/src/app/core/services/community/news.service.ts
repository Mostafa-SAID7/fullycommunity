import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../community/community.service';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorId: string;
  author: NewsAuthor;
  coverImageUrl?: string;
  videoUrl?: string;
  categoryId?: string;
  category?: NewsCategory;
  tags: string[];
  status: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isLiked?: boolean;
  sourceName?: string;
  sourceUrl?: string;
  publishedAt: string;
  createdAt: string;
}

export interface NewsListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author: NewsAuthor;
  coverImageUrl?: string;
  category?: NewsCategory;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  publishedAt: string;
}

export interface NewsAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
}


export interface NewsFilter {
  categoryId?: string;
  status?: string;
  searchTerm?: string;
  tag?: string;
  fromDate?: string;
  toDate?: string;
  isFeatured?: boolean;
  sortBy?: string;
}

export interface CreateNewsRequest {
  title: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  tags?: string[];
  coverImageUrl?: string;
  videoUrl?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/news`;

  articles = signal<NewsListItem[]>([]);
  loading = signal(false);

  getArticles(filter: NewsFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<NewsListItem>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.isFeatured !== undefined) params = params.set('isFeatured', filter.isFeatured);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    return this.http.get<PagedResult<NewsListItem>>(this.apiUrl, { params }).pipe(
      catchError(() => of(this.getMockNews()))
    );
  }

  getArticle(id: string): Observable<NewsArticle> {
    return this.http.get<NewsArticle>(`${this.apiUrl}/${id}`);
  }

  getArticleBySlug(slug: string): Observable<NewsArticle> {
    return this.http.get<NewsArticle>(`${this.apiUrl}/slug/${slug}`);
  }

  getFeaturedArticles(count = 5): Observable<NewsListItem[]> {
    return this.http.get<NewsListItem[]>(`${this.apiUrl}/featured`, { params: { count } }).pipe(
      catchError(() => of(this.getMockNews().items.filter(a => a.isFeatured)))
    );
  }

  getBreakingNews(count = 3): Observable<NewsListItem[]> {
    return this.http.get<NewsListItem[]>(`${this.apiUrl}/breaking`, { params: { count } }).pipe(
      catchError(() => of(this.getMockNews().items.filter(a => a.isBreaking)))
    );
  }

  getRelatedArticles(articleId: string, count = 5): Observable<NewsListItem[]> {
    return this.http.get<NewsListItem[]>(`${this.apiUrl}/${articleId}/related`, { params: { count } });
  }

  getCategories(): Observable<NewsCategory[]> {
    return this.http.get<NewsCategory[]>(`${this.apiUrl}/categories`);
  }

  likeArticle(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/like`);
  }

  private getMockNews(): PagedResult<NewsListItem> {
    const items: NewsListItem[] = [
      {
        id: '1', title: 'Tesla Announces New Model with 500-Mile Range',
        slug: 'tesla-500-mile-range', excerpt: 'Tesla unveils its latest electric vehicle with unprecedented range...',
        author: { id: '1', firstName: 'Auto', lastName: 'News' },
        coverImageUrl: 'https://placehold.co/800x400/1a1a2e/ffffff?text=Tesla+News',
        category: { id: '1', name: 'Electric Vehicles', slug: 'ev' },
        viewCount: 15420, likeCount: 892, commentCount: 156, isFeatured: true, isBreaking: true,
        publishedAt: new Date().toISOString()
      },
      {
        id: '2', title: 'Gas Prices Expected to Drop This Summer',
        slug: 'gas-prices-summer', excerpt: 'Analysts predict a significant decrease in fuel costs...',
        author: { id: '2', firstName: 'Market', lastName: 'Watch' },
        coverImageUrl: 'https://placehold.co/800x400/16213e/ffffff?text=Gas+Prices',
        category: { id: '2', name: 'Industry News', slug: 'industry' },
        viewCount: 8930, likeCount: 234, commentCount: 89, isFeatured: true, isBreaking: false,
        publishedAt: new Date().toISOString()
      },
      {
        id: '3', title: 'New Safety Features Required in 2025 Models',
        slug: 'safety-features-2025', excerpt: 'Government mandates new safety technology for all vehicles...',
        author: { id: '3', firstName: 'Safety', lastName: 'Report' },
        coverImageUrl: 'https://placehold.co/800x400/0f3460/ffffff?text=Safety+News',
        category: { id: '3', name: 'Safety', slug: 'safety' },
        viewCount: 5670, likeCount: 178, commentCount: 45, isFeatured: false, isBreaking: false,
        publishedAt: new Date().toISOString()
      },
      {
        id: '4', title: 'Classic Car Auction Breaks Records',
        slug: 'classic-car-auction', excerpt: 'A rare 1967 Ferrari sold for over $50 million at auction...',
        author: { id: '4', firstName: 'Classic', lastName: 'Cars' },
        coverImageUrl: 'https://placehold.co/800x400/533483/ffffff?text=Classic+Cars',
        category: { id: '4', name: 'Classic Cars', slug: 'classic' },
        viewCount: 12340, likeCount: 567, commentCount: 123, isFeatured: true, isBreaking: false,
        publishedAt: new Date().toISOString()
      }
    ];
    return { items, totalCount: 4, page: 1, pageSize: 20, totalPages: 1 };
  }
}
