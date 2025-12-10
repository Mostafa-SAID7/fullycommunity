import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  lastRun: Date;
  nextRun: Date;
  size: string;
  duration: string;
}

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  type: 'cleanup' | 'optimization' | 'update' | 'security';
  status: 'pending' | 'running' | 'completed' | 'failed';
  scheduledAt: Date;
  estimatedDuration: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

@Component({
  selector: 'app-maintenance-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Maintenance & Backup</h1>
          <p class="text-gray-600 mt-1">System maintenance, backups, and automated tasks</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="scheduleBackup()" 
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-3m0 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0V7"/>
            </svg>
            Schedule Backup
          </button>
          <button (click)="scheduleMaintenance()" 
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Schedule Task
          </button>
        </div>
      </div>

      <!-- System Status -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">System Status</p>
              <p class="text-lg font-bold text-green-600">Healthy</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Last Backup</p>
              <p class="text-lg font-bold text-gray-900">2 hours ago</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Uptime</p>
              <p class="text-lg font-bold text-gray-900">99.9%</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Pending Tasks</p>
              <p class="text-lg font-bold text-gray-900">{{ pendingTasks() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Backup Jobs -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Backup Jobs</h2>
            <button (click)="runBackupNow()" 
                    class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              Run Now
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div *ngFor="let backup of backupJobs()" 
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ backup.name }}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getBackupTypeClass(backup.type)">
                      {{ backup.type | titlecase }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getStatusClass(backup.status)">
                      {{ backup.status | titlecase }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Last Run:</span>
                      <span class="ml-1">{{ backup.lastRun | date:'short' }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Next Run:</span>
                      <span class="ml-1">{{ backup.nextRun | date:'short' }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Size:</span>
                      <span class="ml-1">{{ backup.size }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Duration:</span>
                      <span class="ml-1">{{ backup.duration }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="editBackup(backup)" 
                          class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button (click)="runBackup(backup)" 
                          class="p-2 text-green-400 hover:text-green-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Tasks -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Scheduled Maintenance Tasks</h2>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div *ngFor="let task of maintenanceTasks()" 
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ task.name }}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getTaskTypeClass(task.type)">
                      {{ task.type | titlecase }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getPriorityClass(task.priority)">
                      {{ task.priority | titlecase }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="getStatusClass(task.status)">
                      {{ task.status | titlecase }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ task.description }}</p>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Scheduled:</span>
                      <span class="ml-1">{{ task.scheduledAt | date:'short' }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Duration:</span>
                      <span class="ml-1">{{ task.estimatedDuration }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Priority:</span>
                      <span class="ml-1">{{ task.priority | titlecase }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="editTask(task)" 
                          class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button (click)="runTask(task)" 
                          [disabled]="task.status === 'running'"
                          class="p-2 text-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Window -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Maintenance Window Settings</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input type="time" 
                   [(ngModel)]="maintenanceWindow.startTime"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input type="time" 
                   [(ngModel)]="maintenanceWindow.endTime"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select [(ngModel)]="maintenanceWindow.timezone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <button (click)="updateMaintenanceWindow()" 
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            Update Settings
          </button>
        </div>
      </div>
    </div>
  `
})
export class MaintenanceManagementComponent implements OnInit {
  loading = signal(false);
  backupJobs = signal<BackupJob[]>([]);
  maintenanceTasks = signal<MaintenanceTask[]>([]);
  
  maintenanceWindow = {
    startTime: '02:00',
    endTime: '04:00',
    timezone: 'UTC'
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    
    // Mock data
    setTimeout(() => {
      const mockBackups: BackupJob[] = [
        {
          id: '1',
          name: 'Daily Full Backup',
          type: 'full',
          status: 'completed',
          lastRun: new Date(Date.now() - 7200000),
          nextRun: new Date(Date.now() + 79200000),
          size: '2.4 GB',
          duration: '45 min'
        },
        {
          id: '2',
          name: 'Hourly Incremental',
          type: 'incremental',
          status: 'scheduled',
          lastRun: new Date(Date.now() - 3600000),
          nextRun: new Date(Date.now() + 1800000),
          size: '156 MB',
          duration: '5 min'
        }
      ];

      const mockTasks: MaintenanceTask[] = [
        {
          id: '1',
          name: 'Database Optimization',
          description: 'Optimize database indexes and clean up old data',
          type: 'optimization',
          status: 'pending',
          scheduledAt: new Date(Date.now() + 86400000),
          estimatedDuration: '2 hours',
          priority: 'medium'
        },
        {
          id: '2',
          name: 'Security Updates',
          description: 'Apply latest security patches and updates',
          type: 'security',
          status: 'pending',
          scheduledAt: new Date(Date.now() + 172800000),
          estimatedDuration: '1 hour',
          priority: 'high'
        }
      ];

      this.backupJobs.set(mockBackups);
      this.maintenanceTasks.set(mockTasks);
      this.loading.set(false);
    }, 1000);
  }

  pendingTasks(): number {
    return this.maintenanceTasks().filter(task => task.status === 'pending').length;
  }

  scheduleBackup() {
    console.log('Schedule new backup');
  }

  scheduleMaintenance() {
    console.log('Schedule new maintenance task');
  }

  runBackupNow() {
    console.log('Run backup now');
  }

  editBackup(backup: BackupJob) {
    console.log('Edit backup:', backup);
  }

  runBackup(backup: BackupJob) {
    console.log('Run backup:', backup);
  }

  editTask(task: MaintenanceTask) {
    console.log('Edit task:', task);
  }

  runTask(task: MaintenanceTask) {
    console.log('Run task:', task);
  }

  updateMaintenanceWindow() {
    console.log('Update maintenance window:', this.maintenanceWindow);
  }

  getBackupTypeClass(type: string): string {
    switch (type) {
      case 'full': return 'bg-blue-100 text-blue-800';
      case 'incremental': return 'bg-green-100 text-green-800';
      case 'differential': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTaskTypeClass(type: string): string {
    switch (type) {
      case 'cleanup': return 'bg-orange-100 text-orange-800';
      case 'optimization': return 'bg-purple-100 text-purple-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}