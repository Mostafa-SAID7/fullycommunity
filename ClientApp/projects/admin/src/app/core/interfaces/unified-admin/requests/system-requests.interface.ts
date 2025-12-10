/**
 * System Management Requests
 * Request interfaces for system management operations
 */

import {
  EnvironmentType,
  ThreatType,
  SecurityAction,
  BackupType,
  StorageProvider,
  MonitorType,
  IncidentSeverity,
  MaintenanceStatus,
  ChangeType,
  IntegrationType,
  ConnectorType,
  ScheduleFrequency
} from '../enums/admin-enums';

import { PriorityLevel } from '../../../common/admin-common.interface';

/**
 * Configuration Update Request
 */
export interface ConfigurationUpdateRequest {
  key: string;
  value: any;
  environment?: string;
  description?: string;
  encrypted?: boolean;
}

/**
 * Feature Flag Request
 */
export interface FeatureFlagRequest {
  name: string;
  description?: string;
  enabled: boolean;
  conditions?: FeatureFlagCondition[];
  rolloutPercentage?: number;
  environments?: string[];
}

/**
 * Feature Flag Condition
 */
export interface FeatureFlagCondition {
  type: ConditionType;
  operator: string;
  value: any;
}

/**
 * Condition Type
 */
export enum ConditionType {
  User = 0,
  Group = 1,
  Region = 2,
  Device = 3,
  Custom = 4
}

/**
 * Deployment Request
 */
export interface DeploymentRequest {
  version: string;
  environment: string;
  changes: string[];
  rollbackPlan?: string;
  scheduledAt?: string;
  autoRollback?: boolean;
}

/**
 * Security Policy Request
 */
export interface SecurityPolicyRequest {
  name: string;
  description?: string;
  rules: SecurityRuleRequest[];
  enabled?: boolean;
}

/**
 * Security Rule Request
 */
export interface SecurityRuleRequest {
  condition: string;
  action: SecurityAction;
  parameters?: any;
  priority?: number;
}

/**
 * Threat Response Request
 */
export interface ThreatResponseRequest {
  threatId: string;
  action: ThreatResponseAction;
  notes?: string;
  blockDuration?: number;
}

/**
 * Threat Response Action
 */
export enum ThreatResponseAction {
  Ignore = 0,
  Block = 1,
  Quarantine = 2,
  Investigate = 3,
  Escalate = 4
}

/**
 * Backup Request
 */
export interface BackupRequest {
  type: BackupType;
  description?: string;
  includeFiles?: boolean;
  includeDatabase?: boolean;
  compression?: boolean;
  encryption?: boolean;
}

/**
 * Backup Schedule Request
 */
export interface BackupScheduleRequest {
  enabled: boolean;
  frequency: ScheduleFrequency;
  time: string;
  timezone: string;
  retryAttempts?: number;
  type: BackupType;
  retention?: BackupRetentionRequest;
}

/**
 * Backup Retention Request
 */
export interface BackupRetentionRequest {
  dailyRetention: number;
  weeklyRetention: number;
  monthlyRetention: number;
  yearlyRetention: number;
}

/**
 * Monitor Request
 */
export interface MonitorRequest {
  name: string;
  type: MonitorType;
  target: string;
  interval: number;
  timeout: number;
  enabled?: boolean;
  alertThreshold?: number;
  notifications?: string[];
}

/**
 * Incident Request
 */
export interface IncidentRequest {
  title: string;
  description: string;
  severity: IncidentSeverity;
  affectedServices: string[];
  assignedTo?: string;
}

/**
 * Incident Update Request
 */
export interface IncidentUpdateRequest {
  incidentId: string;
  message: string;
  status?: IncidentStatus;
  notifySubscribers?: boolean;
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
 * Maintenance Request
 */
export interface MaintenanceRequest {
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  affectedServices: string[];
  notifyUsers?: boolean;
}

/**
 * Change Request
 */
export interface ChangeRequestRequest {
  title: string;
  description: string;
  type: ChangeType;
  priority: PriorityLevel;
  scheduledDate?: string;
  rollbackPlan?: string;
  approvers?: string[];
}

/**
 * Integration Request
 */
export interface IntegrationRequest {
  name: string;
  type: IntegrationType;
  provider: string;
  configuration: any;
  enabled?: boolean;
}

/**
 * API Key Request
 */
export interface APIKeyRequest {
  name: string;
  permissions: string[];
  rateLimit?: number;
  expiresAt?: string;
  description?: string;
}

/**
 * Webhook Request
 */
export interface WebhookRequest {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  retryAttempts?: number;
  enabled?: boolean;
}

/**
 * Connector Request
 */
export interface ConnectorRequest {
  name: string;
  type: ConnectorType;
  source: string;
  destination: string;
  mapping: FieldMappingRequest[];
  schedule?: ConnectorScheduleRequest;
  enabled?: boolean;
}

/**
 * Field Mapping Request
 */
export interface FieldMappingRequest {
  sourceField: string;
  destinationField: string;
  transformation?: string;
  required?: boolean;
}

/**
 * Connector Schedule Request
 */
export interface ConnectorScheduleRequest {
  frequency: ScheduleFrequency;
  interval: number;
  time?: string;
  enabled?: boolean;
}