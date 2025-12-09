import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../types';
import {
  Guide,
  GuideList,
  GuideCategory,
  GuideStep,
  GuideRating,
  GuideDifficulty,
  GuideType,
  GuideStatus,
  GuideFilter,
  CreateGuideRequest,
  UpdateGuideRequest,
  CreateGuideStepRequest
} from '../../../interfaces/community/guides';

@Injectable({ providedIn: 'root' })
export class GuidesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/guides`;

  guides = signal<GuideList[]>([]);
  loading = signal(false);

  // ============================================================================
  // GUIDE OPERATIONS
  // ============================================================================

  getGuides(filter: GuideFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<GuideList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.difficulty !== undefined) params = params.set('difficulty', filter.difficulty.toString());
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.carMake) params = params.set('carMake', filter.carMake);
    if (filter.carModel) params = params.set('carModel', filter.carModel);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.tag) params = params.set('tag', filter.tag);
    if (filter.minRating) params = params.set('minRating', filter.minRating.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<GuideList>>(this.apiUrl, { params });
  }

  getGuide(id: string): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/${id}`);
  }

  getGuideBySlug(slug: string): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/slug/${slug}`);
  }

  getFeaturedGuides(count = 10): Observable<GuideList[]> {
    return this.http.get<GuideList[]>(`${this.apiUrl}/featured`, {
      params: { count: count.toString() }
    });
  }

  getMyGuides(page = 1, pageSize = 20): Observable<PagedResult<GuideList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<GuideList>>(`${this.apiUrl}/my`, { params });
  }

  createGuide(request: CreateGuideRequest): Observable<Guide> {
    return this.http.post<Guide>(this.apiUrl, request);
  }

  updateGuide(id: string, request: UpdateGuideRequest): Observable<Guide> {
    return this.http.put<Guide>(`${this.apiUrl}/${id}`, request);
  }

  deleteGuide(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publishGuide(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/publish`, {});
  }

  // ============================================================================
  // STEP OPERATIONS
  // ============================================================================

  addStep(guideId: string, request: CreateGuideStepRequest): Observable<GuideStep> {
    return this.http.post<GuideStep>(`${this.apiUrl}/${guideId}/steps`, request);
  }

  updateStep(guideId: string, stepId: string, request: Partial<CreateGuideStepRequest>): Observable<GuideStep> {
    return this.http.put<GuideStep>(`${this.apiUrl}/${guideId}/steps/${stepId}`, request);
  }

  deleteStep(guideId: string, stepId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${guideId}/steps/${stepId}`);
  }

  // ============================================================================
  // INTERACTION OPERATIONS
  // ============================================================================

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

  getBookmarks(page = 1, pageSize = 20): Observable<PagedResult<GuideList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<GuideList>>(`${this.apiUrl}/bookmarks`, { params });
  }

  // ============================================================================
  // RATING OPERATIONS
  // ============================================================================

  getRatings(guideId: string, page = 1, pageSize = 20): Observable<PagedResult<GuideRating>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<GuideRating>>(`${this.apiUrl}/${guideId}/ratings`, { params });
  }

  rateGuide(guideId: string, rating: number, review?: string): Observable<GuideRating> {
    return this.http.post<GuideRating>(`${this.apiUrl}/${guideId}/rate`, { rating, review });
  }

  // ============================================================================
  // CATEGORY OPERATIONS
  // ============================================================================

  getCategories(): Observable<GuideCategory[]> {
    return this.http.get<GuideCategory[]>(`${this.apiUrl}/categories`);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  loadGuides(filter: GuideFilter = {}) {
    this.loading.set(true);
    this.getGuides(filter).subscribe({
      next: (result) => {
        this.guides.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
