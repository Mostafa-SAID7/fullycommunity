/**
 * Advanced System Management
 * Comprehensive system management interface
 */

import {
  ConfigurationManagement,
  SecurityManagement,
  BackupManagement,
  MonitoringManagement,
  MaintenanceManagement,
  IntegrationManagement
} from './components/system-components.interface';

/**
 * Advanced System Management
 */
export interface AdvancedSystemManagement {
  configuration: ConfigurationManagement;
  security: SecurityManagement;
  backup: BackupManagement;
  monitoring: MonitoringManagement;
  maintenance: MaintenanceManagement;
  integrations: IntegrationManagement;
}