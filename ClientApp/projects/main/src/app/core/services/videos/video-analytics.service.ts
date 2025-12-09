import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VideoAnalytics } from '../../interfaces/videos';

@Injectable({
  providedIn: 'root'
})
export class VideoAnalyticsService {
  private readonly apiUrl = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  /**
   * Get video analytics
   */
  getAnalytics(videoId: string, startDate?: string, endDate?: string): Observable<VideoAnalytics> {
    let params = new HttpParams();
    
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    
    return this.http.get<VideoAnalytics>(`${this.apiUrl}/${videoId}/analytics`, { params });
  }

  /**
   * Get channel analytics
   */
  getChannelAnalytics(channelId: string, startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    
    return this.http.get<any>(`${environment.apiUrl}/channels/${channelId}/analytics`, { params });
  }

  /**
   * Track video view
   */
  trackView(videoId: string, watchTime: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${videoId}/track-view`, {
      watchTime
    });
  }

  /**
   * Track video completion
   */
  trackCompletion(videoId: string, watchPercent: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${videoId}/track-completion`, {
      watchPercent
    });
  }
}
