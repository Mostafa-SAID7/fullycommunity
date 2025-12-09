import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SiteSettings,
  EmailSettings,
  SecuritySettings,
  EmailTestResponse,
  SystemInfo
} from '../../interfaces/admin/settings.interface';

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/settings`;

  getSiteSettings(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.apiUrl}/site`);
  }

  updateSiteSettings(settings: Partial<SiteSettings>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/site`, settings);
  }

  getEmailSettings(): Observable<EmailSettings> {
    return this.http.get<EmailSettings>(`${this.apiUrl}/email`);
  }

  updateEmailSettings(settings: Partial<EmailSettings>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/email`, settings);
  }

  getSecuritySettings(): Observable<SecuritySettings> {
    return this.http.get<SecuritySettings>(`${this.apiUrl}/security`);
  }

  updateSecuritySettings(settings: Partial<SecuritySettings>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/security`, settings);
  }

  testEmailConnection(): Observable<EmailTestResponse> {
    return this.http.post<EmailTestResponse>(`${this.apiUrl}/email/test`, {});
  }

  clearCache(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cache/clear`, {});
  }

  getSystemInfo(): Observable<SystemInfo> {
    return this.http.get<SystemInfo>(`${this.apiUrl}/system-info`);
  }
}
