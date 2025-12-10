/**
 * Unified Admin Enums
 * All enums used in the unified admin system
 */

/**
 * Alert Type
 */
export enum AlertType {
  Security = 0,
  Performance = 1,
  Content = 2,
  User = 3,
  System = 4,
  Revenue = 5,
  Compliance = 6
}

/**
 * User Account Type
 */
export enum UserAccountType {
  Individual = 0,
  Business = 1,
  Creator = 2,
  Enterprise = 3,
  Developer = 4,
  Partner = 5
}

/**
 * Subscription Tier
 */
export enum SubscriptionTier {
  Free = 0,
  Basic = 1,
  Premium = 2,
  Pro = 3,
  Enterprise = 4
}

/**
 * Risk Level
 */
export enum RiskLevel {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

/**
 * Payment Method Type
 */
export enum PaymentMethodType {
  CreditCard = 0,
  DebitCard = 1,
  BankAccount = 2,
  PayPal = 3,
  Stripe = 4,
  Crypto = 5
}

/**
 * Subscription Status
 */
export enum SubscriptionStatus {
  Active = 0,
  Inactive = 1,
  Cancelled = 2,
  Expired = 3,
  PastDue = 4,
  Trialing = 5
}

/**
 * Visibility Level
 */
export enum VisibilityLevel {
  Public = 0,
  Friends = 1,
  Private = 2
}

/**
 * Warning Type
 */
export enum WarningType {
  Violence = 0,
  Adult = 1,
  Hate = 2,
  Spam = 3,
  Copyright = 4,
  Misinformation = 5,
  Harassment = 6
}

/**
 * Difficulty Level
 */
export enum DifficultyLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
  Expert = 3
}

/**
 * Age Rating
 */
export enum AgeRating {
  AllAges = 0,
  Teen = 1,
  Mature = 2,
  Adult = 3
}

/**
 * Media Type
 */
export enum MediaType {
  Image = 0,
  Video = 1,
  Audio = 2,
  Document = 3,
  Archive = 4
}

/**
 * Schedule Frequency
 */
export enum ScheduleFrequency {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3
}

/**
 * Parameter Type
 */
export enum ParameterType {
  String = 0,
  Number = 1,
  Date = 2,
  Boolean = 3,
  Select = 4,
  MultiSelect = 5
}

/**
 * Report Format
 */
export enum ReportFormat {
  PDF = 0,
  Excel = 1,
  CSV = 2,
  JSON = 3,
  HTML = 4
}

/**
 * Environment Type
 */
export enum EnvironmentType {
  Development = 0,
  Staging = 1,
  Production = 2,
  Testing = 3
}

/**
 * Environment Status
 */
export enum EnvironmentStatus {
  Online = 0,
  Offline = 1,
  Maintenance = 2,
  Error = 3
}

/**
 * Deployment Status
 */
export enum DeploymentStatus {
  Pending = 0,
  InProgress = 1,
  Success = 2,
  Failed = 3,
  RolledBack = 4
}

/**
 * Threat Type
 */
export enum ThreatType {
  Malware = 0,
  Phishing = 1,
  DDoS = 2,
  BruteForce = 3,
  SQLInjection = 4,
  XSS = 5,
  CSRF = 6
}

/**
 * Threat Status
 */
export enum ThreatStatus {
  Active = 0,
  Mitigated = 1,
  Resolved = 2,
  FalsePositive = 3
}

/**
 * Vulnerability Severity
 */
export enum VulnerabilitySeverity {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

/**
 * Security Action
 */
export enum SecurityAction {
  Allow = 0,
  Block = 1,
  Log = 2,
  Alert = 3,
  RateLimit = 4
}

/**
 * Backup Type
 */
export enum BackupType {
  Full = 0,
  Incremental = 1,
  Differential = 2
}

/**
 * Backup Status
 */
export enum BackupStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Failed = 3,
  Corrupted = 4
}

/**
 * Storage Provider
 */
export enum StorageProvider {
  Local = 0,
  AWS = 1,
  Azure = 2,
  GoogleCloud = 3,
  DigitalOcean = 4
}

/**
 * Monitor Type
 */
export enum MonitorType {
  HTTP = 0,
  HTTPS = 1,
  TCP = 2,
  UDP = 3,
  DNS = 4,
  Database = 5,
  API = 6
}

/**
 * Monitor Status
 */
export enum MonitorStatus {
  Up = 0,
  Down = 1,
  Warning = 2,
  Unknown = 3
}

/**
 * Incident Severity
 */
export enum IncidentSeverity {
  Minor = 0,
  Major = 1,
  Critical = 2
}

/**
 * Incident Status
 */
export enum IncidentStatus {
  Investigating = 0,
  Identified = 1,
  Monitoring = 2,
  Resolved = 3
}

/**
 * Service Status
 */
export enum ServiceStatus {
  Operational = 0,
  DegradedPerformance = 1,
  PartialOutage = 2,
  MajorOutage = 3,
  UnderMaintenance = 4
}

/**
 * Maintenance Status
 */
export enum MaintenanceStatus {
  Scheduled = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

/**
 * Change Type
 */
export enum ChangeType {
  Emergency = 0,
  Standard = 1,
  Normal = 2,
  Minor = 3
}

/**
 * Change Status
 */
export enum ChangeStatus {
  Draft = 0,
  Submitted = 1,
  UnderReview = 2,
  Approved = 3,
  Rejected = 4,
  Scheduled = 5,
  InProgress = 6,
  Completed = 7,
  Failed = 8,
  RolledBack = 9
}

/**
 * Integration Type
 */
export enum IntegrationType {
  Authentication = 0,
  Payment = 1,
  Analytics = 2,
  Storage = 3,
  Email = 4,
  SMS = 5,
  Social = 6,
  CRM = 7,
  ERP = 8
}

/**
 * Integration Status
 */
export enum IntegrationStatus {
  Active = 0,
  Inactive = 1,
  Error = 2,
  Syncing = 3,
  Paused = 4
}

/**
 * Sync Status
 */
export enum SyncStatus {
  Success = 0,
  Failed = 1,
  Partial = 2,
  InProgress = 3
}

/**
 * Connector Type
 */
export enum ConnectorType {
  DataSync = 0,
  ETL = 1,
  Replication = 2,
  Migration = 3
}

/**
 * Connector Status
 */
export enum ConnectorStatus {
  Active = 0,
  Inactive = 1,
  Running = 2,
  Error = 3,
  Paused = 4
}