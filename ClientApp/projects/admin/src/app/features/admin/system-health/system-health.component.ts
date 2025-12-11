import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SystemHealthService } from '../../../core/services/system/system-health.service';
import { RefreshButtonComponent } from '../../../shared/components/refresh-button/refresh-button.component';
import { StatCardComponent, StatCardConfig } from '../../../shared/components/charts/stat-card.component';

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
  imports: [CommonModule, RefreshButtonComponent, StatCardComponent],
  templateUrl: './system-health.component.html',
  styleUrl: './system-health.component.scss'


})
export class SystemHealthComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private systemHealthService = inject(SystemHealthService);
  private timeouts: number[] = []; // Track timeouts for cleanup

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
    // Clear all pending timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSystemHealth() {
    this.loading = true;
    // Simulate API call
    const timeout1 = window.setTimeout(() => {
      this.updateMetrics();
      this.loading = false;
    }, 1000);
    this.timeouts.push(timeout1);
  }

  refreshData() {
    this.refreshStatus = null;
    this.loadSystemHealth();
    
    // Simulate success after loading
    const timeout2 = window.setTimeout(() => {
      if (!this.loading) {
        this.refreshStatus = 'success';
        this.lastRefreshTime = new Date();
        
        // Clear success status after 3 seconds
        const timeout3 = window.setTimeout(() => {
          this.refreshStatus = null;
        }, 3000);
        this.timeouts.push(timeout3);
      }
    }, 1100);
    this.timeouts.push(timeout2);
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

  getMetricCards(): StatCardConfig[] {
    return this.systemMetrics.map(metric => ({
      title: metric.name,
      value: `${metric.value}${metric.unit}`,
      icon: this.getMetricIcon(metric.name),
      color: this.getStatCardColor(metric.status),
      subtitle: `Threshold: ${metric.threshold}${metric.unit}`,
      progress: metric.threshold > 0 ? (metric.value / metric.threshold) * 100 : undefined
    }));
  }

  private getMetricIcon(name: string): string {
    switch (name) {
      case 'CPU Usage': return '🖥️';
      case 'Memory Usage': return '💾';
      case 'Disk Usage': return '💿';
      case 'Active Users': return '👥';
      default: return '📊';
    }
  }

  private getStatCardColor(status: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'danger';
      default: return 'info';
    }
  }
}