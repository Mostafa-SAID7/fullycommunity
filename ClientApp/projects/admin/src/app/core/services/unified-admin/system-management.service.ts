/**
 * Unified System Management Service
 * Service for advanced system management operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseAdminService } from '../base/base-admin.service';

import {
  AdvancedSystemManagement,
  SystemHealthResponse,
  ConfigurationResponse,
  DeploymentResponse,
  SecurityDashboardResponse,
  BackupResponse,
  MonitoringResponse,
  IncidentResponse,
  MaintenanceResponse,
  IntegrationResponse,
  APIKeysResponse,
  WebhooksResponse,
  ConnectorsResponse,
  SystemLogsResponse,
  SystemActionResponse,
  SystemMetricsResponse,
  ConfigurationUpdateRequest,
  FeatureFlagRequest,
  DeploymentRequest,
  SecurityPolicyRequest,
  ThreatResponseRequest,
  BackupRequest,
  BackupScheduleRequest,
  MonitorRequest,
  IncidentRequest,
  IncidentUpdateRequest,
  MaintenanceRequest,
  ChangeRequestRequest,
  IntegrationRequest,
  APIKeyRequest,
  WebhookRequest,
  ConnectorRequest
} from '../../interfaces/unified-admin';

@Injectable({
  providedIn: 'root'
})
export class UnifiedSystemManagementService extends BaseAdminService {
  private readonly apiPath = '/unified/system';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get system management overview
   */
  getSystemManagement(): Observable<AdvancedSystemManagement> {
    return this.get<AdvancedSystemManagement>(`${this.apiPath}/management`);
  }

  /**
   * Get system health
   */
  getSystemHealth(): Observable<SystemHealthResponse> {
    return this.get<SystemHealthResponse>(`${this.apiPath}/health`);
  }

  // Configuration Management
  /**
   * Get configuration settings
   */
  getConfiguration(environment?: string): Observable<ConfigurationResponse> {
    const params = environment ? this.buildParams({ environment }) : undefined;
    return this.get<ConfigurationResponse>(`${this.apiPath}/configuration`, params);
  }

  /**
   * Update configuration setting
   */
  updateConfiguration(request: ConfigurationUpdateRequest): Observable<void> {
    return this.put<void>(`${this.apiPath}/configuration`, request);
  }

  /**
   * Create feature flag
   */
  createFeatureFlag(request: FeatureFlagRequest): Observable<any> {
    return this.post(`${this.apiPath}/feature-flags`, request);
  }

  /**
   * Update feature flag
   */
  updateFeatureFlag(flagId: string, request: FeatureFlagRequest): Observable<any> {
    return this.put(`${this.apiPath}/feature-flags/${flagId}`, request);
  }

  /**
   * Delete feature flag
   */
  deleteFeatureFlag(flagId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/feature-flags/${flagId}`);
  }

  // Deployment Management
  /**
   * Get deployments
   */
  getDeployments(): Observable<DeploymentResponse> {
    return this.get<DeploymentResponse>(`${this.apiPath}/deployments`);
  }

  /**
   * Create deployment
   */
  createDeployment(request: DeploymentRequest): Observable<any> {
    return this.post(`${this.apiPath}/deployments`, request);
  }

  /**
   * Rollback deployment
   */
  rollbackDeployment(deploymentId: string): Observable<SystemActionResponse> {
    return this.post<SystemActionResponse>(`${this.apiPath}/deployments/${deploymentId}/rollback`, {});
  }

  // Security Management
  /**
   * Get security dashboard
   */
  getSecurityDashboard(): Observable<SecurityDashboardResponse> {
    return this.get<SecurityDashboardResponse>(`${this.apiPath}/security/dashboard`);
  }

  /**
   * Create security policy
   */
  createSecurityPolicy(request: SecurityPolicyRequest): Observable<any> {
    return this.post(`${this.apiPath}/security/policies`, request);
  }

  /**
   * Update security policy
   */
  updateSecurityPolicy(policyId: string, request: SecurityPolicyRequest): Observable<any> {
    return this.put(`${this.apiPath}/security/policies/${policyId}`, request);
  }

  /**
   * Delete security policy
   */
  deleteSecurityPolicy(policyId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/security/policies/${policyId}`);
  }

  /**
   * Respond to security threat
   */
  respondToThreat(request: ThreatResponseRequest): Observable<SystemActionResponse> {
    return this.post<SystemActionResponse>(`${this.apiPath}/security/threats/respond`, request);
  }

  /**
   * Get access logs
   */
  getAccessLogs(page: number = 1, pageSize: number = 20, suspicious?: boolean): Observable<any> {
    const params = this.buildParams({ page, pageSize, suspicious });
    return this.get(`${this.apiPath}/security/access-logs`, params);
  }

  // Backup Management
  /**
   * Get backups
   */
  getBackups(): Observable<BackupResponse> {
    return this.get<BackupResponse>(`${this.apiPath}/backups`);
  }

  /**
   * Create backup
   */
  createBackup(request: BackupRequest): Observable<any> {
    return this.post(`${this.apiPath}/backups`, request);
  }

  /**
   * Restore backup
   */
  restoreBackup(backupId: string): Observable<SystemActionResponse> {
    return this.post<SystemActionResponse>(`${this.apiPath}/backups/${backupId}/restore`, {});
  }

  /**
   * Delete backup
   */
  deleteBackup(backupId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/backups/${backupId}`);
  }

  /**
   * Update backup schedule
   */
  updateBackupSchedule(request: BackupScheduleRequest): Observable<void> {
    return this.put<void>(`${this.apiPath}/backups/schedule`, request);
  }

  // Monitoring Management
  /**
   * Get monitors
   */
  getMonitors(): Observable<MonitoringResponse> {
    return this.get<MonitoringResponse>(`${this.apiPath}/monitoring/monitors`);
  }

  /**
   * Create monitor
   */
  createMonitor(request: MonitorRequest): Observable<any> {
    return this.post(`${this.apiPath}/monitoring/monitors`, request);
  }

  /**
   * Update monitor
   */
  updateMonitor(monitorId: string, request: MonitorRequest): Observable<any> {
    return this.put(`${this.apiPath}/monitoring/monitors/${monitorId}`, request);
  }

  /**
   * Delete monitor
   */
  deleteMonitor(monitorId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/monitoring/monitors/${monitorId}`);
  }

  /**
   * Test monitor
   */
  testMonitor(monitorId: string): Observable<any> {
    return this.post(`${this.apiPath}/monitoring/monitors/${monitorId}/test`, {});
  }

  // Incident Management
  /**
   * Get incidents
   */
  getIncidents(): Observable<IncidentResponse> {
    return this.get<IncidentResponse>(`${this.apiPath}/incidents`);
  }

  /**
   * Create incident
   */
  createIncident(request: IncidentRequest): Observable<any> {
    return this.post(`${this.apiPath}/incidents`, request);
  }

  /**
   * Update incident
   */
  updateIncident(incidentId: string, request: IncidentUpdateRequest): Observable<any> {
    return this.put(`${this.apiPath}/incidents/${incidentId}`, request);
  }

  /**
   * Resolve incident
   */
  resolveIncident(incidentId: string, resolution: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/incidents/${incidentId}/resolve`, { resolution });
  }

  // Maintenance Management
  /**
   * Get maintenance windows
   */
  getMaintenanceWindows(): Observable<MaintenanceResponse> {
    return this.get<MaintenanceResponse>(`${this.apiPath}/maintenance`);
  }

  /**
   * Schedule maintenance
   */
  scheduleMaintenance(request: MaintenanceRequest): Observable<any> {
    return this.post(`${this.apiPath}/maintenance`, request);
  }

  /**
   * Cancel maintenance
   */
  cancelMaintenance(maintenanceId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/maintenance/${maintenanceId}`);
  }

  /**
   * Create change request
   */
  createChangeRequest(request: ChangeRequestRequest): Observable<any> {
    return this.post(`${this.apiPath}/change-requests`, request);
  }

  /**
   * Approve change request
   */
  approveChangeRequest(requestId: string, notes?: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/change-requests/${requestId}/approve`, { notes });
  }

  /**
   * Reject change request
   */
  rejectChangeRequest(requestId: string, reason: string): Observable<void> {
    return this.post<void>(`${this.apiPath}/change-requests/${requestId}/reject`, { reason });
  }

  // Integration Management
  /**
   * Get integrations
   */
  getIntegrations(): Observable<IntegrationResponse> {
    return this.get<IntegrationResponse>(`${this.apiPath}/integrations`);
  }

  /**
   * Create integration
   */
  createIntegration(request: IntegrationRequest): Observable<any> {
    return this.post(`${this.apiPath}/integrations`, request);
  }

  /**
   * Update integration
   */
  updateIntegration(integrationId: string, request: IntegrationRequest): Observable<any> {
    return this.put(`${this.apiPath}/integrations/${integrationId}`, request);
  }

  /**
   * Delete integration
   */
  deleteIntegration(integrationId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/integrations/${integrationId}`);
  }

  /**
   * Test integration
   */
  testIntegration(integrationId: string): Observable<any> {
    return this.post(`${this.apiPath}/integrations/${integrationId}/test`, {});
  }

  /**
   * Sync integration
   */
  syncIntegration(integrationId: string): Observable<SystemActionResponse> {
    return this.post<SystemActionResponse>(`${this.apiPath}/integrations/${integrationId}/sync`, {});
  }

  // API Keys Management
  /**
   * Get API keys
   */
  getAPIKeys(): Observable<APIKeysResponse> {
    return this.get<APIKeysResponse>(`${this.apiPath}/api-keys`);
  }

  /**
   * Create API key
   */
  createAPIKey(request: APIKeyRequest): Observable<any> {
    return this.post(`${this.apiPath}/api-keys`, request);
  }

  /**
   * Update API key
   */
  updateAPIKey(keyId: string, request: APIKeyRequest): Observable<any> {
    return this.put(`${this.apiPath}/api-keys/${keyId}`, request);
  }

  /**
   * Revoke API key
   */
  revokeAPIKey(keyId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/api-keys/${keyId}`);
  }

  /**
   * Regenerate API key
   */
  regenerateAPIKey(keyId: string): Observable<any> {
    return this.post(`${this.apiPath}/api-keys/${keyId}/regenerate`, {});
  }

  // Webhooks Management
  /**
   * Get webhooks
   */
  getWebhooks(): Observable<WebhooksResponse> {
    return this.get<WebhooksResponse>(`${this.apiPath}/webhooks`);
  }

  /**
   * Create webhook
   */
  createWebhook(request: WebhookRequest): Observable<any> {
    return this.post(`${this.apiPath}/webhooks`, request);
  }

  /**
   * Update webhook
   */
  updateWebhook(webhookId: string, request: WebhookRequest): Observable<any> {
    return this.put(`${this.apiPath}/webhooks/${webhookId}`, request);
  }

  /**
   * Delete webhook
   */
  deleteWebhook(webhookId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/webhooks/${webhookId}`);
  }

  /**
   * Test webhook
   */
  testWebhook(webhookId: string): Observable<any> {
    return this.post(`${this.apiPath}/webhooks/${webhookId}/test`, {});
  }

  // Connectors Management
  /**
   * Get connectors
   */
  getConnectors(): Observable<ConnectorsResponse> {
    return this.get<ConnectorsResponse>(`${this.apiPath}/connectors`);
  }

  /**
   * Create connector
   */
  createConnector(request: ConnectorRequest): Observable<any> {
    return this.post(`${this.apiPath}/connectors`, request);
  }

  /**
   * Update connector
   */
  updateConnector(connectorId: string, request: ConnectorRequest): Observable<any> {
    return this.put(`${this.apiPath}/connectors/${connectorId}`, request);
  }

  /**
   * Delete connector
   */
  deleteConnector(connectorId: string): Observable<void> {
    return this.delete<void>(`${this.apiPath}/connectors/${connectorId}`);
  }

  /**
   * Run connector
   */
  runConnector(connectorId: string): Observable<SystemActionResponse> {
    return this.post<SystemActionResponse>(`${this.apiPath}/connectors/${connectorId}/run`, {});
  }

  // System Logs
  /**
   * Get system logs
   */
  getSystemLogs(page: number = 1, pageSize: number = 20, level?: string, service?: string): Observable<SystemLogsResponse> {
    const params = this.buildParams({ page, pageSize, level, service });
    return this.get<SystemLogsResponse>(`${this.apiPath}/logs`, params);
  }

  /**
   * Get system metrics
   */
  getSystemMetrics(timeRange?: string): Observable<SystemMetricsResponse> {
    return this.getStatistics<SystemMetricsResponse>(`${this.apiPath}/metrics`, timeRange);
  }

  /**
   * Restart system service
   */
  restartService(serviceName: string): Observable<SystemActionResponse> {
    return this.post<SystemActionResponse>(`${this.apiPath}/services/${serviceName}/restart`, {});
  }

  /**
   * Clear system cache
   */
  clearCache(cacheType?: string): Observable<SystemActionResponse> {
    const params = cacheType ? this.buildParams({ type: cacheType }) : undefined;
    return this.post<SystemActionResponse>(`${this.apiPath}/cache/clear`, {}, params);
  }

  /**
   * Run system maintenance
   */
  runSystemMaintenance(): Observable<SystemActionResponse> {
    return this.post<SystemActionResponse>(`${this.apiPath}/maintenance/run`, {});
  }
}