import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityLogService, ActivityLogEntry } from '../../../core/services/activity/activity-log.service';
import { RefreshButtonComponent } from '../../../shared/ui/buttons/refresh-button/refresh-button.component';
import { PaginationComponent } from '../../../shared/ui/navigation/pagination/pagination.component';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, FormsModule, RefreshButtonComponent, PaginationComponent],
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss'
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

  onPageChange(page: number) {
    this.currentPage = page;
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

  getActionTypeClass(actionType: string): string {
    switch (actionType) {
      case 'user_created':
      case 'user_updated':
        return 'dot-success';
      case 'user_deleted':
        return 'dot-danger';
      case 'content_moderated':
        return 'dot-warning';
      case 'settings_changed':
        return 'dot-info';
      case 'login':
        return 'dot-primary';
      case 'logout':
        return 'dot-secondary';
      default:
        return 'dot-secondary';
    }
  }

  getActionTypeBadgeClass(actionType: string): string {
    switch (actionType) {
      case 'user_created':
      case 'user_updated':
        return 'badge-success';
      case 'user_deleted':
        return 'badge-danger';
      case 'content_moderated':
        return 'badge-warning';
      case 'settings_changed':
        return 'badge-info';
      case 'login':
        return 'badge-primary';
      case 'logout':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  }
}