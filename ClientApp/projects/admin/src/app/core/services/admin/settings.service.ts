import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  adminEmail: string;
  supportEmail: string;
  defaultLanguage: string;
  maxUploadSizeMb: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
  enableTls: boolean;
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  sessionTimeout: number;
  accountLockoutDuration: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  requirePasswordComplexity: boolean;
  enableIpWhitelist: boolean;
  logSecurityEvents: boolean;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  twoFactorEnabled: boolean;
}

export interface SystemInfo {
  version: string;
  environment: string;
  uptime: string;
  databaseSize: string;
  cacheSize: string;
  totalUsers: number;
  totalContent: number;
}

export interface TestResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSettingsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/admin/settings`;

  getSiteSettings(): Observable<SiteSettings> {
    // Mock data for development
    return of({
      siteName: 'Community Car',
      siteUrl: 'https://communitycar.com',
      siteDescription: 'The ultimate automotive community platform',
      adminEmail: 'admin@communitycar.com',
      supportEmail: 'support@communitycar.com',
      defaultLanguage: 'en',
      maxUploadSizeMb: 10,
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true
    });
  }

  updateSiteSettings(settings: SiteSettings): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/site`, settings);
  }

  getEmailSettings(): Observable<EmailSettings> {
    // Mock data for development
    return of({
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@communitycar.com',
      smtpPassword: '********',
      fromEmail: 'noreply@communitycar.com',
      fromName: 'Community Car',
      enableSsl: true,
      enableTls: true
    });
  }

  updateEmailSettings(settings: EmailSettings): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/email`, settings);
  }

  testEmailConnection(): Observable<TestResult> {
    // Mock test result
    return of({
      success: true,
      message: 'Email connection successful'
    });
  }

  getSecuritySettings(): Observable<SecuritySettings> {
    // Mock data for development
    return of({
      maxLoginAttempts: 5,
      sessionTimeout: 60,
      accountLockoutDuration: 15,
      passwordMinLength: 8,
      requireTwoFactor: false,
      requirePasswordComplexity: true,
      enableIpWhitelist: false,
      logSecurityEvents: true,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      twoFactorEnabled: false
    });
  }

  updateSecuritySettings(settings: SecuritySettings): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/security`, settings);
  }

  getSystemInfo(): Observable<SystemInfo> {
    // Mock data for development
    return of({
      version: '1.0.0',
      environment: 'Development',
      uptime: '5 days, 12 hours',
      databaseSize: '2.5 GB',
      cacheSize: '128 MB',
      totalUsers: 1247,
      totalContent: 5632
    });
  }

  clearCache(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cache/clear`, {});
  }

  exportSettings(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }

  importSettings(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.apiUrl}/import`, formData);
  }
}