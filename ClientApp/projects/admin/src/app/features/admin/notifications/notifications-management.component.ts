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
  templateUrl: './notifications-management.component.html',
  styleUrl: './notifications-management.component.scss'
  
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
        return 'type-email';
      case 'push':
        return 'type-push';
      case 'sms':
        return 'type-sms';
      case 'in-app':
        return 'type-in-app';
      default:
        return 'type-default';
    }
  }
}