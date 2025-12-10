import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  ProfileActivity,
  ActivityLog,
  LoginHistory,
  ActiveSession
} from '../../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileActivityService {
  private readonly apiUrl = `${environment.apiUrl}/profile/activity`;

  constructor(private http: HttpClient) {}

  /**
   * Get profile activity
   */
  getActivity(): Observable<ProfileActivity> {
    return this.http.get<ProfileActivity>(this.apiUrl);
  }

  /**
   * Get activity log
   */
  getActivityLog(page: number = 1, pageSize: number = 20): Observable<PagedResult<ActivityLog>> {
    return this.http.get<PagedResult<ActivityLog>>(`${this.apiUrl}/log`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get login history
   */
  getLoginHistory(page: number = 1, pageSize: number = 20): Observable<PagedResult<LoginHistory>> {
    return this.http.get<PagedResult<LoginHistory>>(`${this.apiUrl}/login-history`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): Observable<ActiveSession[]> {
    return this.http.get<ActiveSession[]>(`${this.apiUrl}/sessions`);
  }

  /**
   * Terminate session
   */
  terminateSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${sessionId}`);
  }

  /**
   * Terminate all sessions except current
   */
  terminateAllSessions(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/all`);
  }

  /**
   * Clear activity log
   */
  clearActivityLog(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/log`);
  }
}
