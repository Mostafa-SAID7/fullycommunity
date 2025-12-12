import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminSettingsService } from '../../../core/services/admin/settings.service';
import {
  SiteSettings,
  EmailSettings,
  SecuritySettings
} from '../../../core/interfaces/admin/settings.interface';
import { TabNavigationComponent, Tab } from '../../../shared/ui/navigation/tab-navigation/tab-navigation.component';
import { RefreshButtonComponent } from '../../../shared/ui/buttons/refresh-button/refresh-button.component';

@Component({
  selector: 'admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabNavigationComponent,
    RefreshButtonComponent
  ],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  private settingsService = inject(AdminSettingsService);
  private destroy$ = new Subject<void>();
  private timeouts: number[] = []; // Track timeouts for cleanup
  
  siteSettings = signal<SiteSettings | null>(null);
  emailSettings = signal<EmailSettings | null>(null);
  securitySettings = signal<SecuritySettings | null>(null);
  systemInfo = signal<{ version: string; environment: string; uptime: string } | null>(null);
  loading = signal(false);

  activeTab: 'general' | 'email' | 'security' | 'system' = 'general';
  successMessage = '';
  errorMessage = '';

  tabs: Tab[] = [
    { id: 'general', label: 'General' },
    { id: 'email', label: 'Email' },
    { id: 'security', label: 'Security' },
    { id: 'system', label: 'System' }
  ];

  setTab(tabId: string) {
    this.activeTab = tabId as 'general' | 'email' | 'security' | 'system';
  }

  ngOnInit() {
    this.loadSettings();
  }

  ngOnDestroy() {
    // Clear all pending timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSettings() {
    this.loading.set(true);

    this.settingsService.getSiteSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.siteSettings.set(data),
        error: (err) => console.error('Error loading site settings:', err)
      });

    this.settingsService.getEmailSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.emailSettings.set(data),
        error: (err) => console.error('Error loading email settings:', err)
      });

    this.settingsService.getSecuritySettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.securitySettings.set(data),
        error: (err) => console.error('Error loading security settings:', err)
      });

    this.settingsService.getSystemInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.systemInfo.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading system info:', err);
          this.loading.set(false);
        }
      });
  }

  saveSiteSettings() {
    const settings = this.siteSettings();
    if (!settings) return;

    this.settingsService.updateSiteSettings(settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.showSuccess('Site settings saved successfully'),
        error: (err) => this.showError('Failed to save site settings')
      });
  }

  saveEmailSettings() {
    const settings = this.emailSettings();
    if (!settings) return;

    this.settingsService.updateEmailSettings(settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.showSuccess('Email settings saved successfully'),
        error: (err) => this.showError('Failed to save email settings')
      });
  }

  saveSecuritySettings() {
    const settings = this.securitySettings();
    if (!settings) return;

    this.settingsService.updateSecuritySettings(settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.showSuccess('Security settings saved successfully'),
        error: (err) => this.showError('Failed to save security settings')
      });
  }

  testEmailConnection() {
    this.settingsService.testEmailConnection()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.showSuccess('Email connection test successful');
          } else {
            this.showError(result.message);
          }
        },
        error: (err) => this.showError('Email connection test failed')
      });
  }

  clearCache() {
    if (confirm('Are you sure you want to clear all cached data?')) {
      this.settingsService.clearCache()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.showSuccess('Cache cleared successfully'),
          error: (err) => this.showError('Failed to clear cache')
        });
    }
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    // Clear existing timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
    
    const timeout = window.setTimeout(() => {
      this.successMessage = '';
    }, 3000);
    this.timeouts.push(timeout);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
    // Clear existing timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
    
    const timeout = window.setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
    this.timeouts.push(timeout);
  }
}
