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
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Security Center</h1>
          <p class="text-gray-600 mt-1">Monitor security threats, access controls, and system vulnerabilities</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" [class]="getOverallSecurityStatusClass()"></div>
            <span class="text-sm font-medium" [class]="getOverallSecurityTextClass()">
              {{ overallSecurityStatus() | titlecase }}
            </span>
          </div>
          <button (click)="runSecurityScan()" 
                  [disabled]="scanInProgress()"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
            <svg class="w-4 h-4 inline mr-2" [class.animate-spin]="scanInProgress()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            {{ scanInProgress() ? 'Scanning...' : 'Security Scan' }}
          </button>
        </div>
      </div>

      <!-- Security Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let metric of securityMetrics()" 
             class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg" [class]="getMetricIconClass(metric.status)">
                <svg class="w-5 h-5" [class]="getMetricIconColor(metric.status)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">{{ metric.name }}</p>
                <p class="text-2xl font-bold" [class]="getMetricValueColor(metric.status)">
                  {{ metric.value }}{{ metric.unit }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" [class]="getTrendColor(metric.trend)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="metric.trend === 'up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                <path *ngIf="metric.trend === 'down'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                <path *ngIf="metric.trend === 'stable'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Alerts -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Security Alerts</h2>
            <div class="flex items-center gap-3">
              <select [(ngModel)]="alertFilter" (change)="filterAlerts()"
                      class="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">All Alerts</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button (click)="refreshAlerts()" 
                      class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div *ngIf="filteredAlerts().length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <p>No security alerts found</p>
            <p class="text-sm mt-1">Your system appears to be secure</p>
          </div>

          <div *ngIf="filteredAlerts().length > 0" class="space-y-4">
            <div *ngFor="let alert of filteredAlerts()" 
                 class="border rounded-lg p-4" 
                 [class]="getAlertBorderClass(alert.severity)">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="p-1 rounded" [class]="getAlertIconClass(alert.severity)">
                      <svg class="w-4 h-4" [class]="getAlertIconColor(alert.severity)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">{{ alert.title }}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getSeverityClass(alert.severity)">
                      {{ alert.severity | titlecase }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getStatusClass(alert.status)">
                      {{ alert.status | titlecase }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-gray-600 mb-3">{{ alert.description }}</p>
                  
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Type:</span>
                      <span class="ml-1">{{ alert.type | titlecase }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Source:</span>
                      <span class="ml-1">{{ alert.source }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Time:</span>
                      <span class="ml-1">{{ alert.timestamp | date:'short' }}</span>
                    </div>
                    <div *ngIf="alert.affectedUsers">
                      <span class="font-medium">Affected Users:</span>
                      <span class="ml-1">{{ alert.affectedUsers | number }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <button (click)="investigateAlert(alert)" 
                          class="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </button>
                  <button (click)="resolveAlert(alert)" 
                          class="p-2 text-green-400 hover:text-green-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                  <button (click)="dismissAlert(alert)" 
                          class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Access Control -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Access Control</h2>
          <div class="space-y-4">
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Two-Factor Authentication Required</span>
              <input type="checkbox" 
                     [(ngModel)]="securitySettings.twoFactorRequired"
                     (change)="updateSecuritySettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
            </label>
            
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">IP Whitelist Enabled</span>
              <input type="checkbox" 
                     [(ngModel)]="securitySettings.ipWhitelistEnabled"
                     (change)="updateSecuritySettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
            </label>
            
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Session Timeout (minutes)</span>
              <input type="number" 
                     [(ngModel)]="securitySettings.sessionTimeout"
                     (change)="updateSecuritySettings()"
                     min="5" max="480"
                     class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent">
            </label>
            
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Max Login Attempts</span>
              <input type="number" 
                     [(ngModel)]="securitySettings.maxLoginAttempts"
                     (change)="updateSecuritySettings()"
                     min="3" max="10"
                     class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent">
            </label>
          </div>
        </div>

        <!-- Monitoring Settings -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Monitoring Settings</h2>
          <div class="space-y-4">
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Real-time Threat Detection</span>
              <input type="checkbox" 
                     [(ngModel)]="securitySettings.threatDetectionEnabled"
                     (change)="updateSecuritySettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
            </label>
            
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Automated Response</span>
              <input type="checkbox" 
                     [(ngModel)]="securitySettings.automatedResponseEnabled"
                     (change)="updateSecuritySettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
            </label>
            
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Email Alerts</span>
              <input type="checkbox" 
                     [(ngModel)]="securitySettings.emailAlertsEnabled"
                     (change)="updateSecuritySettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
            </label>
            
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Log Retention (days)</span>
              <input type="number" 
                     [(ngModel)]="securitySettings.logRetentionDays"
                     (change)="updateSecuritySettings()"
                     min="30" max="365"
                     class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent">
            </label>
          </div>
        </div>
      </div>
    </div>
  `
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
      case 'secure': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getOverallSecurityTextClass(): string {
    switch (this.overallSecurityStatus()) {
      case 'secure': return 'text-green-700';
      case 'warning': return 'text-yellow-700';
      case 'critical': return 'text-red-700';
      default: return 'text-gray-700';
    }
  }

  getMetricIconClass(status: string): string {
    switch (status) {
      case 'good': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'critical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }

  getMetricIconColor(status: string): string {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getMetricValueColor(status: string): string {
    switch (status) {
      case 'good': return 'text-green-900';
      case 'warning': return 'text-yellow-900';
      case 'critical': return 'text-red-900';
      default: return 'text-gray-900';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      case 'stable': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  }

  getAlertBorderClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200';
    }
  }

  getAlertIconClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-red-100';
      case 'high': return 'bg-orange-100';
      case 'medium': return 'bg-yellow-100';
      case 'low': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  }

  getAlertIconColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}