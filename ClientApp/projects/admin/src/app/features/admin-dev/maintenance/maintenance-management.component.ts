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
  templateUrl: './maintenance-management.component.html',
  styleUrls: ['./maintenance-management.component.scss']
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