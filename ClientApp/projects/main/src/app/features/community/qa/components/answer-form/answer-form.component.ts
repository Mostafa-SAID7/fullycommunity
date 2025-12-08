import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QAService } from '../../../../../core/services/community/qa.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-answer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './answer-form.component.html'
})
export class AnswerFormComponent {
  private router = inject(Router);
  private qaService = inject(QAService);
  private authService = inject(AuthService);

  // Inputs
  questionId = input.required<string>();

  // Outputs
  answerSubmitted = output<void>();

  // State
  newAnswer = signal('');
  submitting = signal(false);
  submitError = signal<string | null>(null);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  submitAnswer() {
    const content = this.newAnswer().trim();
    if (!content || !this.questionId()) return;

    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.qaService.createAnswer(this.questionId(), { content }).subscribe({
      next: () => {
        this.newAnswer.set('');
        this.submitting.set(false);
        this.submitError.set(null);
        this.answerSubmitted.emit();
      },
      error: (err) => {
        console.error('Failed to submit answer:', err);
        this.submitting.set(false);
        
        if (err.status === 401) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        } else if (err.status === 403) {
          this.submitError.set('You do not have permission to post an answer.');
        } else if (err.status === 404) {
          this.submitError.set('Question not found.');
        } else {
          this.submitError.set('Failed to post answer. Please try again.');
        }
      }
    });
  }

  updateAnswer(value: string) {
    this.newAnswer.set(value);
  }
}
