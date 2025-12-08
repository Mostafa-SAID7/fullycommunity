/**
 * Admin Settings Interfaces
 */

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

export interface EmailTestResponse {
  success: boolean;
  message: string;
}

export interface SystemInfo {
  version: string;
  environment: string;
  uptime: string;
}
