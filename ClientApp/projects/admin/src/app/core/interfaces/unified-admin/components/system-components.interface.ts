/**
 * System Management Components
 * Components used in advanced system management
 */

import {
  EnvironmentType,
  EnvironmentStatus,
  DeploymentStatus,
  ThreatType,
  ThreatStatus,
  VulnerabilitySeverity,
  SecurityAction,
  BackupType,
  BackupStatus,
  StorageProvider,
  MonitorType,
  MonitorStatus,
  IncidentSeverity,
  IncidentStatus,
  ServiceStatus,
  MaintenanceStatus,
  ChangeType,
  ChangeStatus,
  IntegrationType,
  IntegrationStatus,
  SyncStatus,
  ConnectorType,
  ConnectorStatus,
  ScheduleFrequency
} from '../enums/admin-enums';

import {
  ConfigurationSetting,
  FeatureFlag,
  PriorityLevel,
  AlertType
} from '../../../common/admin-common.interface';

/**
 * Configuration Management
 */
export interface ConfigurationManagement {
  settings: ConfigurationSetting[];
  featureFlags: FeatureFlag[];
  environments: Environment[];
  deployments: Deployment[];
}

/**
 * Environment
 */
export interface Environment {
  name: string;
  type: EnvironmentType;
  url: string;
  status: EnvironmentStatus;
  version: string;
  lastDeployment: string;
}

/**
 * Deployment
 */
export interface Deployment {
  id: string;
  version: string;
  environment: string;
  status: DeploymentStatus;
  deployedBy: string;
  deployedAt: string;
  rollbackAvailable: boolean;
  changes: string[];
}

/**
 * Security Management
 */
export interface SecurityManagement {
  threats: SecurityThreat[];
  vulnerabilities: SecurityVulnerability[];
  accessLogs: AccessLog[];
  securityPolicies: SecurityPolicy[];
}

/**
 * Security Threat
 */
export interface SecurityThreat {
  id: string;
  type: ThreatType;
  severity: PriorityLevel;
  source: string;
  description: string;
  status: ThreatStatus;
  detectedAt: string;
  resolvedAt: string | null;
}

/**
 * Security Vulnerability
 */
export interface SecurityVulnerability {
  id: string;
  cve: string | null;
  severity: VulnerabilitySeverity;
  component: string;
  version: string;
  description: string;
  fixAvailable: boolean;
  patchedAt: string | null;
}

/**
 * Access Log
 */
export interface AccessLog {
  id: string;
  userId: string | null;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  suspicious: boolean;
}

/**
 * Security Policy
 */
export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  rules: SecurityRule[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Security Rule
 */
export interface SecurityRule {
  condition: string;
  action: SecurityAction;
  parameters: any;
}

/**
 * Backup Management
 */
export interface BackupManagement {
  backups: Backup[];
  schedule: BackupSchedule;
  retention: BackupRetention;
  storage: BackupStorage;
}

/**
 * Backup
 */
export interface Backup {
  id: string;
  type: BackupType;
  size: number;
  status: BackupStatus;
  createdAt: string;
  completedAt: string | null;
  location: string;
  checksum: string | null;
}

/**
 * Backup Schedule
 */
export interface BackupSchedule {
  enabled: boolean;
  frequency: ScheduleFrequency;
  time: string;
  timezone: string;
  retryAttempts: number;
}

/**
 * Backup Retention
 */
export interface BackupRetention {
  dailyRetention: number;
  weeklyRetention: number;
  monthlyRetention: number;
  yearlyRetention: number;
}

/**
 * Backup Storage
 */
export interface BackupStorage {
  provider: StorageProvider;
  location: string;
  encryption: boolean;
  compression: boolean;
  totalSize: number;
  availableSpace: number;
}

/**
 * Monitoring Management
 */
export interface MonitoringManagement {
  monitors: Monitor[];
  alerts: MonitoringAlert[];
  incidents: Incident[];
  statusPage: StatusPage;
}

/**
 * Monitor
 */
export interface Monitor {
  id: string;
  name: string;
  type: MonitorType;
  target: string;
  interval: number;
  timeout: number;
  enabled: boolean;
  status: MonitorStatus;
  lastCheck: string | null;
  responseTime: number | null;
}

/**
 * Monitoring Alert
 */
export interface MonitoringAlert {
  id: string;
  monitorId: string;
  type: AlertType;
  severity: PriorityLevel;
  message: string;
  triggeredAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

/**
 * Incident
 */
export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedServices: string[];
  startedAt: string;
  resolvedAt: string | null;
  updates: IncidentUpdate[];
}

/**
 * Incident Update
 */
export interface IncidentUpdate {
  id: string;
  message: string;
  status: IncidentStatus;
  createdAt: string;
  createdBy: string;
}

/**
 * Status Page
 */
export interface StatusPage {
  overallStatus: ServiceStatus;
  services: ServiceStatusInfo[];
  incidents: Incident[];
  maintenances: Maintenance[];
  lastUpdated: string;
}

/**
 * Service Status Info
 */
export interface ServiceStatusInfo {
  name: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  lastIncident: string | null;
}

/**
 * Maintenance
 */
export interface Maintenance {
  id: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: MaintenanceStatus;
  affectedServices: string[];
}

/**
 * Maintenance Management
 */
export interface MaintenanceManagement {
  scheduledMaintenance: Maintenance[];
  maintenanceWindows: MaintenanceWindow[];
  changeRequests: ChangeRequest[];
}

/**
 * Maintenance Window
 */
export interface MaintenanceWindow {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  timezone: string;
  recurrence: RecurringSchedule | null;
  enabled: boolean;
}

/**
 * Recurring Schedule
 */
export interface RecurringSchedule {
  frequency: ScheduleFrequency;
  interval: number;
  daysOfWeek: number[];
  endDate: string | null;
}

/**
 * Change Request
 */
export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  type: ChangeType;
  priority: PriorityLevel;
  status: ChangeStatus;
  requestedBy: string;
  approvedBy: string | null;
  scheduledDate: string | null;
  implementedDate: string | null;
  rollbackPlan: string | null;
}

/**
 * Integration Management
 */
export interface IntegrationManagement {
  integrations: Integration[];
  apiKeys: APIKey[];
  webhooks: Webhook[];
  connectors: Connector[];
}

/**
 * Integration
 */
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  configuration: any;
  lastSync: string | null;
  syncStatus: SyncStatus;
  errorCount: number;
  createdAt: string;
}

/**
 * API Key
 */
export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit: number;
  expiresAt: string | null;
  lastUsed: string | null;
  usageCount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

/**
 * Webhook
 */
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryAttempts: number;
  lastTriggered: string | null;
  successCount: number;
  failureCount: number;
  createdAt: string;
}

/**
 * Connector
 */
export interface Connector {
  id: string;
  name: string;
  type: ConnectorType;
  source: string;
  destination: string;
  mapping: FieldMapping[];
  schedule: ConnectorSchedule;
  status: ConnectorStatus;
  lastRun: string | null;
  nextRun: string | null;
}

/**
 * Field Mapping
 */
export interface FieldMapping {
  sourceField: string;
  destinationField: string;
  transformation: string | null;
  required: boolean;
}

/**
 * Connector Schedule
 */
export interface ConnectorSchedule {
  frequency: ScheduleFrequency;
  interval: number;
  time: string | null;
  enabled: boolean;
}