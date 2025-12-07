import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QAService, QuestionDto, AnswerDto } from '../../../../core/services/community/qa.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qaService = inject(QAService);
  private authService = inject(AuthService);

  question = signal<QuestionDto | null>(null);
  answers = signal<AnswerDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  submitError = signal<string | null>(null);

  newAnswer = '';

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuestion(id);
    }
  }

  loadQuestion(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.qaService.getQuestion(id).subscribe({
      next: (question) => {
        this.question.set(question);
        this.loadAnswers(id);
      },
      error: (err) => {
        console.error('Failed to load question:', err);
        this.error.set('Failed to load question');
        this.loading.set(false);
      }
    });
  }

  loadAnswers(questionId: string) {
    this.qaService.getAnswers(questionId).subscribe({
      next: (answers) => {
        this.answers.set(answers);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load answers:', err);
        this.loading.set(false);
      }
    });
  }

  submitAnswer() {
    if (!this.newAnswer.trim() || !this.question()?.id) return;

    // Check authentication before submitting
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.qaService.createAnswer(this.question()!.id, {
      content: this.newAnswer
    }).subscribe({
      next: () => {
        this.newAnswer = '';
        this.submitting.set(false);
        this.submitError.set(null);
        this.loadQuestion(this.question()!.id);
      },
      error: (err) => {
        console.error('Failed to submit answer:', err);
        this.submitting.set(false);
        
        // Show user-friendly error message
        if (err.status === 401) {
          // Redirect to login if token expired
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

  scrollToAnswerForm() {
    document.getElementById('answer-form')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  goBack() {
    this.router.navigate(['/community/qa']);
  }

  getAuthorName(author: any): string {
    return `${author.firstName} ${author.lastName}`.trim();
  }

  voteQuestion(voteType: 1 | -1) {
    if (!this.question()?.id) return;

    const currentQuestion = this.question();
    if (!currentQuestion) return;

    // Determine the actual vote to send based on current state
    const currentVote = currentQuestion.currentUserVote || 0;
    let actualVote: 1 | -1;

    // If clicking the same vote, it will be removed (backend handles this)
    // If clicking opposite vote, it will change
    actualVote = voteType;

    this.qaService.voteQuestion(currentQuestion.id, actualVote).subscribe({
      next: (result) => {
        // Update both vote count and user's vote state
        const newUserVote = currentVote === voteType ? 0 : voteType;
        this.question.set({
          ...currentQuestion,
          voteCount: result.voteCount,
          currentUserVote: newUserVote
        });
      },
      error: (err) => {
        console.error('Failed to vote on question:', err);
        if (err.status === 401) {
          this.submitError.set('You must be logged in to vote.');
        } else {
          this.submitError.set('Failed to vote. Please try again.');
        }
      }
    });
  }

  voteAnswer(answerId: string, voteType: 1 | -1) {
    const currentAnswers = this.answers();
    const answer = currentAnswers.find(a => a.id === answerId);
    if (!answer) return;

    const currentVote = answer.currentUserVote || 0;

    this.qaService.voteAnswer(answerId, voteType).subscribe({
      next: (result) => {
        // Update both vote count and user's vote state
        const newUserVote = currentVote === voteType ? 0 : voteType;
        const updatedAnswers = currentAnswers.map(a =>
          a.id === answerId
            ? { ...a, voteCount: result.voteCount, currentUserVote: newUserVote }
            : a
        );
        this.answers.set(updatedAnswers);
      },
      error: (err) => {
        console.error('Failed to vote on answer:', err);
        if (err.status === 401) {
          this.submitError.set('You must be logged in to vote.');
        } else {
          this.submitError.set('Failed to vote. Please try again.');
        }
      }
    });
  }
}
