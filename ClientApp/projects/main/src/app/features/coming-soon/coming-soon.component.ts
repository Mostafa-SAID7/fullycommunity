/**
 * Coming Soon Page Component
 * Displays coming soon page for features under development
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MaintenanceService } from '../../core/services/system/maintenance.service';
import { ComingSoonStatus } from '../../core/interfaces/system/maintenance.interface';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  comingSoonStatus: ComingSoonStatus | null = null;
  emailSubscription = '';
  isSubscribing = false;
  subscriptionSuccess = false;
  subscriptionError = '';
  currentTime = new Date();
  
  private destroy$ = new Subject<void>();

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.loadComingSoonStatus();
    this.startTimeUpdater();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load coming soon status
   */
  private loadComingSoonStatus(): void {
    this.maintenanceService.comingSoonStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.comingSoonStatus = status;
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
   * Get launch date
   */
  getLaunchDate(): Date | null {
    if (!this.comingSoonStatus?.comingSoon?.launchDate) {
      return null;
    }
    return new Date(this.comingSoonStatus.comingSoon.launchDate);
  }

  /**
   * Get countdown to launch
   */
  getCountdown(): { days: number; hours: number; minutes: number; seconds: number } | null {
    const launchDate = this.getLaunchDate();
    if (!launchDate) {
      return null;
    }

    const diff = launchDate.getTime() - this.currentTime.getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  /**
   * Subscribe to email notifications
   */
  subscribeToNotifications(): void {
    if (!this.emailSubscription || this.isSubscribing) {
      return;
    }

    this.isSubscribing = true;
    this.subscriptionError = '';
    this.subscriptionSuccess = false;

    this.maintenanceService.subscribeToNotifications(this.emailSubscription)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.subscriptionSuccess = true;
          this.emailSubscription = '';
          this.isSubscribing = false;
        },
        error: (error) => {
          this.subscriptionError = 'Failed to subscribe. Please try again.';
          this.isSubscribing = false;
        }
      });
  }

  /**
   * Get coming soon title
   */
  getComingSoonTitle(): string {
    return this.comingSoonStatus?.comingSoon?.title || 'Coming Soon';
  }

  /**
   * Get coming soon description
   */
  getComingSoonDescription(): string {
    return this.comingSoonStatus?.comingSoon?.description || 
           'We are working hard to bring you something amazing. Stay tuned!';
  }

  /**
   * Get features list
   */
  getFeatures(): string[] {
    return this.comingSoonStatus?.comingSoon?.features || [];
  }

  /**
   * Get social links
   */
  getSocialLinks(): any[] {
    return this.comingSoonStatus?.comingSoon?.socialLinks || [];
  }

  /**
   * Check if email notifications are enabled
   */
  isEmailNotificationEnabled(): boolean {
    return this.comingSoonStatus?.comingSoon?.notifyEmail || false;
  }

  /**
   * Validate email
   */
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.emailSubscription);
  }
}