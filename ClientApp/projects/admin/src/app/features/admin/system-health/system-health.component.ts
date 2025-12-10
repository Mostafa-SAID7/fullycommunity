import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SystemHealthService } from '../../../core/services/system/system-health.service';
import { RefreshButtonComponent } from '../../../shared/components/refresh-button/refresh-button.component';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: number;
  icon: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  uptime: number;
}

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule, RefreshButtonComponent],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">System Health Monitor</h1>
          <p class="text-gray-600 mt-1">Real-time system performance and service status</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" [class]="overallStatus === 'healthy' ? 'bg-green-500' : overallStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'"></div>
            <span class="text-sm font-medium" [class]="overallStatus === 'healthy' ? 'text-green-700' : overallStatus === 'warning' ? 'text-yellow-700' : 'text-red-700'">
              {{ overallStatus | titlecase }}
            </span>
          </div>
          <app-refresh-button
            (refresh)="refreshData()"
            [loading]="loading"
            [variant]="'primary'"
            [size]="'md'"
            [showText]="false"
            [title]="'Refresh system health data'"
            [showStatusIndicator]="true"
            [status]="refreshStatus"
            [lastRefresh]="lastRefreshTime">
          </app-refresh-button>
        </div>
      </div>

      <!-- System Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let metric of systemMetrics" 
             class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg" [class]="getMetricBgClass(metric.status)">
                <svg class="w-5 h-5" [class]="getMetricTextClass(metric.status)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="metric.icon"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">{{ metric.name }}</h3>
            </div>
            <div class="w-3 h-3 rounded-full" [class]="getStatusDotClass(metric.status)"></div>
          </div>
          <div class="space-y-2">
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-gray-900">{{ metric.value }}</span>
              <span class="text-sm text-gray-500">{{ metric.unit }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-300" 
                   [class]="getProgressBarClass(metric.status)"
                   [style.width.%]="(metric.value / metric.threshold) * 100"></div>
            </div>
            <p class="text-xs text-gray-500">Threshold: {{ metric.threshold }}{{ metric.unit }}</p>
          </div>
        </div>
      </div>

      <!-- Services Status -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Service Status</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div *ngFor="let service of services" 
                 class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full" [class]="getServiceStatusClass(service.status)"></div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ service.name }}</h4>
                  <p class="text-sm text-gray-500">Response: {{ service.responseTime }}ms</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium" [class]="getServiceTextClass(service.status)">
                  {{ service.status | titlecase }}
                </div>
                <div class="text-xs text-gray-500">
                  Uptime: {{ service.uptime }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Alerts -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Alerts</h2>
        </div>
        <div class="p-6">
          <div *ngIf="alerts.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>No recent alerts. System is running smoothly.</p>
          </div>
          <div *ngIf="alerts.length > 0" class="space-y-3">
            <div *ngFor="let alert of alerts" 
                 class="flex items-start gap-3 p-3 rounded-lg" 
                 [class]="alert.severity === 'critical' ? 'bg-red-50 border border-red-200' : alert.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'">
              <div class="flex-shrink-0 mt-0.5">
                <div class="w-2 h-2 rounded-full" [class]="alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'"></div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ alert.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ alert.timestamp | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SystemHealthComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private systemHealthService = inject(SystemHealthService);

  loading = false;
  overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  // Refresh button state
  refreshStatus: 'success' | 'error' | 'warning' | null = null;
  lastRefreshTime: Date | null = null;

  systemMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      threshold: 80,
      icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
    },
    {
      name: 'Memory Usage',
      value: 62,
      unit: '%',
      status: 'warning',
      threshold: 85,
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
    },
    {
      name: 'Disk Usage',
      value: 78,
      unit: '%',
      status: 'warning',
      threshold: 90,
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      name: 'Active Users',
      value: 1247,
      unit: '',
      status: 'healthy',
      threshold: 2000,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    }
  ];

  services: ServiceStatus[] = [
    {
      name: 'API Gateway',
      status: 'online',
      responseTime: 45,
      lastCheck: new Date(),
      uptime: 99.9
    },
    {
      name: 'Database',
      status: 'online',
      responseTime: 12,
      lastCheck: new Date(),
      uptime: 99.8
    },
    {
      name: 'Redis Cache',
      status: 'online',
      responseTime: 3,
      lastCheck: new Date(),
      uptime: 99.9
    },
    {
      name: 'File Storage',
      status: 'degraded',
      responseTime: 156,
      lastCheck: new Date(),
      uptime: 98.5
    }
  ];

  alerts: any[] = [
    {
      message: 'High memory usage detected on server-02',
      severity: 'warning',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      message: 'File storage service experiencing slow response times',
      severity: 'warning',
      timestamp: new Date(Date.now() - 600000)
    }
  ];

  ngOnInit() {
    this.loadSystemHealth();
    this.startAutoRefresh();
    this.updateOverallStatus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSystemHealth() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.updateMetrics();
      this.loading = false;
    }, 1000);
  }

  refreshData() {
    this.refreshStatus = null;
    this.loadSystemHealth();
    
    // Simulate success after loading
    setTimeout(() => {
      if (!this.loading) {
        this.refreshStatus = 'success';
        this.lastRefreshTime = new Date();
        
        // Clear success status after 3 seconds
        setTimeout(() => {
          this.refreshStatus = null;
        }, 3000);
      }
    }, 1100);
  }

  private startAutoRefresh() {
    interval(30000) // Refresh every 30 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateMetrics();
      });
  }

  private updateMetrics() {
    // Simulate real-time data updates
    this.systemMetrics.forEach(metric => {
      const variation = (Math.random() - 0.5) * 10;
      metric.value = Math.max(0, Math.min(100, metric.value + variation));
      metric.status = this.getMetricStatus(metric.value, metric.threshold);
    });

    this.services.forEach(service => {
      service.responseTime += (Math.random() - 0.5) * 20;
      service.responseTime = Math.max(1, service.responseTime);
      service.lastCheck = new Date();
    });

    this.updateOverallStatus();
  }

  private getMetricStatus(value: number, threshold: number): 'healthy' | 'warning' | 'critical' {
    const percentage = (value / threshold) * 100;
    if (percentage >= 90) return 'critical';
    if (percentage >= 70) return 'warning';
    return 'healthy';
  }

  private updateOverallStatus() {
    const criticalCount = this.systemMetrics.filter(m => m.status === 'critical').length;
    const warningCount = this.systemMetrics.filter(m => m.status === 'warning').length;

    if (criticalCount > 0) {
      this.overallStatus = 'critical';
    } else if (warningCount > 0) {
      this.overallStatus = 'warning';
    } else {
      this.overallStatus = 'healthy';
    }
  }

  getMetricBgClass(status: string): string {
    switch (status) {
      case 'healthy': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'critical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }

  getMetricTextClass(status: string): string {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getProgressBarClass(status: string): string {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getServiceStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getServiceTextClass(status: string): string {
    switch (status) {
      case 'online': return 'text-green-700';
      case 'degraded': return 'text-yellow-700';
      case 'offline': return 'text-red-700';
      default: return 'text-gray-700';
    }
  }
}