import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QaAdminService } from '../../../core/services/qa-admin.service';

@Component({
  selector: 'app-qa-tags',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './qa-tags.component.html'
})
export class QaTagsComponent implements OnInit {
  private qaAdminService = inject(QaAdminService);

  tags = signal<any[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 50;
  totalPages = signal(1);
  totalCount = signal(0);

  // Merge modal
  showMergeModal = signal(false);
  selectedTags = signal<string[]>([]);
  targetTag = signal('');
  actionLoading = signal(false);

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.loading.set(true);
    this.qaAdminService.getTags(this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        if (response.success) {
          this.tags.set(response.data.items);
          this.totalCount.set(response.data.totalCount);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.loading.set(false);
      }
    });
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadTags();
  }

  toggleTagSelection(tag: string) {
    const current = this.selectedTags();
    if (current.includes(tag)) {
      this.selectedTags.set(current.filter(t => t !== tag));
    } else {
      this.selectedTags.set([...current, tag]);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  selectAllTags() {
    this.selectedTags.set(this.tags().map(t => t.tag));
  }

  openMergeModal() {
    if (this.selectedTags().length < 2) {
      alert('Please select at least 2 tags to merge');
      return;
    }
    this.targetTag.set('');
    this.showMergeModal.set(true);
  }

  closeMergeModal() {
    this.showMergeModal.set(false);
    this.targetTag.set('');
  }

  confirmMergeTags() {
    if (!this.targetTag().trim()) {
      alert('Please enter a target tag name');
      return;
    }

    this.actionLoading.set(true);
    this.qaAdminService.mergeTags(this.selectedTags(), this.targetTag()).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedTags.set([]);
          this.loadTags();
          this.closeMergeModal();
        }
        this.actionLoading.set(false);
      },
      error: (error) => {
        console.error('Error merging tags:', error);
        this.actionLoading.set(false);
      }
    });
  }

  deleteTag(tag: string) {
    if (!confirm(`Are you sure you want to delete the tag "${tag}"? This will remove it from all questions.`)) {
      return;
    }

    this.actionLoading.set(true);
    this.qaAdminService.deleteTag(tag).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTags();
        }
        this.actionLoading.set(false);
      },
      error: (error) => {
        console.error('Error deleting tag:', error);
        this.actionLoading.set(false);
      }
    });
  }

  clearSelection() {
    this.selectedTags.set([]);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
