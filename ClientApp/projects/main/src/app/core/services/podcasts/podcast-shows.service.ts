import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  PodcastShow,
  PodcastShowListItem,
  PodcastSearchRequest,
  CreatePodcastShowRequest,
  UpdatePodcastShowRequest,
  PodcastHost,
  CreateHostRequest,
  UpdateHostRequest,
  PodcastCategory
} from '../../interfaces/podcasts';

@Injectable({
  providedIn: 'root'
})
export class PodcastShowsService {
  private readonly apiUrl = `${environment.apiUrl}/podcasts`;

  constructor(private http: HttpClient) {}

  /**
   * Get podcast show by ID
   */
  getById(id: string): Observable<PodcastShow> {
    return this.http.get<PodcastShow>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get podcast show by slug
   */
  getBySlug(slug: string): Observable<PodcastShow> {
    return this.http.get<PodcastShow>(`${this.apiUrl}/slug/${slug}`);
  }

  /**
   * Search/filter podcast shows
   */
  search(request: PodcastSearchRequest): Observable<PagedResult<PodcastShowListItem>> {
    let params = new HttpParams();
    
    if (request.query) params = params.set('query', request.query);
    if (request.category !== null && request.category !== undefined) params = params.set('category', request.category.toString());
    if (request.language) params = params.set('language', request.language);
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    
    return this.http.get<PagedResult<PodcastShowListItem>>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get trending podcasts
   */
  getTrending(pageSize: number = 20): Observable<PodcastShowListItem[]> {
    return this.http.get<PodcastShowListItem[]>(`${this.apiUrl}/trending`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Get featured podcasts
   */
  getFeatured(pageSize: number = 10): Observable<PodcastShowListItem[]> {
    return this.http.get<PodcastShowListItem[]>(`${this.apiUrl}/featured`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Get podcasts by category
   */
  getByCategory(category: number, page: number = 1, pageSize: number = 20): Observable<PagedResult<PodcastShowListItem>> {
    return this.http.get<PagedResult<PodcastShowListItem>>(`${this.apiUrl}/category/${category}`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Get user's podcasts
   */
  getMyPodcasts(page: number = 1, pageSize: number = 20): Observable<PagedResult<PodcastShowListItem>> {
    return this.http.get<PagedResult<PodcastShowListItem>>(`${this.apiUrl}/my-podcasts`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Create podcast show
   */
  create(request: CreatePodcastShowRequest): Observable<PodcastShow> {
    return this.http.post<PodcastShow>(this.apiUrl, request);
  }

  /**
   * Update podcast show
   */
  update(id: string, request: UpdatePodcastShowRequest): Observable<PodcastShow> {
    return this.http.put<PodcastShow>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete podcast show
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<PodcastCategory[]> {
    return this.http.get<PodcastCategory[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Add host to podcast
   */
  addHost(podcastId: string, request: CreateHostRequest): Observable<PodcastHost> {
    return this.http.post<PodcastHost>(`${this.apiUrl}/${podcastId}/hosts`, request);
  }

  /**
   * Update host
   */
  updateHost(podcastId: string, hostId: string, request: UpdateHostRequest): Observable<PodcastHost> {
    return this.http.put<PodcastHost>(`${this.apiUrl}/${podcastId}/hosts/${hostId}`, request);
  }

  /**
   * Remove host
   */
  removeHost(podcastId: string, hostId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${podcastId}/hosts/${hostId}`);
  }

  /**
   * Get related podcasts
   */
  getRelated(id: string, limit: number = 10): Observable<PodcastShowListItem[]> {
    return this.http.get<PodcastShowListItem[]>(`${this.apiUrl}/${id}/related`, {
      params: { limit: limit.toString() }
    });
  }
}
