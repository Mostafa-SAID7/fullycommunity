import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProfileTheme,
  ProfileWidget,
  ProfileStatus,
  ProfileVisitor,
  ProfileAnalytics
} from '../../interfaces/profile/profile-customization.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileCustomizationService {
  private readonly apiUrl = `${environment.apiUrl}/profile/customization`;

  constructor(private http: HttpClient) {}

  /**
   * Get profile theme
   */
  getTheme(userId: string): Observable<ProfileTheme> {
    return this.http.get<ProfileTheme>(`${this.apiUrl}/${userId}/theme`);
  }

  /**
   * Update profile theme
   */
  updateTheme(theme: Partial<ProfileTheme>): Observable<ProfileTheme> {
    return this.http.put<ProfileTheme>(`${this.apiUrl}/theme`, theme);
  }

  /**
   * Reset theme to default
   */
  resetTheme(): Observable<ProfileTheme> {
    return this.http.post<ProfileTheme>(`${this.apiUrl}/theme/reset`, {});
  }

  /**
   * Get profile widgets
   */
  getWidgets(userId: string): Observable<ProfileWidget[]> {
    return this.http.get<ProfileWidget[]>(`${this.apiUrl}/${userId}/widgets`);
  }

  /**
   * Update widget
   */
  updateWidget(widgetId: string, widget: Partial<ProfileWidget>): Observable<ProfileWidget> {
    return this.http.put<ProfileWidget>(`${this.apiUrl}/widgets/${widgetId}`, widget);
  }

  /**
   * Reorder widgets
   */
  reorderWidgets(widgetIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/widgets/reorder`, { widgetIds });
  }

  /**
   * Get profile status
   */
  getStatus(userId: string): Observable<ProfileStatus> {
    return this.http.get<ProfileStatus>(`${this.apiUrl}/${userId}/status`);
  }

  /**
   * Update profile status
   */
  updateStatus(status: Partial<ProfileStatus>): Observable<ProfileStatus> {
    return this.http.put<ProfileStatus>(`${this.apiUrl}/status`, status);
  }

  /**
   * Clear profile status
   */
  clearStatus(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/status`);
  }

  /**
   * Get profile visitors
   */
  getVisitors(page: number = 1, pageSize: number = 20): Observable<ProfileVisitor[]> {
    return this.http.get<ProfileVisitor[]>(`${this.apiUrl}/visitors`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Track profile view
   */
  trackView(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/view`, {});
  }

  /**
   * Get profile analytics
   */
  getAnalytics(timeRange: string = 'week'): Observable<ProfileAnalytics> {
    return this.http.get<ProfileAnalytics>(`${this.apiUrl}/analytics`, {
      params: { timeRange }
    });
  }

  /**
   * Clear visitor history
   */
  clearVisitors(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/visitors`);
  }
}
