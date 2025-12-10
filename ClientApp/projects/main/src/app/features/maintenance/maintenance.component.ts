/**
 * Maintenance Page Component
 * Displays maintenance mode page when system is under maintenance
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MaintenanceService } from '../../core/services/system/maintenance.service';
import { MaintenanceStatus } from '../../core/interfaces/system/maintenance.interface';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  maintenanceStatus: MaintenanceStatus | null = null;
  currentTime = new Date();
  private destroy$ = new Subject<void>();

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.loadMaintenanceStatus();
    this.startTimeUpdater();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load maintenance status
   */
  private loadMaintenanceStatus(): void {
    this.maintenanceService.maintenanceStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.maintenanceStatus = status;
      });

    // Force refresh
    this.maintenanceService.refreshStatus().subscribe();
  }

  /**
   * Start time updater
   */
  private startTimeUpdater(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  /**
   * Get estimated completion time
   */
  getEstimatedCompletion(): Date | null {
    if (!this.maintenanceStatus?.maintenance?.endTime) {
      return null;
    }
    return new Date(this.maintenanceStatus.maintenance.endTime);
  }

  /**
   * Get time remaining
   */
  getTimeRemaining(): string {
    const completion = this.getEstimatedCompletion();
    if (!completion) {
      return 'Unknown';
    }

    const diff = completion.getTime() - this.currentTime.getTime();
    if (diff <= 0) {
      return 'Completing soon...';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Refresh status
   */
  refreshStatus(): void {
    this.maintenanceService.refreshStatus().subscribe();
  }

  /**
   * Get maintenance title
   */
  getMaintenanceTitle(): string {
    return this.maintenanceStatus?.maintenance?.title || 'System Maintenance';
  }

  /**
   * Get maintenance message
   */
  getMaintenanceMessage(): string {
    return this.maintenanceStatus?.maintenance?.message || 
           'We are currently performing scheduled maintenance to improve your experience. Please check back soon.';
  }
}