import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  UserGrowthData,
  ContentEngagementData,
  TopContent,
  AnalyticsOverview,
  ReportData,
  RealtimeStats,
  PlatformSummary,
  ReportPeriod,
  ReportType,
  ExportFormat,
  DetailedUserGrowthTrends,
  DetailedContentEngagement,
  LocalizationData,
  SupportedLanguage,
  Translation,
  ContentTranslation,
  TranslationStats
} from '../../interfaces/admin/reports.interface';

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/reports`;
  private localizationUrl = `${environment.apiUrl}/api/admin/localization`;

  // Basic Analytics Methods
  getAnalyticsOverview(period: ReportPeriod = 'month'): Observable<AnalyticsOverview> {
    const params = new HttpParams().set('period', period);
    return this.http.get<AnalyticsOverview>(`${this.apiUrl}/overview`, { params });
  }

  getUserGrowth(startDate: string, endDate: string): Observable<UserGrowthData[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<UserGrowthData[]>(`${this.apiUrl}/user-growth`, { params });
  }

  getContentEngagement(startDate: string, endDate: string): Observable<ContentEngagementData[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<ContentEngagementData[]>(`${this.apiUrl}/content-engagement`, { params });
  }

  getTopContent(limit = 10, type?: string): Observable<TopContent[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (type) params = params.set('type', type);
    return this.http.get<TopContent[]>(`${this.apiUrl}/top-content`, { params });
  }

  getRealtimeStats(): Observable<RealtimeStats> {
    return this.http.get<RealtimeStats>(`${this.apiUrl}/realtime`);
  }

  getSummary(): Observable<PlatformSummary> {
    return this.http.get<PlatformSummary>(`${this.apiUrl}/summary`);
  }

  // Enhanced Analytics Methods
  getDetailedUserGrowthTrends(period: ReportPeriod): Observable<DetailedUserGrowthTrends> {
    const params = new HttpParams().set('period', period);
    return this.http.get<DetailedUserGrowthTrends>(`${this.apiUrl}/user-growth/detailed`, { params });
  }

  getDetailedContentEngagement(period: ReportPeriod): Observable<DetailedContentEngagement> {
    const params = new HttpParams().set('period', period);
    return this.http.get<DetailedContentEngagement>(`${this.apiUrl}/content-engagement/detailed`, { params });
  }

  // Export Methods
  exportReport(type: ReportType, format: ExportFormat, period?: ReportPeriod): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    if (period) params = params.set('period', period);
    return this.http.get(`${this.apiUrl}/export/${type}`, { 
      params, 
      responseType: 'blob' 
    });
  }

  // Localization Management Methods
  getLocalizationData(): Observable<LocalizationData> {
    return this.http.get<LocalizationData>(`${this.localizationUrl}/data`);
  }

  getSupportedLanguages(): Observable<SupportedLanguage[]> {
    return this.http.get<SupportedLanguage[]>(`${this.localizationUrl}/languages`);
  }

  addLanguage(language: Partial<SupportedLanguage>): Observable<SupportedLanguage> {
    return this.http.post<SupportedLanguage>(`${this.localizationUrl}/languages`, language);
  }

  updateLanguage(code: string, updates: Partial<SupportedLanguage>): Observable<SupportedLanguage> {
    return this.http.put<SupportedLanguage>(`${this.localizationUrl}/languages/${code}`, updates);
  }

  deleteLanguage(code: string): Observable<void> {
    return this.http.delete<void>(`${this.localizationUrl}/languages/${code}`);
  }

  getTranslations(languageCode?: string, category?: string): Observable<Translation[]> {
    let params = new HttpParams();
    if (languageCode) params = params.set('language', languageCode);
    if (category) params = params.set('category', category);
    return this.http.get<Translation[]>(`${this.localizationUrl}/translations`, { params });
  }

  updateTranslation(id: string, languageCode: string, value: string): Observable<Translation> {
    return this.http.put<Translation>(`${this.localizationUrl}/translations/${id}`, {
      languageCode,
      value
    });
  }

  bulkUpdateTranslations(updates: { id: string; languageCode: string; value: string }[]): Observable<Translation[]> {
    return this.http.put<Translation[]>(`${this.localizationUrl}/translations/bulk`, { updates });
  }

  getContentTranslations(contentType?: string, languageCode?: string): Observable<ContentTranslation[]> {
    let params = new HttpParams();
    if (contentType) params = params.set('type', contentType);
    if (languageCode) params = params.set('language', languageCode);
    return this.http.get<ContentTranslation[]>(`${this.localizationUrl}/content-translations`, { params });
  }

  updateContentTranslation(id: string, languageCode: string, translation: { title: string; content: string }): Observable<ContentTranslation> {
    return this.http.put<ContentTranslation>(`${this.localizationUrl}/content-translations/${id}`, {
      languageCode,
      translation
    });
  }

  getTranslationStats(): Observable<TranslationStats> {
    return this.http.get<TranslationStats>(`${this.localizationUrl}/stats`);
  }

  exportTranslations(languageCode: string, format: ExportFormat = 'json'): Observable<Blob> {
    const params = new HttpParams()
      .set('language', languageCode)
      .set('format', format);
    return this.http.get(`${this.localizationUrl}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }

  importTranslations(languageCode: string, file: File): Observable<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('languageCode', languageCode);
    return this.http.post<{ imported: number; errors: string[] }>(`${this.localizationUrl}/import`, formData);
  }
}
