import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QAService, QuestionListDto } from '../../../../../core/services/community/qa.service';

@Component({
  selector: 'app-related-questions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './related-questions.component.html'
})
export class RelatedQuestionsComponent implements OnInit {
  private qaService = inject(QAService);

  // Input
  questionId = input.required<string>();
  count = input<number>(5);

  // State
  relatedQuestions = signal<QuestionListDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadRelatedQuestions();
  }

  loadRelatedQuestions() {
    const id = this.questionId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.qaService.getRelatedQuestions(id, this.count()).subscribe({
      next: (questions) => {
        this.relatedQuestions.set(questions);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load related questions:', err);
        this.error.set('Failed to load related questions');
        this.loading.set(false);
      }
    });
  }
}
