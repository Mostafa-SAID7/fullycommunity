import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PodcastAnalyticsSummary,
  PodcastDailyAnalytics,
  PodcastDemographics,
  TopEpisode,
  TrafficSources,
  EpisodeAnalyticsSummary,
  EpisodeDailyAnalytics,
  EpisodeDemographics,
  RetentionData,
  RevenueAnalytics
} from '../../interfaces/podcasts';

@Injectable({
  providedIn: 'root'
})
export class PodcastAnalyticsService {
  private readonly apiUrl = `${environment.apiUrl}/podcasts`;

  constructor(private http: HttpClient) {}

  // ========== Podcast Analytics ==========

  /**
   * Get podcast analytics summary
   */
  getPodcastSummary(podcastId: string, startDate: string, endDate: string): Observable<PodcastAnalyticsSummary> {
    return this.http.get<PodcastAnalyticsSummary>(`${this.apiUrl}/${podcastId}/analytics/summary`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get podcast daily analytics
   */
  getPodcastDaily(podcastId: string, startDate: string, endDate: string): Observable<PodcastDailyAnalytics[]> {
    return this.http.get<PodcastDailyAnalytics[]>(`${this.apiUrl}/${podcastId}/analytics/daily`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get podcast demographics
   */
  getPodcastDemographics(podcastId: string, startDate: string, endDate: string): Observable<PodcastDemographics> {
    return this.http.get<PodcastDemographics>(`${this.apiUrl}/${podcastId}/analytics/demographics`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get top episodes
   */
  getTopEpisodes(podcastId: string, startDate: string, endDate: string, limit: number = 10): Observable<TopEpisode[]> {
    return this.http.get<TopEpisode[]>(`${this.apiUrl}/${podcastId}/analytics/top-episodes`, {
      params: { startDate, endDate, limit: limit.toString() }
    });
  }

  /**
   * Get traffic sources
   */
  getTrafficSources(podcastId: string, startDate: string, endDate: string): Observable<TrafficSources> {
    return this.http.get<TrafficSources>(`${this.apiUrl}/${podcastId}/analytics/traffic-sources`, {
      params: { startDate, endDate }
    });
  }

  // ========== Episode Analytics ==========

  /**
   * Get episode analytics summary
   */
  getEpisodeSummary(episodeId: string, startDate: string, endDate: string): Observable<EpisodeAnalyticsSummary> {
    return this.http.get<EpisodeAnalyticsSummary>(`${this.apiUrl}/episodes/${episodeId}/analytics/summary`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get episode daily analytics
   */
  getEpisodeDaily(episodeId: string, startDate: string, endDate: string): Observable<EpisodeDailyAnalytics[]> {
    return this.http.get<EpisodeDailyAnalytics[]>(`${this.apiUrl}/episodes/${episodeId}/analytics/daily`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get episode demographics
   */
  getEpisodeDemographics(episodeId: string, startDate: string, endDate: string): Observable<EpisodeDemographics> {
    return this.http.get<EpisodeDemographics>(`${this.apiUrl}/episodes/${episodeId}/analytics/demographics`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get retention data
   */
  getRetentionData(episodeId: string): Observable<RetentionData> {
    return this.http.get<RetentionData>(`${this.apiUrl}/episodes/${episodeId}/analytics/retention`);
  }

  // ========== Revenue Analytics ==========

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics(podcastId: string, startDate: string, endDate: string): Observable<RevenueAnalytics> {
    return this.http.get<RevenueAnalytics>(`${this.apiUrl}/${podcastId}/analytics/revenue`, {
      params: { startDate, endDate }
    });
  }
}
