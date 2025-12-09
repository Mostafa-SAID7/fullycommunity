import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Sound,
  SoundListItem,
  SoundFilter,
  CreateSoundRequest,
  UpdateSoundRequest,
  FavoriteSoundRequest,
  UnfavoriteSoundRequest
} from '../../interfaces/videos';

@Injectable({
  providedIn: 'root'
})
export class SoundsService {
  private readonly apiUrl = `${environment.apiUrl}/sounds`;

  constructor(private http: HttpClient) {}

  /**
   * Get sound by ID
   */
  getById(id: string): Observable<Sound> {
    return this.http.get<Sound>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all sounds
   */
  getSounds(filter: SoundFilter): Observable<PagedResult<SoundListItem>> {
    let params = new HttpParams();
    
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.genre) params = params.set('genre', filter.genre);
    if (filter.isTrending !== undefined) params = params.set('isTrending', filter.isTrending.toString());
    if (filter.isFeatured !== undefined) params = params.set('isFeatured', filter.isFeatured.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    
    return this.http.get<PagedResult<SoundListItem>>(this.apiUrl, { params });
  }

  /**
   * Get trending sounds
   */
  getTrending(limit: number = 20): Observable<SoundListItem[]> {
    return this.http.get<SoundListItem[]>(`${this.apiUrl}/trending`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get featured sounds
   */
  getFeatured(limit: number = 20): Observable<SoundListItem[]> {
    return this.http.get<SoundListItem[]>(`${this.apiUrl}/featured`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get sounds by genre
   */
  getByGenre(genre: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<SoundListItem>> {
    return this.http.get<PagedResult<SoundListItem>>(`${this.apiUrl}/genre/${genre}`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get user's favorite sounds
   */
  getFavorites(page: number = 1, pageSize: number = 20): Observable<PagedResult<SoundListItem>> {
    return this.http.get<PagedResult<SoundListItem>>(`${this.apiUrl}/favorites`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Create sound
   */
  create(request: CreateSoundRequest): Observable<Sound> {
    const formData = new FormData();
    
    formData.append('title', request.title);
    if (request.artist) formData.append('artist', request.artist);
    if (request.album) formData.append('album', request.album);
    formData.append('audioFile', request.audioFile);
    if (request.coverImageFile) formData.append('coverImageFile', request.coverImageFile);
    if (request.genre) formData.append('genre', request.genre);
    if (request.tags?.length) formData.append('tags', JSON.stringify(request.tags));
    if (request.isCopyrighted !== undefined) formData.append('isCopyrighted', request.isCopyrighted.toString());
    if (request.copyrightHolder) formData.append('copyrightHolder', request.copyrightHolder);
    if (request.licenseInfo) formData.append('licenseInfo', request.licenseInfo);
    
    return this.http.post<Sound>(this.apiUrl, formData);
  }

  /**
   * Update sound
   */
  update(id: string, request: UpdateSoundRequest): Observable<Sound> {
    const formData = new FormData();
    
    if (request.title) formData.append('title', request.title);
    if (request.artist) formData.append('artist', request.artist);
    if (request.album) formData.append('album', request.album);
    if (request.coverImageFile) formData.append('coverImageFile', request.coverImageFile);
    if (request.genre) formData.append('genre', request.genre);
    if (request.tags?.length) formData.append('tags', JSON.stringify(request.tags));
    
    return this.http.put<Sound>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Delete sound
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Favorite sound
   */
  favorite(request: FavoriteSoundRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${request.soundId}/favorite`, {});
  }

  /**
   * Unfavorite sound
   */
  unfavorite(request: UnfavoriteSoundRequest): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${request.soundId}/favorite`);
  }

  /**
   * Get videos using this sound
   */
  getVideosUsing(soundId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${soundId}/videos`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }
}
