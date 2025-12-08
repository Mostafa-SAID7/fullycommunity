import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { QaAdminService, QAStats, QuestionListItem, Category } from '../../../core/services/qa-admin.service';

@Component({
  selector: 'app-qa-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './qa-questions.component.html'
})
export class QaQuestionsComponent implements OnInit {
  private qaAdminService = inject(QaAdminService);
  private router = inject(Router);

  stats = signal<QAStats | null>(null);
  questions = signal<QuestionListItem[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  
  // Filters
  currentPage = signal(1);
  pageSize = 20;
  totalPages = signal(1);
  totalCount = signal(0);
  selectedStatus = signal<string>('');
  searchQuery = signal('');

  // UI State
  selectedQuestion = signal<QuestionListItem | null>(null);
  showCloseModal = signal(false);
  closeReason = signal('');
  actionLoading = signal(false);

  ngOnInit() {
    this.loadStats();
    this.loadQuestions();
    this.loadCategories();
  }

  loadStats() {
    this.qaAdminService.getStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats.set(response.data);
        }
      },
      error: (error) => console.error('Error loading stats:', error)
    });
  }

  loadQuestions() {
    this.loading.set(true);
    this.qaAdminService.getQuestions(
      this.currentPage(),
      this.pageSize,
      this.selectedStatus() || undefined,
      this.searchQuery() || undefined
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.questions.set(response.data.items);
          this.totalCount.set(response.data.totalCount);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.loading.set(false);
      }
    });
  }

  loadCategories() {
    this.qaAdminService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories.set(response.data);
        }
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadQuestions();
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadQuestions();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadQuestions();
  }

  viewQuestion(question: QuestionListItem) {
    // Open in new tab to main app
    window.open(`/community/qa/${question.id}`, '_blank');
  }

  openCloseModal(question: QuestionListItem) {
    this.selectedQuestion.set(question);
    this.closeReason.set('');
    this.showCloseModal.set(true);
  }

  closeModal() {
    this.showCloseModal.set(false);
    this.selectedQuestion.set(null);
    this.closeReason.set('');
  }

  confirmCloseQuestion() {
    const question = this.selectedQuestion();
    if (!question || !this.closeReason().trim()) return;

    this.actionLoading.set(true);
    this.qaAdminService.closeQuestion(question.id, this.closeReason()).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadQuestions();
          this.loadStats();
          this.closeModal();
        }
        this.actionLoading.set(false);
      },
      error: (error) => {
        console.error('Error closing question:', error);
        this.actionLoading.set(false);
      }
    });
  }

  reopenQuestion(question: QuestionListItem) {
    if (!confirm('Are you sure you want to reopen this question?')) return;

    this.actionLoading.set(true);
    this.qaAdminService.reopenQuestion(question.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadQuestions();
          this.loadStats();
        }
        this.actionLoading.set(false);
      },
      error: (error) => {
        console.error('Error reopening question:', error);
        this.actionLoading.set(false);
      }
    });
  }

  deleteQuestion(question: QuestionListItem) {
    if (!confirm(`Are you sure you want to delete "${question.title}"? This action cannot be undone.`)) return;

    this.actionLoading.set(true);
    this.qaAdminService.deleteQuestion(question.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadQuestions();
          this.loadStats();
        }
        this.actionLoading.set(false);
      },
      error: (error) => {
        console.error('Error deleting question:', error);
        this.actionLoading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'answered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
