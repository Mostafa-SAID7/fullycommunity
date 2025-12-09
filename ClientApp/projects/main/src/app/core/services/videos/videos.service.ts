import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Video,
  VideoListItem,
  VideoFeedItem,
  VideoFilter,
  VideoCategory,
  CreateVideoRequest,
  UpdateVideoRequest
} from '../../interfaces/videos';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private readonly apiUrl = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  /**
   * Get video by ID
   */
  getById(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get videos with filtering and pagination
   */
  getVideos(filter: VideoFilter): Observable<PagedResult<VideoListItem>> {
    let params = new HttpParams();
    
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    if (filter.channelId) params = params.set('channelId', filter.channelId);
    if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.visibility !== undefined) params = params.set('visibility', filter.visibility.toString());
    if (filter.contentRating !== undefined) params = params.set('contentRating', filter.contentRating.toString());
    if (filter.orientation !== undefined) params = params.set('orientation', filter.orientation.toString());
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.tags?.length) params = params.set('tags', filter.tags.join(','));
    if (filter.hashtags?.length) params = params.set('hashtags', filter.hashtags.join(','));
    if (filter.minDuration) params = params.set('minDuration', filter.minDuration.toString());
    if (filter.maxDuration) params = params.set('maxDuration', filter.maxDuration.toString());
    if (filter.minViews) params = params.set('minViews', filter.minViews.toString());
    if (filter.maxViews) params = params.set('maxViews', filter.maxViews.toString());
    if (filter.hasSound !== undefined) params = params.set('hasSound', filter.hasSound.toString());
    if (filter.isMonetized !== undefined) params = params.set('isMonetized', filter.isMonetized.toString());
    if (filter.isSponsoredContent !== undefined) params = params.set('isSponsoredContent', filter.isSponsoredContent.toString());
    if (filter.publishedAfter) params = params.set('publishedAfter', filter.publishedAfter);
    if (filter.publishedBefore) params = params.set('publishedBefore', filter.publishedBefore);
    if (filter.locationName) params = params.set('locationName', filter.locationName);
    
    return this.http.get<PagedResult<VideoListItem>>(this.apiUrl, { params });
  }

  /**
   * Get video feed (for infinite scroll)
   */
  getFeed(filter: VideoFilter): Observable<PagedResult<VideoFeedItem>> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    
    return this.http.get<PagedResult<VideoFeedItem>>(`${this.apiUrl}/feed`, { params });
  }

  /**
   * Get trending videos
   */
  getTrending(pageSize: number = 20): Observable<VideoListItem[]> {
    return this.http.get<VideoListItem[]>(`${this.apiUrl}/trending`, {
      params: { pageSize: pageSize.toString() }
    });
  }

  /**
   * Get videos by channel
   */
  getByChannel(channelId: string, filter: VideoFilter): Observable<PagedResult<VideoListItem>> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    
    return this.http.get<PagedResult<VideoListItem>>(`${this.apiUrl}/channel/${channelId}`, { params });
  }

  /**
   * Get videos by hashtag
   */
  getByHashtag(hashtag: string, filter: VideoFilter): Observable<PagedResult<VideoListItem>> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    
    return this.http.get<PagedResult<VideoListItem>>(`${this.apiUrl}/hashtag/${hashtag}`, { params });
  }

  /**
   * Get videos by sound
   */
  getBySound(soundId: string, filter: VideoFilter): Observable<PagedResult<VideoListItem>> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    
    return this.http.get<PagedResult<VideoListItem>>(`${this.apiUrl}/sound/${soundId}`, { params });
  }

  /**
   * Create video
   */
  create(request: CreateVideoRequest): Observable<Video> {
    const formData = new FormData();
    
    formData.append('channelId', request.channelId);
    formData.append('title', request.title);
    if (request.description) formData.append('description', request.description);
    formData.append('videoFile', request.videoFile);
    if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile);
    formData.append('type', request.type.toString());
    formData.append('visibility', request.visibility.toString());
    formData.append('contentRating', request.contentRating.toString());
    if (request.categoryId) formData.append('categoryId', request.categoryId);
    if (request.tags?.length) formData.append('tags', JSON.stringify(request.tags));
    if (request.hashtags?.length) formData.append('hashtags', JSON.stringify(request.hashtags));
    if (request.locationName) formData.append('locationName', request.locationName);
    if (request.latitude) formData.append('latitude', request.latitude.toString());
    if (request.longitude) formData.append('longitude', request.longitude.toString());
    if (request.allowComments !== undefined) formData.append('allowComments', request.allowComments.toString());
    if (request.allowDuets !== undefined) formData.append('allowDuets', request.allowDuets.toString());
    if (request.allowStitches !== undefined) formData.append('allowStitches', request.allowStitches.toString());
    if (request.allowDownloads !== undefined) formData.append('allowDownloads', request.allowDownloads.toString());
    if (request.scheduledPublishAt) formData.append('scheduledPublishAt', request.scheduledPublishAt);
    if (request.soundId) formData.append('soundId', request.soundId);
    if (request.useOriginalAudio !== undefined) formData.append('useOriginalAudio', request.useOriginalAudio.toString());
    if (request.duetOfVideoId) formData.append('duetOfVideoId', request.duetOfVideoId);
    if (request.stitchOfVideoId) formData.append('stitchOfVideoId', request.stitchOfVideoId);
    if (request.replyToVideoId) formData.append('replyToVideoId', request.replyToVideoId);
    
    return this.http.post<Video>(this.apiUrl, formData);
  }

  /**
   * Update video
   */
  update(id: string, request: UpdateVideoRequest): Observable<Video> {
    const formData = new FormData();
    
    if (request.title) formData.append('title', request.title);
    if (request.description) formData.append('description', request.description);
    if (request.visibility !== undefined) formData.append('visibility', request.visibility.toString());
    if (request.contentRating !== undefined) formData.append('contentRating', request.contentRating.toString());
    if (request.categoryId) formData.append('categoryId', request.categoryId);
    if (request.tags?.length) formData.append('tags', JSON.stringify(request.tags));
    if (request.hashtags?.length) formData.append('hashtags', JSON.stringify(request.hashtags));
    if (request.locationName) formData.append('locationName', request.locationName);
    if (request.latitude) formData.append('latitude', request.latitude.toString());
    if (request.longitude) formData.append('longitude', request.longitude.toString());
    if (request.allowComments !== undefined) formData.append('allowComments', request.allowComments.toString());
    if (request.allowDuets !== undefined) formData.append('allowDuets', request.allowDuets.toString());
    if (request.allowStitches !== undefined) formData.append('allowStitches', request.allowStitches.toString());
    if (request.allowDownloads !== undefined) formData.append('allowDownloads', request.allowDownloads.toString());
    if (request.showLikeCount !== undefined) formData.append('showLikeCount', request.showLikeCount.toString());
    if (request.isPinned !== undefined) formData.append('isPinned', request.isPinned.toString());
    if (request.scheduledPublishAt) formData.append('scheduledPublishAt', request.scheduledPublishAt);
    if (request.thumbnailFile) formData.append('thumbnailFile', request.thumbnailFile);
    
    return this.http.put<Video>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Delete video
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<VideoCategory[]> {
    return this.http.get<VideoCategory[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Increment view count
   */
  incrementView(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/view`, {});
  }

  /**
   * Get related videos
   */
  getRelated(id: string, limit: number = 10): Observable<VideoListItem[]> {
    return this.http.get<VideoListItem[]>(`${this.apiUrl}/${id}/related`, {
      params: { limit: limit.toString() }
    });
  }
}
