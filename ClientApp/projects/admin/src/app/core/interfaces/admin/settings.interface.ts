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

export interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  createdAt: Date;
  type: 'manual' | 'automatic';
}

export interface MaintenanceWindow {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  message: string;
}