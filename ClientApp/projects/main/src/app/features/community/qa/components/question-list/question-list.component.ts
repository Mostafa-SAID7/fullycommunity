import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuestionListDto } from '../../../../../core/services/community/qa.service';
import { LoadingStateComponent } from '../../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './question-list.component.html'
})
export class QuestionListComponent {
  // Inputs
  questions = input.required<QuestionListDto[]>();
  loading = input.required<boolean>();
  error = input.required<string | null>();
  viewMode = input.required<'card' | 'compact'>();
  hasFilters = input.required<boolean>();

  // Outputs
  clearFilters = output<void>();
  askQuestion = output<void>();
}
