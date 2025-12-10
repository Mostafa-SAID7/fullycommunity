import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProfileStatistics,
  ContentStatistics,
  GrowthStatistics
} from '../../interfaces/profile/profile-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileStatsService {
  private readonly apiUrl = `${environment.apiUrl}/profile/stats`;

  constructor(private http: HttpClient) {}

  /**
   * Get profile statistics
   */
  getProfileStatistics(userId: string): Observable<ProfileStatistics> {
    return this.http.get<ProfileStatistics>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Get content statistics
   */
  getContentStatistics(contentId: string, contentType: string): Observable<ContentStatistics> {
    return this.http.get<ContentStatistics>(`${this.apiUrl}/content/${contentId}`, {
      params: { contentType }
    });
  }

  /**
   * Get growth statistics
   */
  getGrowthStatistics(userId: string, timeRange: string): Observable<GrowthStatistics> {
    return this.http.get<GrowthStatistics>(`${this.apiUrl}/${userId}/growth`, {
      params: { timeRange }
    });
  }

  /**
   * Get follower demographics
   */
  getFollowerDemographics(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/demographics`);
  }

  /**
   * Get engagement trends
   */
  getEngagementTrends(userId: string, days: number = 30): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/engagement-trends`, {
      params: { days: days.toString() }
    });
  }

  /**
   * Export statistics
   */
  exportStatistics(userId: string, format: string = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${userId}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }
}
