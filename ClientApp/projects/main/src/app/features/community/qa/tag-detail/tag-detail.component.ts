import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QAService } from '../../../../core/services/community/qa';
import { QuestionListDto } from '../../../../core/interfaces/community/qa';
import { QuestionListComponent } from '../components/question-list/question-list.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [CommonModule, QuestionListComponent, LoadingStateComponent],
  templateUrl: './tag-detail.component.html'
})
export class TagDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qaService = inject(QAService);

  // State
  tag = signal<string>('');
  questions = signal<QuestionListDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  totalCount = signal(0);
  
  // Sorting
  sortBy = signal('newest');
  viewMode: 'card' | 'compact' = 'card';

  // Related tags (tags that appear frequently with this tag)
  relatedTags = signal<Array<{ tag: string; count: number }>>([]);

  // Sort options
  sortOptions = [
    { value: 'newest', label: 'Newest', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { value: 'votes', label: 'Most Votes', icon: 'M5 15l7-7 7 7' },
    { value: 'unanswered', label: 'Unanswered', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { value: 'active', label: 'Most Active', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const tag = params['tag'];
      if (tag) {
        this.tag.set(tag);
        this.loadQuestions();
        this.loadRelatedTags();
      }
    });
  }

  loadQuestions() {
    this.loading.set(true);
    this.error.set(null);

    this.qaService.getQuestions({
      tag: this.tag(),
      sortBy: this.sortBy() as any
    }).subscribe({
      next: (result: any) => {
        this.questions.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load questions for tag:', err);
        this.error.set('Failed to load questions. Please try again.');
        this.loading.set(false);
      }
    });
  }

  loadRelatedTags() {
    // Get all questions with this tag and extract other tags
    const questions = this.questions();
    const tagCounts = new Map<string, number>();

    questions.forEach(q => {
      q.tags?.forEach(t => {
        if (t !== this.tag()) {
          tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
        }
      });
    });

    // Convert to array and sort by count
    const related = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    this.relatedTags.set(related);
  }

  selectSort(value: string) {
    this.sortBy.set(value);
    this.loadQuestions();
  }

  navigateToTag(tag: string) {
    this.router.navigate(['/community/qa/tag', tag]);
  }

  goBack() {
    this.router.navigate(['/community/qa']);
  }

  askQuestion() {
    this.router.navigate(['/community/qa'], { 
      queryParams: { tag: this.tag() } 
    });
  }
}
