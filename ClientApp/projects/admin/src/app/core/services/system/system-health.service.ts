import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface SystemHealthData {
  cpu: number;
  memory: number;
  disk: number;
  activeUsers: number;
  services: ServiceHealth[];
  alerts: SystemAlert[];
}

export interface ServiceHealth {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  uptime: number;
}

export interface SystemAlert {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SystemHealthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/admin/system`;

  getSystemHealth(): Observable<SystemHealthData> {
    return this.http.get<SystemHealthData>(`${this.apiUrl}/health`);
  }

  getSystemMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/metrics`);
  }

  getServiceStatus(): Observable<ServiceHealth[]> {
    return this.http.get<ServiceHealth[]>(`${this.apiUrl}/services`);
  }

  getSystemAlerts(): Observable<SystemAlert[]> {
    return this.http.get<SystemAlert[]>(`${this.apiUrl}/alerts`);
  }

  resolveAlert(alertId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/alerts/${alertId}/resolve`, {});
  }

  // Mock data for development
  getMockSystemHealth(): Observable<SystemHealthData> {
    const mockData: SystemHealthData = {
      cpu: 45 + Math.random() * 20,
      memory: 60 + Math.random() * 15,
      disk: 75 + Math.random() * 10,
      activeUsers: 1200 + Math.floor(Math.random() * 300),
      services: [
        {
          name: 'API Gateway',
          status: 'online',
          responseTime: 40 + Math.random() * 20,
          uptime: 99.9
        },
        {
          name: 'Database',
          status: 'online',
          responseTime: 10 + Math.random() * 10,
          uptime: 99.8
        },
        {
          name: 'Redis Cache',
          status: 'online',
          responseTime: 2 + Math.random() * 5,
          uptime: 99.9
        },
        {
          name: 'File Storage',
          status: Math.random() > 0.7 ? 'degraded' : 'online',
          responseTime: 100 + Math.random() * 100,
          uptime: 98.5
        }
      ],
      alerts: [
        {
          id: '1',
          message: 'High memory usage detected on server-02',
          severity: 'warning',
          timestamp: new Date(Date.now() - 300000),
          resolved: false
        },
        {
          id: '2',
          message: 'Database connection pool near capacity',
          severity: 'warning',
          timestamp: new Date(Date.now() - 600000),
          resolved: false
        }
      ]
    };

    return of(mockData);
  }
}