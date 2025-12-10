/**
 * System Settings
 * Platform configuration and settings
 */
export interface SystemSettings {
  id: string;
  
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  
  // Features
  enableRegistration: boolean;
  enableEmailVerification: boolean;
  enablePhoneVerification: boolean;
  enableTwoFactor: boolean;
  enableSocialLogin: boolean;
  
  // Content Settings
  enableContentModeration: boolean;
  autoApproveContent: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  
  // User Settings
  defaultUserRole: string;
  maxFollowersPerUser: number;
  maxPostsPerDay: number;
  
  // Email Settings
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUsername: string | null;
  smtpPassword: string | null;
  fromEmail: string | null;
  fromName: string | null;
  
  // Storage Settings
  storageProvider: string;
  storageConfig: any;
  
  // API Settings
  apiRateLimit: number;
  apiTimeout: number;
  
  // Security Settings
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  
  updatedAt: string;
  updatedBy: string;
}

/**
 * System Health
 */
export interface SystemHealth {
  status: SystemStatus;
  
  // Services
  database: ServiceHealth;
  redis: ServiceHealth;
  storage: ServiceHealth;
  email: ServiceHealth;
  
  // Performance
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  
  // Metrics
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
  averageResponseTime: number;
  
  // Uptime
  uptime: number;
  lastRestart: string;
  
  checkedAt: string;
}

/**
 * System Status
 */
export enum SystemStatus {
  Healthy = 0,
  Warning = 1,
  Critical = 2,
  Maintenance = 3,
  Offline = 4
}

/**
 * Service Health
 */
export interface ServiceHealth {
  status: ServiceStatus;
  responseTime: number | null;
  lastChecked: string;
  errorMessage: string | null;
}

/**
 * Service Status
 */
export enum ServiceStatus {
  Online = 0,
  Offline = 1,
  Degraded = 2,
  Unknown = 3
}

/**
 * System Log
 */
export interface SystemLog {
  id: string;
  level: LogLevel;
  message: string;
  category: string;
  userId: string | null;
  userName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: any;
  createdAt: string;
}

/**
 * Log Level
 */
export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
  Critical = 4
}

/**
 * Backup
 */
export interface Backup {
  id: string;
  name: string;
  type: BackupType;
  size: number;
  status: BackupStatus;
  progress: number;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  createdBy: string;
}

/**
 * Backup Type
 */
export enum BackupType {
  Full = 0,
  Incremental = 1,
  Database = 2,
  Files = 3
}

/**
 * Backup Status
 */
export enum BackupStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4
}

/**
 * System Notification
 */
export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  targetAudience: NotificationAudience;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdBy: string;
  createdAt: string;
}

/**
 * Notification Type
 */
export enum NotificationType {
  Info = 0,
  Warning = 1,
  Error = 2,
  Maintenance = 3,
  Feature = 4,
  Security = 5
}

/**
 * Notification Priority
 */
export enum NotificationPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

/**
 * Notification Audience
 */
export enum NotificationAudience {
  AllUsers = 0,
  Admins = 1,
  Moderators = 2,
  VerifiedUsers = 3,
  PremiumUsers = 4
}