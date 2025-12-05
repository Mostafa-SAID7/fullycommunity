import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QAService, QuestionListItem } from '../../../../core/services/community/qa.service';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-trending-questions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trending-questions.component.html'
})
export class TrendingQuestionsComponent implements OnInit {
  private qaService = inject(QAService);

  questions = signal<QuestionListItem[]>([]);
  loadingState = signal<LoadingState>({ isLoading: true, error: null });

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loadingState.set({ isLoading: true, error: null });

    this.qaService.getQuestions({ sortBy: 'active' }, 1, 5).subscribe({
      next: (result: any) => {
        this.questions.set(result.items || []);
        this.loadingState.set({ isLoading: false, error: null });
      },
      error: (error) => {
        console.error('Error loading trending questions:', error);
        this.questions.set([]);
        this.loadingState.set({ 
          isLoading: false, 
          error: 'Failed to load trending questions. Please try again.' 
        });
      }
    });
  }

  retryLoad(): void {
    this.loadQuestions();
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const questionDate = new Date(date);
    const diff = now.getTime() - questionDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}