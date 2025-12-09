import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSettingsService } from '../../../core/services/admin/settings.service';
import {
  SiteSettings,
  EmailSettings,
  SecuritySettings
} from '../../../core/interfaces/admin/settings.interface';
import { TabNavigationComponent, Tab } from '../../../shared/components/tab-navigation/tab-navigation.component';

@Component({
  selector: 'admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabNavigationComponent
  ],
  templateUrl: './admin-settings.component.html'
})
export class AdminSettingsComponent implements OnInit {
  private settingsService = inject(AdminSettingsService);
  
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

  loadSettings() {
    this.loading.set(true);

    this.settingsService.getSiteSettings().subscribe({
      next: (data) => this.siteSettings.set(data),
      error: (err) => console.error('Error loading site settings:', err)
    });

    this.settingsService.getEmailSettings().subscribe({
      next: (data) => this.emailSettings.set(data),
      error: (err) => console.error('Error loading email settings:', err)
    });

    this.settingsService.getSecuritySettings().subscribe({
      next: (data) => this.securitySettings.set(data),
      error: (err) => console.error('Error loading security settings:', err)
    });

    this.settingsService.getSystemInfo().subscribe({
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

    this.settingsService.updateSiteSettings(settings).subscribe({
      next: () => this.showSuccess('Site settings saved successfully'),
      error: (err) => this.showError('Failed to save site settings')
    });
  }

  saveEmailSettings() {
    const settings = this.emailSettings();
    if (!settings) return;

    this.settingsService.updateEmailSettings(settings).subscribe({
      next: () => this.showSuccess('Email settings saved successfully'),
      error: (err) => this.showError('Failed to save email settings')
    });
  }

  saveSecuritySettings() {
    const settings = this.securitySettings();
    if (!settings) return;

    this.settingsService.updateSecuritySettings(settings).subscribe({
      next: () => this.showSuccess('Security settings saved successfully'),
      error: (err) => this.showError('Failed to save security settings')
    });
  }

  testEmailConnection() {
    this.settingsService.testEmailConnection().subscribe({
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
      this.settingsService.clearCache().subscribe({
        next: () => this.showSuccess('Cache cleared successfully'),
        error: (err) => this.showError('Failed to clear cache')
      });
    }
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }
}
