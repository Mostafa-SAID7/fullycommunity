import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../interfaces/common/paged-result.interface';
import {
  Page,
  PageList,
  PageOwner,
  PageReview,
  PageCategory,
  PageType,
  PageRole
} from '../../../interfaces/community/pages';

export interface PageFilter {
  category?: PageCategory;
  type?: PageType;
  isVerified?: boolean;
  searchTerm?: string;
  city?: string;
  country?: string;
  sortBy?: string;
}

export interface CreatePageRequest {
  name: string;
  username: string;
  description: string | null;
  bio: string | null;
  category: PageCategory;
  type: PageType;
  isPublic: boolean;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  businessHours?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  youTubeUrl?: string | null;
  linkedInUrl?: string | null;
}

export interface UpdatePageRequest extends Partial<CreatePageRequest> {}

export interface CreatePageReviewRequest {
  rating: number;
  title?: string | null;
  content: string;
  imageUrls?: string[];
}

@Injectable({ providedIn: 'root' })
export class PagesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/pages`;

  // ============================================================================
  // PAGE OPERATIONS
  // ============================================================================

  getPages(filter: PageFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<PageList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.category !== undefined) params = params.set('category', filter.category.toString());
    if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.isVerified !== undefined) params = params.set('isVerified', filter.isVerified.toString());
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.city) params = params.set('city', filter.city);
    if (filter.country) params = params.set('country', filter.country);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<PageList>>(this.apiUrl, { params });
  }

  getPage(id: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/${id}`);
  }

  getPageByUsername(username: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/username/${username}`);
  }

  getMyPages(page = 1, pageSize = 20): Observable<PagedResult<PageList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<PageList>>(`${this.apiUrl}/my`, { params });
  }

  getSuggestedPages(count = 10): Observable<PageList[]> {
    return this.http.get<PageList[]>(`${this.apiUrl}/suggested`, {
      params: { count: count.toString() }
    });
  }

  createPage(request: CreatePageRequest): Observable<Page> {
    return this.http.post<Page>(this.apiUrl, request);
  }

  updatePage(id: string, request: UpdatePageRequest): Observable<Page> {
    return this.http.put<Page>(`${this.apiUrl}/${id}`, request);
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ============================================================================
  // FOLLOW OPERATIONS
  // ============================================================================

  followPage(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/follow`, {});
  }

  unfollowPage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/follow`);
  }

  getFollowers(pageId: string, page = 1, pageSize = 20): Observable<PagedResult<PageOwner>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<PageOwner>>(`${this.apiUrl}/${pageId}/followers`, { params });
  }

  // ============================================================================
  // REVIEW OPERATIONS
  // ============================================================================

  getReviews(pageId: string, page = 1, pageSize = 20): Observable<PagedResult<PageReview>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<PageReview>>(`${this.apiUrl}/${pageId}/reviews`, { params });
  }

  createReview(pageId: string, request: CreatePageReviewRequest): Observable<PageReview> {
    return this.http.post<PageReview>(`${this.apiUrl}/${pageId}/reviews`, request);
  }

  updateReview(pageId: string, reviewId: string, request: Partial<CreatePageReviewRequest>): Observable<PageReview> {
    return this.http.put<PageReview>(`${this.apiUrl}/${pageId}/reviews/${reviewId}`, request);
  }

  deleteReview(pageId: string, reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pageId}/reviews/${reviewId}`);
  }

  markReviewHelpful(pageId: string, reviewId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${pageId}/reviews/${reviewId}/helpful`, {});
  }

  respondToReview(pageId: string, reviewId: string, response: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${pageId}/reviews/${reviewId}/respond`, { response });
  }

  // ============================================================================
  // ADMIN OPERATIONS
  // ============================================================================

  addAdmin(pageId: string, userId: string, role: PageRole): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${pageId}/admins`, { userId, role });
  }

  removeAdmin(pageId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pageId}/admins/${userId}`);
  }

  updateAdminRole(pageId: string, userId: string, role: PageRole): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${pageId}/admins/${userId}`, { role });
  }
}
