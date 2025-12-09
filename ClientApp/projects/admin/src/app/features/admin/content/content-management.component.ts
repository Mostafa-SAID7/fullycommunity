import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminContentService } from '../../../core/services/content/admin-content.service';
import { ContentItem, ContentStats } from '../../../core/interfaces/content/admin-content.interface';

@Component({
  selector: 'content-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-management.component.html'
})
export class ContentManagementComponent implements OnInit {
  private contentService = inject(AdminContentService);
  
  stats = signal<ContentStats | null>(null);
  content = signal<ContentItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  searchTerm = '';
  selectedType = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  ngOnInit() {
    this.loadStats();
    this.loadContent();
  }

  loadStats() {
    this.contentService.getContentStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadContent() {
    this.loading.set(true);
    this.error.set(null);

    this.contentService.getPosts(this.currentPage, this.pageSize, this.selectedStatus)
      .subscribe({
        next: (response) => {
          this.content.set(response.items || []);
          this.totalCount = response.totalCount || 0;
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load content. Please try again.');
          this.loading.set(false);
        }
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadContent();
  }

  getTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'post': 'type-post',
      'review': 'type-review',
      'guide': 'type-guide',
      'question': 'type-question',
      'podcast': 'type-podcast'
    };
    return classes[type] || 'type-post';
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'published': 'status-published',
      'draft': 'status-draft',
      'pending': 'status-pending',
      'rejected': 'status-rejected'
    };
    return classes[status] || 'status-draft';
  }

  approveContent(item: ContentItem) {
    this.contentService.approveContent(item.type, item.id).subscribe({
      next: () => this.loadContent(),
      error: (err) => console.error('Error approving content:', err)
    });
  }

  rejectContent(item: ContentItem) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.contentService.rejectContent(item.type, item.id, reason).subscribe({
        next: () => this.loadContent(),
        error: (err) => console.error('Error rejecting content:', err)
      });
    }
  }

  deleteContent(item: ContentItem) {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      this.contentService.deleteContent(item.type, item.id).subscribe({
        next: () => this.loadContent(),
        error: (err) => console.error('Error deleting content:', err)
      });
    }
  }

  exportData() {
    console.log('Export data');
  }
}
