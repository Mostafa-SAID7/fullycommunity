import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'in-app';
  subject: string;
  content: string;
  isActive: boolean;
  triggers: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  batchSize: number;
  retryAttempts: number;
  cooldownPeriod: number;
}

@Component({
  selector: 'app-notifications-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Notifications Management</h1>
          <p class="text-gray-600 mt-1">Manage system notifications, templates, and delivery settings</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="createTemplate()" 
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            New Template
          </button>
          <button (click)="refreshData()" 
                  [disabled]="loading()"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            <svg class="w-4 h-4" [class.animate-spin]="loading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Global Settings</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="space-y-3">
            <label class="flex items-center">
              <input type="checkbox" 
                     [(ngModel)]="settings().emailEnabled"
                     (change)="updateSettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
              <span class="ml-2 text-sm font-medium text-gray-700">Email Notifications</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" 
                     [(ngModel)]="settings().pushEnabled"
                     (change)="updateSettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
              <span class="ml-2 text-sm font-medium text-gray-700">Push Notifications</span>
            </label>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center">
              <input type="checkbox" 
                     [(ngModel)]="settings().smsEnabled"
                     (change)="updateSettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
              <span class="ml-2 text-sm font-medium text-gray-700">SMS Notifications</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" 
                     [(ngModel)]="settings().inAppEnabled"
                     (change)="updateSettings()"
                     class="rounded border-gray-300 text-primary focus:ring-primary">
              <span class="ml-2 text-sm font-medium text-gray-700">In-App Notifications</span>
            </label>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Batch Size</label>
              <input type="number" 
                     [(ngModel)]="settings().batchSize"
                     (change)="updateSettings()"
                     min="1" max="1000"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Retry Attempts</label>
              <input type="number" 
                     [(ngModel)]="settings().retryAttempts"
                     (change)="updateSettings()"
                     min="0" max="10"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>
          </div>
        </div>
      </div>

      <!-- Templates List -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Notification Templates</h2>
        </div>
        
        <div class="p-6">
          <div *ngIf="loading()" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Loading templates...</p>
          </div>

          <div *ngIf="!loading() && templates().length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-3"/>
            </svg>
            <p>No notification templates found</p>
            <button (click)="createTemplate()" 
                    class="mt-2 text-primary hover:text-primary-hover font-medium">
              Create your first template
            </button>
          </div>

          <div *ngIf="!loading() && templates().length > 0" class="space-y-4">
            <div *ngFor="let template of templates()" 
                 class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ template.name }}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getTypeClass(template.type)">
                      {{ template.type | titlecase }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                      {{ template.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ template.subject }}</p>
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span>Triggers: {{ template.triggers.join(', ') }}</span>
                    <span>Updated: {{ template.updatedAt | date:'short' }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="editTemplate(template)" 
                          class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button (click)="toggleTemplate(template)" 
                          class="p-2 transition-colors"
                          [class]="template.isActive ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path *ngIf="template.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      <path *ngIf="!template.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                  <button (click)="deleteTemplate(template)" 
                          class="p-2 text-red-400 hover:text-red-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Emails Sent Today</p>
              <p class="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Push Notifications</p>
              <p class="text-2xl font-bold text-gray-900">892</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">SMS Sent</p>
              <p class="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Delivery Rate</p>
              <p class="text-2xl font-bold text-gray-900">98.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationsManagementComponent implements OnInit {
  
  loading = signal(false);
  templates = signal<NotificationTemplate[]>([]);
  settings = signal<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    inAppEnabled: true,
    batchSize: 100,
    retryAttempts: 3,
    cooldownPeriod: 300
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    
    // Mock data for now
    setTimeout(() => {
      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          type: 'email',
          subject: 'Welcome to Community Car!',
          content: 'Thank you for joining our community...',
          isActive: true,
          triggers: ['user_registered'],
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          name: 'Content Approved',
          type: 'push',
          subject: 'Your content has been approved',
          content: 'Great news! Your content has been approved and is now live.',
          isActive: true,
          triggers: ['content_approved'],
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 7200000)
        },
        {
          id: '3',
          name: 'Password Reset',
          type: 'email',
          subject: 'Reset Your Password',
          content: 'Click the link below to reset your password...',
          isActive: true,
          triggers: ['password_reset_requested'],
          createdAt: new Date(Date.now() - 259200000),
          updatedAt: new Date(Date.now() - 10800000)
        }
      ];
      
      this.templates.set(mockTemplates);
      this.loading.set(false);
    }, 1000);
  }

  refreshData() {
    this.loadData();
  }

  createTemplate() {
    console.log('Create new template');
    // Implementation for creating new template
  }

  editTemplate(template: NotificationTemplate) {
    console.log('Edit template:', template);
    // Implementation for editing template
  }

  toggleTemplate(template: NotificationTemplate) {
    template.isActive = !template.isActive;
    template.updatedAt = new Date();
    console.log('Toggle template:', template);
    // Implementation for toggling template status
  }

  deleteTemplate(template: NotificationTemplate) {
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      const currentTemplates = this.templates();
      this.templates.set(currentTemplates.filter(t => t.id !== template.id));
      console.log('Delete template:', template);
      // Implementation for deleting template
    }
  }

  updateSettings() {
    console.log('Update settings:', this.settings());
    // Implementation for updating settings
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'push':
        return 'bg-green-100 text-green-800';
      case 'sms':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-app':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}