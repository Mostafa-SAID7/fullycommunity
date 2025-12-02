import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  defaultLanguage: string;
  supportedLanguages: string[];
  maxUploadSizeMb: number;
  allowedFileTypes: string[];
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  senderEmail: string;
  senderName: string;
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  passwordMinLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  sessionTimeoutMinutes: number;
  twoFactorEnabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/settings`;

  constructor(private http: HttpClient) {}

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

  testEmailConnection(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/email/test`, {});
  }

  clearCache(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cache/clear`, {});
  }

  getSystemInfo(): Observable<{ version: string; environment: string; uptime: string }> {
    return this.http.get<{ version: string; environment: string; uptime: string }>(`${this.apiUrl}/system-info`);
  }
}
