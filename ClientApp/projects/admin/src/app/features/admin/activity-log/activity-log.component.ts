import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityLogService, ActivityLogEntry } from '../../../core/services/activity/activity-log.service';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p class="text-gray-600 mt-1">Track all administrative actions and system events</p>
        </div>
        <button (click)="refreshLog()" 
                [disabled]="loading"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
          <svg class="w-4 h-4" [class.animate-spin]="loading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <select [(ngModel)]="filters.actionType" 
                    (ngModelChange)="applyFilters()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">All Actions</option>
              <option value="user_created">User Created</option>
              <option value="user_updated">User Updated</option>
              <option value="user_deleted">User Deleted</option>
              <option value="content_moderated">Content Moderated</option>
              <option value="settings_changed">Settings Changed</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">User</label>
            <input type="text" 
                   [(ngModel)]="filters.user"
                   (ngModelChange)="applyFilters()"
                   placeholder="Filter by user..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input type="date" 
                   [(ngModel)]="filters.dateFrom"
                   (ngModelChange)="applyFilters()"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input type="date" 
                   [(ngModel)]="filters.dateTo"
                   (ngModelChange)="applyFilters()"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div class="p-6">
          <div *ngIf="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Loading activity log...</p>
          </div>

          <div *ngIf="!loading && filteredEntries.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p>No activity entries found</p>
          </div>

          <div *ngIf="!loading && filteredEntries.length > 0" class="space-y-4">
            <div *ngFor="let entry of filteredEntries; trackBy: trackByEntryId" 
                 class="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              
              <!-- Timeline Dot -->
              <div class="flex-shrink-0 mt-2">
                <div class="w-3 h-3 rounded-full" [class]="getActionTypeColor(entry.actionType)"></div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">{{ entry.action }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ entry.description }}</p>
                    
                    <!-- Details -->
                    <div *ngIf="entry.details" class="mt-2">
                      <div class="bg-gray-50 rounded-lg p-3">
                        <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ entry.details | json }}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Metadata -->
                  <div class="text-right flex-shrink-0">
                    <div class="text-sm font-medium text-gray-900">{{ entry.performedBy }}</div>
                    <div class="text-xs text-gray-500">{{ entry.timestamp | date:'medium' }}</div>
                    <div class="text-xs text-gray-500 mt-1">IP: {{ entry.ipAddress }}</div>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2" 
                          [class]="getActionTypeBadge(entry.actionType)">
                      {{ entry.actionType | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div *ngIf="!loading && filteredEntries.length > 0" class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalEntries) }} of {{ totalEntries }} entries
            </div>
            <div class="flex items-center gap-2">
              <button (click)="previousPage()" 
                      [disabled]="currentPage === 1"
                      class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span class="px-3 py-2 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
              <button (click)="nextPage()" 
                      [disabled]="currentPage === totalPages"
                      class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ActivityLogComponent implements OnInit {
  private activityLogService = inject(ActivityLogService);

  loading = false;
  entries: ActivityLogEntry[] = [];
  filteredEntries: ActivityLogEntry[] = [];
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalEntries = 0;
  totalPages = 0;

  // Make Math available in template
  Math = Math;

  // Filters
  filters = {
    actionType: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  };

  ngOnInit() {
    this.loadActivityLog();
  }

  loadActivityLog() {
    this.loading = true;
    
    this.activityLogService.getActivityLog(this.currentPage, this.pageSize, this.filters)
      .subscribe({
        next: (response) => {
          this.entries = response.entries;
          this.filteredEntries = response.entries;
          this.totalEntries = response.total;
          this.totalPages = Math.ceil(this.totalEntries / this.pageSize);
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load activity log:', error);
          this.loading = false;
        }
      });
  }

  refreshLog() {
    this.loadActivityLog();
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadActivityLog();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadActivityLog();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadActivityLog();
    }
  }

  trackByEntryId(index: number, entry: ActivityLogEntry): string {
    return entry.id;
  }

  getActionTypeColor(actionType: string): string {
    switch (actionType) {
      case 'user_created':
      case 'user_updated':
        return 'bg-green-500';
      case 'user_deleted':
        return 'bg-red-500';
      case 'content_moderated':
        return 'bg-yellow-500';
      case 'settings_changed':
        return 'bg-blue-500';
      case 'login':
        return 'bg-purple-500';
      case 'logout':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  }

  getActionTypeBadge(actionType: string): string {
    switch (actionType) {
      case 'user_created':
      case 'user_updated':
        return 'bg-green-100 text-green-800';
      case 'user_deleted':
        return 'bg-red-100 text-red-800';
      case 'content_moderated':
        return 'bg-yellow-100 text-yellow-800';
      case 'settings_changed':
        return 'bg-blue-100 text-blue-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}