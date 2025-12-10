/**
 * Maintenance Service
 * Service for checking maintenance and coming soon status
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import {
  MaintenanceStatus,
  ComingSoonStatus,
  SystemStatus
} from '../../interfaces/system/maintenance.interface';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private readonly apiUrl = `${environment.apiUrl}/system`;
  
  private maintenanceStatusSubject = new BehaviorSubject<MaintenanceStatus | null>(null);
  private comingSoonStatusSubject = new BehaviorSubject<ComingSoonStatus | null>(null);
  
  public maintenanceStatus$ = this.maintenanceStatusSubject.asObservable();
  public comingSoonStatus$ = this.comingSoonStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startStatusPolling();
  }

  /**
   * Get current system status
   */
  getSystemStatus(): Observable<SystemStatus> {
    return this.http.get<SystemStatus>(`${this.apiUrl}/status`).pipe(
      map(status => {
        this.maintenanceStatusSubject.next(status.maintenance);
        this.comingSoonStatusSubject.next(status.comingSoon);
        return status;
      }),
      catchError(error => {
        console.error('Failed to get system status:', error);
        // Return default status if API fails
        const defaultStatus: SystemStatus = {
          maintenance: {
            isMaintenanceMode: false,
            maintenance: null,
            userCanAccess: true,
            redirectUrl: null
          },
          comingSoon: {
            isComingSoonMode: false,
            comingSoon: null,
            userCanAccess: true
          },
          timestamp: new Date().toISOString()
        };
        return [defaultStatus];
      })
    );
  }

  /**
   * Check if maintenance mode is active
   */
  isMaintenanceMode(): Observable<boolean> {
    return this.maintenanceStatus$.pipe(
      map(status => status?.isMaintenanceMode || false)
    );
  }

  /**
   * Check if coming soon mode is active
   */
  isComingSoonMode(): Observable<boolean> {
    return this.comingSoonStatus$.pipe(
      map(status => status?.isComingSoonMode || false)
    );
  }

  /**
   * Check if user can access the system
   */
  canUserAccess(): Observable<boolean> {
    return this.maintenanceStatus$.pipe(
      map(status => status?.userCanAccess !== false)
    );
  }

  /**
   * Get current maintenance status
   */
  getCurrentMaintenanceStatus(): MaintenanceStatus | null {
    return this.maintenanceStatusSubject.value;
  }

  /**
   * Get current coming soon status
   */
  getCurrentComingSoonStatus(): ComingSoonStatus | null {
    return this.comingSoonStatusSubject.value;
  }

  /**
   * Subscribe to email notifications for coming soon
   */
  subscribeToNotifications(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/coming-soon/subscribe`, { email });
  }

  /**
   * Start polling for status updates every 30 seconds
   */
  private startStatusPolling(): void {
    // Initial check
    this.getSystemStatus().subscribe();
    
    // Poll every 30 seconds
    interval(30000).subscribe(() => {
      this.getSystemStatus().subscribe();
    });
  }

  /**
   * Force refresh system status
   */
  refreshStatus(): Observable<SystemStatus> {
    return this.getSystemStatus();
  }
}