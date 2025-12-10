/**
 * System Management Responses
 * Response interfaces for system management operations
 */

import {
  Environment,
  Deployment,
  SecurityThreat,
  SecurityVulnerability,
  AccessLog,
  SecurityPolicy,
  Backup,
  Monitor,
  Incident,
  Maintenance,
  Integration,
  APIKey,
  Webhook,
  Connector
} from '../components/system-components.interface';

/**
 * System Health Response
 */
export interface SystemHealthResponse {
  overallStatus: SystemStatus;
  services: ServiceHealth[];
  metrics: SystemHealthMetrics;
  alerts: SystemAlert[];
  lastUpdated: string;
}

/**
 * System Status
 */
export enum SystemStatus {
  Healthy = 0,
  Warning = 1,
  Critical = 2,
  Maintenance = 3
}

/**
 * Service Health
 */
export interface ServiceHealth {
  name: string;
  status: SystemStatus;
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastCheck: string;
  dependencies: ServiceDependency[];
}

/**
 * Service Dependency
 */
export interface ServiceDependency {
  name: string;
  status: SystemStatus;
  required: boolean;
}

/**
 * System Health Metrics
 */
export interface SystemHealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
  queueSize: number;
  errorRate: number;
  throughput: number;
}

/**
 * System Alert
 */
export interface SystemAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  service?: string;
  timestamp: string;
  acknowledged: boolean;
}

/**
 * Configuration Response
 */
export interface ConfigurationResponse {
  settings: ConfigurationItem[];
  environments: Environment[];
  total: number;
}

/**
 * Configuration Item
 */
export interface ConfigurationItem {
  key: string;
  value: any;
  type: string;
  environment: string;
  description?: string;
  encrypted: boolean;
  lastModified: string;
  modifiedBy: string;
}

/**
 * Deployment Response
 */
export interface DeploymentResponse {
  deployments: Deployment[];
  total: number;
  active: number;
  failed: number;
  pending: number;
}

/**
 * Security Dashboard Response
 */
export interface SecurityDashboardResponse {
  overview: SecurityOverview;
  threats: SecurityThreat[];
  vulnerabilities: SecurityVulnerability[];
  recentLogs: AccessLog[];
  policies: SecurityPolicy[];
}

/**
 * Security Overview
 */
export interface SecurityOverview {
  threatLevel: string;
  activeThreats: number;
  vulnerabilities: number;
  criticalVulnerabilities: number;
  blockedAttempts: number;
  suspiciousActivity: number;
  lastScan: string;
}

/**
 * Backup Response
 */
export interface BackupResponse {
  backups: Backup[];
  total: number;
  totalSize: number;
  lastBackup?: string;
  nextBackup?: string;
  storageUsage: StorageUsage;
}

/**
 * Storage Usage
 */
export interface StorageUsage {
  used: number;
  available: number;
  total: number;
  percentage: number;
}

/**
 * Monitoring Response
 */
export interface MonitoringResponse {
  monitors: Monitor[];
  total: number;
  active: number;
  down: number;
  warning: number;
  averageResponseTime: number;
}

/**
 * Incident Response
 */
export interface IncidentResponse {
  incidents: Incident[];
  total: number;
  open: number;
  resolved: number;
  averageResolutionTime: number;
}

/**
 * Maintenance Response
 */
export interface MaintenanceResponse {
  maintenances: Maintenance[];
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  upcoming: Maintenance[];
}

/**
 * Integration Response
 */
export interface IntegrationResponse {
  integrations: Integration[];
  total: number;
  active: number;
  inactive: number;
  errors: number;
}

/**
 * API Keys Response
 */
export interface APIKeysResponse {
  apiKeys: APIKey[];
  total: number;
  active: number;
  expired: number;
  usage: APIKeyUsage[];
}

/**
 * API Key Usage
 */
export interface APIKeyUsage {
  keyId: string;
  name: string;
  requests: number;
  errors: number;
  lastUsed: string;
  rateLimit: number;
  rateLimitRemaining: number;
}

/**
 * Webhooks Response
 */
export interface WebhooksResponse {
  webhooks: Webhook[];
  total: number;
  active: number;
  inactive: number;
  totalDeliveries: number;
  successRate: number;
}

/**
 * Connectors Response
 */
export interface ConnectorsResponse {
  connectors: Connector[];
  total: number;
  active: number;
  inactive: number;
  running: number;
  errors: number;
}

/**
 * System Logs Response
 */
export interface SystemLogsResponse {
  logs: SystemLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  filters: LogFilter[];
}

/**
 * System Log Entry
 */
export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  metadata?: any;
  userId?: string;
  sessionId?: string;
  requestId?: string;
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
 * Log Filter
 */
export interface LogFilter {
  field: string;
  operator: string;
  value: any;
  label: string;
}

/**
 * System Action Response
 */
export interface SystemActionResponse {
  success: boolean;
  message: string;
  actionId?: string;
  affectedServices?: string[];
  estimatedDuration?: number;
}

/**
 * System Metrics Response
 */
export interface SystemMetricsResponse {
  metrics: SystemMetricData[];
  timeRange: TimeRange;
  granularity: string;
}

/**
 * System Metric Data
 */
export interface SystemMetricData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
}

/**
 * Time Range
 */
export interface TimeRange {
  start: string;
  end: string;
  duration: string;
}