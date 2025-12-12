import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AdminDashboardOverview } from '../../../core/interfaces/dashboard/dashboard.interface';
import { RefreshButtonComponent } from '../../../shared/components/refresh-button/refresh-button.component';
import { StatCardComponent, StatCardConfig } from '../../../shared/components/charts/stat-card.component';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'content_posted' | 'content_moderated' | 'system_alert';
  message: string;
  timestamp: Date;
  user?: string;
  severity?: 'info' | 'warning' | 'error';
}

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RefreshButtonComponent, StatCardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private destroy$ = new Subject<void>();
  private refreshTimeouts: number[] = []; // Track timeouts for cleanup
  
  overview = signal<AdminDashboardOverview | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  recentActivity = signal<RecentActivity[]>([]);
  systemHealth = signal<'healthy' | 'warning' | 'critical'>('healthy');
  
  // Refresh button state
  refreshStatus = signal<'success' | 'error' | 'warning' | null>(null);
  lastRefreshTime = signal<Date | null>(null);
  
  // Computed stat cards
  get statCards(): StatCardConfig[] {
    const overview = this.overview();
    if (!overview) return [];
    
    return [
      {
        title: 'Total Users',
        value: overview.users.totalUsers,
        icon: '👥',
        color: 'primary',
        subtitle: `${overview.users.activeUsers} active`,
        trend: {
          value: Math.round((overview.users.newUsersThisMonth / overview.users.totalUsers) * 100),
          direction: 'up'
        }
      },
      {
        title: 'Content Items',
        value: this.getTotalContent(),
        icon: '📄',
        color: 'info',
        subtitle: 'Posts, Reviews, Guides'
      },
      {
        title: 'Pending Moderation',
        value: overview.content.pendingModeration,
        icon: '⚠️',
        color: overview.content.pendingModeration > 0 ? 'warning' : 'success',
        subtitle: overview.content.pendingModeration > 0 ? 'Action needed' : 'All clear'
      },
      {
        title: 'Active Communities',
        value: overview.community.activeDiscussions,
        icon: '🚀',
        color: 'success',
        subtitle: `${overview.community.totalComments} comments`,
        trend: {
          value: 12,
          direction: 'up'
        }
      }
    ];
  }
  
  quickActions: QuickAction[] = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      route: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Content Moderation',
      description: 'Review and moderate user content',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      route: '/admin/moderation',
      color: 'bg-green-500'
    },
    {
      title: 'Analytics & Reports',
      description: 'View detailed analytics and reports',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      route: '/admin/reports',
      color: 'bg-purple-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      route: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  ngOnInit() {
    this.loadDashboard();
    this.loadRecentActivity();
    this.startRealTimeUpdates();
  }

  ngOnDestroy() {
    // Clear all pending timeouts
    this.refreshTimeouts.forEach(timeout => clearTimeout(timeout));
    this.refreshTimeouts = [];
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard() {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardService.getOverview()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.overview.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load dashboard data. Please try again.');
          this.loading.set(false);
          console.error('Dashboard error:', err);
        },
      });
  }

  loadRecentActivity() {
    // Mock recent activity data
    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'user_registered',
        message: 'New user registered: john.doe@example.com',
        timestamp: new Date(Date.now() - 300000),
        user: 'System'
      },
      {
        id: '2',
        type: 'content_posted',
        message: 'New video uploaded: "Car Maintenance Tips"',
        timestamp: new Date(Date.now() - 600000),
        user: 'jane.smith'
      },
      {
        id: '3',
        type: 'content_moderated',
        message: 'Content flagged for review: Inappropriate comment',
        timestamp: new Date(Date.now() - 900000),
        user: 'Moderator',
        severity: 'warning'
      },
      {
        id: '4',
        type: 'system_alert',
        message: 'High server load detected',
        timestamp: new Date(Date.now() - 1200000),
        user: 'System',
        severity: 'warning'
      },
      {
        id: '5',
        type: 'user_registered',
        message: 'New user registered: mike.wilson@example.com',
        timestamp: new Date(Date.now() - 1500000),
        user: 'System'
      }
    ];
    
    this.recentActivity.set(mockActivity);
  }

  startRealTimeUpdates() {
    // Update dashboard every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadDashboard();
        this.updateSystemHealth();
      });
  }

  updateSystemHealth() {
    // Mock system health check
    const healthStates: ('healthy' | 'warning' | 'critical')[] = ['healthy', 'warning', 'critical'];
    const randomHealth = healthStates[Math.floor(Math.random() * 3)];
    
    // Bias towards healthy state
    if (Math.random() > 0.8) {
      this.systemHealth.set(randomHealth);
    } else {
      this.systemHealth.set('healthy');
    }
  }

  getTotalContent(): number {
    const overview = this.overview();
    if (!overview) return 0;
    return (
      overview.content.totalPosts +
      overview.content.totalQuestions +
      overview.content.totalReviews +
      overview.content.totalGuides +
      overview.content.totalPodcasts
    );
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'user_registered':
        return 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z';
      case 'content_posted':
        return 'M12 6v6m0 0v6m0-6h6m-6 0H6';
      case 'content_moderated':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'system_alert':
        return 'M15 17h5l-5 5v-5z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getActivityColor(type: string, severity?: string): string {
    if (severity === 'error') return 'text-red-600';
    if (severity === 'warning') return 'text-yellow-600';
    
    switch (type) {
      case 'user_registered':
        return 'text-green-600';
      case 'content_posted':
        return 'text-blue-600';
      case 'content_moderated':
        return 'text-orange-600';
      case 'system_alert':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  refreshDashboard() {
    this.loading.set(true);
    this.refreshStatus.set(null);
    
    // Clear existing timeouts
    this.refreshTimeouts.forEach(timeout => clearTimeout(timeout));
    this.refreshTimeouts = [];
    
    Promise.all([
      this.loadDashboard(),
      this.loadRecentActivity()
    ]).then(() => {
      this.refreshStatus.set('success');
      this.lastRefreshTime.set(new Date());
      
      // Clear success status after 3 seconds
      const timeout1 = window.setTimeout(() => {
        this.refreshStatus.set(null);
      }, 3000);
      this.refreshTimeouts.push(timeout1);
    }).catch(() => {
      this.refreshStatus.set('error');
      
      // Clear error status after 5 seconds
      const timeout2 = window.setTimeout(() => {
        this.refreshStatus.set(null);
      }, 5000);
      this.refreshTimeouts.push(timeout2);
    }).finally(() => {
      this.loading.set(false);
    });
  }

  getActionColorClass(tailwindColor: string): string {
    switch (tailwindColor) {
      case 'bg-blue-500':
        return 'blue';
      case 'bg-green-500':
        return 'green';
      case 'bg-purple-500':
        return 'purple';
      case 'bg-gray-500':
        return 'gray';
      default:
        return 'blue';
    }
  }

  getActivityIconClass(type: string): string {
    switch (type) {
      case 'user_registered':
        return 'blue';
      case 'content_posted':
        return 'green';
      case 'content_moderated':
        return 'yellow';
      case 'system_alert':
        return 'red';
      default:
        return 'blue';
    }
  }
}
