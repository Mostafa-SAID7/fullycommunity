import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SecurityAlert {
  id: string;
  type: 'login_attempt' | 'suspicious_activity' | 'data_breach' | 'malware' | 'ddos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  affectedUsers?: number;
}

interface SecurityMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

@Component({
  selector: 'app-security-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-center.component.html',
  styleUrl: './security-center.component.scss'
})
export class SecurityCenterComponent implements OnInit {
  loading = signal(false);
  scanInProgress = signal(false);
  securityAlerts = signal<SecurityAlert[]>([]);
  filteredAlerts = signal<SecurityAlert[]>([]);
  securityMetrics = signal<SecurityMetric[]>([]);
  overallSecurityStatus = signal<'secure' | 'warning' | 'critical'>('secure');
  
  alertFilter = '';
  
  securitySettings = {
    twoFactorRequired: true,
    ipWhitelistEnabled: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    threatDetectionEnabled: true,
    automatedResponseEnabled: false,
    emailAlertsEnabled: true,
    logRetentionDays: 90
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    
    // Mock data
    setTimeout(() => {
      const mockAlerts: SecurityAlert[] = [
        {
          id: '1',
          type: 'login_attempt',
          severity: 'medium',
          title: 'Multiple Failed Login Attempts',
          description: 'Detected 15 failed login attempts from IP 192.168.1.100 in the last hour',
          source: '192.168.1.100',
          timestamp: new Date(Date.now() - 3600000),
          status: 'active',
          affectedUsers: 1
        },
        {
          id: '2',
          type: 'suspicious_activity',
          severity: 'high',
          title: 'Unusual API Usage Pattern',
          description: 'API key showing abnormal usage pattern with 500% increase in requests',
          source: 'API Monitor',
          timestamp: new Date(Date.now() - 7200000),
          status: 'investigating'
        },
        {
          id: '3',
          type: 'ddos',
          severity: 'critical',
          title: 'Potential DDoS Attack',
          description: 'Massive spike in traffic from multiple IPs detected',
          source: 'Traffic Monitor',
          timestamp: new Date(Date.now() - 10800000),
          status: 'resolved',
          affectedUsers: 0
        }
      ];

      const mockMetrics: SecurityMetric[] = [
        {
          name: 'Threat Score',
          value: 15,
          unit: '/100',
          trend: 'down',
          status: 'good'
        },
        {
          name: 'Failed Logins',
          value: 23,
          unit: '',
          trend: 'up',
          status: 'warning'
        },
        {
          name: 'Blocked IPs',
          value: 156,
          unit: '',
          trend: 'stable',
          status: 'good'
        },
        {
          name: 'Vulnerabilities',
          value: 2,
          unit: '',
          trend: 'down',
          status: 'warning'
        }
      ];

      this.securityAlerts.set(mockAlerts);
      this.filteredAlerts.set(mockAlerts);
      this.securityMetrics.set(mockMetrics);
      this.updateOverallStatus();
      this.loading.set(false);
    }, 1000);
  }

  updateOverallStatus() {
    const alerts = this.securityAlerts();
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
    const highAlerts = alerts.filter(a => a.severity === 'high' && a.status === 'active').length;
    
    if (criticalAlerts > 0) {
      this.overallSecurityStatus.set('critical');
    } else if (highAlerts > 0) {
      this.overallSecurityStatus.set('warning');
    } else {
      this.overallSecurityStatus.set('secure');
    }
  }

  filterAlerts() {
    const alerts = this.securityAlerts();
    if (!this.alertFilter) {
      this.filteredAlerts.set(alerts);
    } else {
      this.filteredAlerts.set(alerts.filter(alert => alert.severity === this.alertFilter));
    }
  }

  refreshAlerts() {
    this.loadData();
  }

  runSecurityScan() {
    this.scanInProgress.set(true);
    setTimeout(() => {
      this.scanInProgress.set(false);
      console.log('Security scan completed');
    }, 5000);
  }

  investigateAlert(alert: SecurityAlert) {
    alert.status = 'investigating';
    console.log('Investigating alert:', alert);
  }

  resolveAlert(alert: SecurityAlert) {
    alert.status = 'resolved';
    this.updateOverallStatus();
    console.log('Resolved alert:', alert);
  }

  dismissAlert(alert: SecurityAlert) {
    alert.status = 'false_positive';
    this.updateOverallStatus();
    console.log('Dismissed alert:', alert);
  }

  updateSecuritySettings() {
    console.log('Updated security settings:', this.securitySettings);
  }

  getOverallSecurityStatusClass(): string {
    switch (this.overallSecurityStatus()) {
      case 'secure': return 'status-secure';
      case 'warning': return 'status-warning';
      case 'critical': return 'status-critical';
      default: return 'status-secure';
    }
  }

  getOverallSecurityTextClass(): string {
    switch (this.overallSecurityStatus()) {
      case 'secure': return 'text-secure';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-critical';
      default: return 'text-secure';
    }
  }

  getMetricIconClass(status: string): string {
    switch (status) {
      case 'good': return 'metric-good';
      case 'warning': return 'metric-warning';
      case 'critical': return 'metric-critical';
      default: return 'metric-good';
    }
  }

  getMetricIconColor(status: string): string {
    return ''; // Handled by CSS classes
  }

  getMetricValueColor(status: string): string {
    switch (status) {
      case 'good': return 'value-good';
      case 'warning': return 'value-warning';
      case 'critical': return 'value-critical';
      default: return 'value-good';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      case 'stable': return 'trend-stable';
      default: return 'trend-stable';
    }
  }

  getAlertBorderClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'alert-critical';
      case 'high': return 'alert-high';
      case 'medium': return 'alert-medium';
      case 'low': return 'alert-low';
      default: return '';
    }
  }

  getAlertIconClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'icon-critical';
      case 'high': return 'icon-high';
      case 'medium': return 'icon-medium';
      case 'low': return 'icon-low';
      default: return 'icon-low';
    }
  }

  getAlertIconColor(severity: string): string {
    return ''; // Handled by CSS classes
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-low';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'investigating': return 'status-investigating';
      case 'resolved': return 'status-resolved';
      case 'false_positive': return 'status-false-positive';
      default: return 'status-active';
    }
  }
}