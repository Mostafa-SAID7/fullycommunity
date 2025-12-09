import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Playlist,
  PlaylistListItem,
  PlaylistFilter,
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
  AddToPlaylistRequest,
  RemoveFromPlaylistRequest,
  ReorderPlaylistRequest
} from '../../interfaces/videos';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private readonly apiUrl = `${environment.apiUrl}/playlists`;

  constructor(private http: HttpClient) {}

  /**
   * Get playlist by ID
   */
  getById(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all playlists
   */
  getPlaylists(filter: PlaylistFilter): Observable<PagedResult<PlaylistListItem>> {
    let params = new HttpParams();
    
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.channelId) params = params.set('channelId', filter.channelId);
    if (filter.visibility !== undefined) params = params.set('visibility', filter.visibility.toString());
    if (filter.isFeatured !== undefined) params = params.set('isFeatured', filter.isFeatured.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    
    return this.http.get<PagedResult<PlaylistListItem>>(this.apiUrl, { params });
  }

  /**
   * Get channel playlists
   */
  getChannelPlaylists(channelId: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<PlaylistListItem>> {
    return this.http.get<PagedResult<PlaylistListItem>>(`${this.apiUrl}/channel/${channelId}`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get user's playlists
   */
  getUserPlaylists(page: number = 1, pageSize: number = 20): Observable<PagedResult<PlaylistListItem>> {
    return this.http.get<PagedResult<PlaylistListItem>>(`${this.apiUrl}/my-playlists`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get featured playlists
   */
  getFeatured(limit: number = 20): Observable<PlaylistListItem[]> {
    return this.http.get<PlaylistListItem[]>(`${this.apiUrl}/featured`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Create playlist
   */
  create(channelId: string, request: CreatePlaylistRequest): Observable<Playlist> {
    const formData = new FormData();
    
    formData.append('channelId', channelId);
    formData.append('title', request.title);
    if (request.description) formData.append('description', request.description);
    if (request.visibility !== undefined) formData.append('visibility', request.visibility.toString());
    if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile);
    
    return this.http.post<Playlist>(this.apiUrl, formData);
  }

  /**
   * Update playlist
   */
  update(id: string, request: UpdatePlaylistRequest): Observable<Playlist> {
    const formData = new FormData();
    
    if (request.title) formData.append('title', request.title);
    if (request.description) formData.append('description', request.description);
    if (request.visibility !== undefined) formData.append('visibility', request.visibility.toString());
    if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile);
    
    return this.http.put<Playlist>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Delete playlist
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add video to playlist
   */
  addVideo(request: AddToPlaylistRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${request.playlistId}/videos`, {
      videoId: request.videoId
    });
  }

  /**
   * Remove video from playlist
   */
  removeVideo(request: RemoveFromPlaylistRequest): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${request.playlistId}/videos/${request.videoId}`);
  }

  /**
   * Reorder playlist videos
   */
  reorder(request: ReorderPlaylistRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${request.playlistId}/reorder`, {
      videoIds: request.videoIds
    });
  }

  /**
   * Get playlists containing video
   */
  getPlaylistsWithVideo(videoId: string): Observable<PlaylistListItem[]> {
    return this.http.get<PlaylistListItem[]>(`${this.apiUrl}/containing/${videoId}`);
  }
}
