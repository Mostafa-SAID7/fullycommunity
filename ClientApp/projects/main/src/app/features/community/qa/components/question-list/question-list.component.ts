import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuestionList } from '../../../../../core/interfaces/community/qa';


@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './question-list.component.html'
})
export class QuestionListComponent {
  // Inputs
  questions = input.required<QuestionList[]>();
  loading = input.required<boolean>();
  error = input.required<string | null>();
  viewMode = input.required<'card' | 'compact'>();
  hasFilters = input.required<boolean>();

  // Outputs
  clearFilters = output<void>();
  askQuestion = output<void>();
}
