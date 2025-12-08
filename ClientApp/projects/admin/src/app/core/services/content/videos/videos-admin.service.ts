import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Video,
  VideosListResponse,
  PendingVideo,
  VideoStats,
  VideoActionRequest
} from '../../../interfaces/content/videos/videos-admin.interface';

@Injectable({ providedIn: 'root' })
export class VideosAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/videos`;

  getVideos(page = 1, pageSize = 16, status?: string, search?: string): Observable<VideosListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<VideosListResponse>(this.apiUrl, { params });
  }

  getVideo(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/${id}`);
  }

  getPendingVideos(): Observable<{ items: PendingVideo[] }> {
    return this.http.get<{ items: PendingVideo[] }>(`${this.apiUrl}/pending`);
  }

  getPendingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/pending/count`);
  }

  approveVideo(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectVideo(id: string, reason?: string): Observable<void> {
    const request: VideoActionRequest = { reason };
    return this.http.post<void>(`${this.apiUrl}/${id}/reject`, request);
  }

  deleteVideo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAnalytics(): Observable<VideoStats> {
    return this.http.get<VideoStats>(`${this.apiUrl}/analytics`);
  }
}
