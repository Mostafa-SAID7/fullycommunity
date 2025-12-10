import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  HomeWidget,
  QuickAction,
  HomeLayout
} from '../../interfaces/home/widgets.interface';

@Injectable({
  providedIn: 'root'
})
export class WidgetsService {
  private readonly apiUrl = `${environment.apiUrl}/home/widgets`;

  constructor(private http: HttpClient) {}

  /**
   * Get home layout
   */
  getLayout(): Observable<HomeLayout> {
    return this.http.get<HomeLayout>(`${this.apiUrl}/layout`);
  }

  /**
   * Update home layout
   */
  updateLayout(layout: Partial<HomeLayout>): Observable<HomeLayout> {
    return this.http.put<HomeLayout>(`${this.apiUrl}/layout`, layout);
  }

  /**
   * Get widgets
   */
  getWidgets(): Observable<HomeWidget[]> {
    return this.http.get<HomeWidget[]>(this.apiUrl);
  }

  /**
   * Add widget
   */
  addWidget(widget: Partial<HomeWidget>): Observable<HomeWidget> {
    return this.http.post<HomeWidget>(this.apiUrl, widget);
  }

  /**
   * Update widget
   */
  updateWidget(widgetId: string, widget: Partial<HomeWidget>): Observable<HomeWidget> {
    return this.http.put<HomeWidget>(`${this.apiUrl}/${widgetId}`, widget);
  }

  /**
   * Delete widget
   */
  deleteWidget(widgetId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${widgetId}`);
  }

  /**
   * Reorder widgets
   */
  reorderWidgets(widgetIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reorder`, { widgetIds });
  }

  /**
   * Get quick actions
   */
  getQuickActions(): Observable<QuickAction[]> {
    return this.http.get<QuickAction[]>(`${this.apiUrl}/quick-actions`);
  }

  /**
   * Update quick actions
   */
  updateQuickActions(actions: QuickAction[]): Observable<QuickAction[]> {
    return this.http.put<QuickAction[]>(`${this.apiUrl}/quick-actions`, actions);
  }

  /**
   * Reset to default layout
   */
  resetLayout(): Observable<HomeLayout> {
    return this.http.post<HomeLayout>(`${this.apiUrl}/layout/reset`, {});
  }
}
